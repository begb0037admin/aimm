#!/usr/bin/env node
// Live route proof runner. Wrangler is not installed in the implementation
// environment, so its local help could not be checked. Cloudflare's current
// docs confirm JSON tail entries and show event.request.url, but the example
// does not show the response status field. This script expects
// event.response.status; confirm this field with the installed Wrangler before
// relying on request counts.

import { spawn } from 'node:child_process';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const execFileAsync = promisify(execFile);
const allowedRoutes = new Set(['agent', 'usage']);
const allowedAccounts = new Set(['auto', 'primary', 'backup']);

function parseArgs(args) {
  const options = { durationSeconds: 60 };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--route') options.route = args[++i];
    else if (arg === '--account') options.account = args[++i];
    else if (arg === '--start-time') options.startTime = args[++i];
    else if (arg === '--duration-seconds') options.durationSeconds = Number(args[++i]);
    else if (arg === '--op-ref') options.opRef = args[++i];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!allowedRoutes.has(options.route)) throw new Error('--route must be agent or usage');
  if (!allowedAccounts.has(options.account)) throw new Error('--account must be auto, primary or backup');
  if (!options.startTime || !Number.isFinite(Date.parse(options.startTime))) {
    throw new Error('--start-time must be a valid ISO date/time');
  }
  if (!Number.isInteger(options.durationSeconds) || options.durationSeconds < 1) {
    throw new Error('--duration-seconds must be a positive integer');
  }
  return options;
}

function redactUrl(value) {
  try {
    const url = new URL(value);
    for (const key of [...url.searchParams.keys()]) {
      if (key.toLowerCase() === 'token' || key.toLowerCase() === 'ticket') {
        url.searchParams.set(key, '[REDACTED]');
      }
    }
    return url.toString();
  } catch {
    return String(value).replace(/([?&](?:token|ticket)=)[^&#\s]*/gi, '$1[REDACTED]');
  }
}

async function getApiKey(opRef) {
  if (opRef) {
    const { stdout } = await execFileAsync('op', ['read', opRef], { encoding: 'utf8' });
    return stdout.trim();
  }
  return process.env.ELEVENLABS_API_KEY || '';
}

async function getRecentConversations(apiKey, afterMs) {
  const conversations = [];
  let cursor = '';
  do {
    const url = new URL('https://api.elevenlabs.io/v1/convai/conversations');
    url.searchParams.set('page_size', '100');
    if (cursor) url.searchParams.set('cursor', cursor);
    const response = await fetch(url, { headers: { 'xi-api-key': apiKey } });
    if (!response.ok) throw new Error(`ElevenLabs conversation request failed (HTTP ${response.status})`);
    const page = await response.json();
    for (const conversation of page.conversations || []) {
      const startMs = Number(conversation.start_time_unix_secs) * 1000;
      if (Number.isFinite(startMs) && startMs > afterMs) {
        conversations.push({
          agent_id: conversation.agent_id,
          conversation_id: conversation.conversation_id
        });
      }
    }
    cursor = page.has_more && page.next_cursor ? page.next_cursor : '';
  } while (cursor);
  return conversations;
}

function tailWorker(durationSeconds) {
  return new Promise((resolve, reject) => {
    const scriptDir = path.dirname(fileURLToPath(import.meta.url));
    const workerDir = path.resolve(scriptDir, '../worker');
    const counts = { luna: 0, speech: 0 };
    let buffer = '';
    let settled = false;
    const child = spawn('wrangler', ['tail', 'aimm-proxy', '--format', 'json'], {
      cwd: workerDir,
      stdio: ['ignore', 'pipe', 'ignore']
    });
    const finish = (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(stopTimer);
      if (error) reject(error);
      else resolve(counts);
    };
    const stopTimer = setTimeout(() => {
      child.kill('SIGTERM');
      setTimeout(() => { if (!child.killed) child.kill('SIGKILL'); }, 2000).unref();
    }, durationSeconds * 1000);

    child.on('error', () => finish(new Error('Could not start wrangler tail; ensure Wrangler is installed and authenticated.')));
    child.on('close', () => finish());
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', chunk => {
      buffer += chunk;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';
      for (const line of lines) countLine(line);
    });

    function countLine(line) {
      if (!line.trim()) return;
      let entry;
      try { entry = JSON.parse(line); } catch { return; }
      const requestUrl = entry?.event?.request?.url;
      const status = entry?.event?.response?.status;
      if (!requestUrl || !Number.isInteger(status)) return;
      let pathname;
      try { pathname = new URL(redactUrl(requestUrl)).pathname; } catch { return; }
      if (pathname === '/hope/luna') counts.luna++;
      if (pathname === '/hope/stt/stream') counts.speech++;
    }
  });
}

async function main() {
  let options;
  try { options = parseArgs(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 2; return; }

  const recordedStartTime = new Date(options.startTime);
  const recordedStartMs = recordedStartTime.getTime();
  const mode = `route=${options.route},account=${options.account}`;
  let apiKey;
  try { apiKey = await getApiKey(options.opRef); }
  catch {
    console.error('Could not read the ElevenLabs API key with op read.');
    process.exitCode = 1;
    return;
  }
  if (!apiKey) {
    console.error('Missing ElevenLabs API key: set ELEVENLABS_API_KEY or pass --op-ref <reference>.');
    process.exitCode = 1;
    return;
  }

  try {
    const [conversations, requests] = await Promise.all([
      getRecentConversations(apiKey, recordedStartMs),
      tailWorker(options.durationSeconds)
    ]);
    const agentIds = [...new Set(conversations.map(item => item.agent_id).filter(Boolean))];
    for (const conversation of conversations) {
      console.log(`conversation agent_id=${conversation.agent_id} conversation_id=${conversation.conversation_id}`);
    }
    console.log(`mode=${mode} start_time=${recordedStartTime.toISOString()} agent_id(s)=${agentIds.join(',') || 'none'} luna_requests=${requests.luna} speech_stream_requests=${requests.speech}`);
  } catch (error) {
    // Avoid printing request URLs, headers, response bodies, or child output.
    console.error(redactUrl(error.message || 'Live route proof failed.'));
    process.exitCode = 1;
  }
}

await main();
