import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

function sliceFunctions(startMarker, endMarker, label) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start, `${label} source is present`);
  return html.slice(start, end);
}

const accountSource = sliceFunctions(
  'const AIMM_HOPE_DEFAULT_AGENT_ID =',
  'function elIsUsageExhaustion(',
  'Hope account mapping'
);
const exhaustionSource = sliceFunctions(
  'function elIsUsageExhaustion(',
  '// Placeholder seeded into the key slots',
  'usage exhaustion matcher'
);
const usageModeSource = sliceFunctions(
  'const HOPE_USAGE_VOICE_ID =',
  'function hopeAccountPaint(',
  'Hope route mode helpers'
);
const routeToggleSource = sliceFunctions(
  'function hopeUsageToggleRoute(){',
  'const HOPE_USAGE_VOICE =',
  'Hope route toggle'
);
const elStartSource = sliceFunctions('async function elStart(startOptions={}){', 'async function elEnd(', 'elStart');

function localStorageStub(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); }
  };
}

function accountContext() {
  const context = vm.createContext({
    EL_AGENT_ID_STORAGE: 'test-agent-storage',
    localStorage: localStorageStub()
  });
  vm.runInContext(accountSource, context);
  return context;
}

test('Hope account choice defaults to Auto and safely handles stored choices', () => {
  const context = accountContext();
  const getChoice = vm.runInContext('getHopeAccountChoice', context);
  assert.equal(getChoice(), 'auto');

  context.localStorage.setItem('aimmHopeAccountChoice', 'primary');
  assert.equal(getChoice(), 'primary');
  context.localStorage.setItem('aimmHopeAccountChoice', 'backup');
  assert.equal(getChoice(), 'backup');
  context.localStorage.setItem('aimmHopeAccountChoice', 'unexpected');
  assert.equal(getChoice(), 'auto');
});

test('Hope agent ID maps Auto, Primary and Backup to the configured IDs', () => {
  const context = accountContext();
  const getAgentId = vm.runInContext('getHopeAgentId', context);
  assert.equal(getAgentId(), vm.runInContext('AIMM_DEFAULT_AGENT_IDS[EL_AGENT_ID_STORAGE]', context));

  context.localStorage.setItem('aimmHopeAccountChoice', 'primary');
  assert.equal(getAgentId(), 'agent_9001m42hnyrwedts40en5a5npapp');
  context.localStorage.setItem('aimmHopeAccountChoice', 'backup');
  assert.equal(getAgentId(), 'agent_2601kqm4g7txfsvv0pkvpe02389p');
  context.localStorage.setItem('aimmHopeAccountChoice', 'invalid');
  assert.equal(getAgentId(), vm.runInContext('AIMM_DEFAULT_AGENT_IDS[EL_AGENT_ID_STORAGE]', context));
});

test('Auto starts on the MAIN agent and fails over to the backup once (Kevin\'s spec)', () => {
  const context = accountContext();
  const getAgentId = vm.runInContext('getHopeAgentId', context);
  assert.equal(getAgentId(), 'agent_9001m42hnyrwedts40en5a5npapp');
});

test('Auto retries one usage exhaustion with Backup, while Primary and Backup never fail over', async () => {
  async function runAttempts(accountChoice, exhaustionCount) {
    const starts = [];
    const timers = [];
    const context = vm.createContext({
      EL_AGENT_ID_STORAGE: 'test-agent-storage',
      HOPE_ACCOUNT_CHOICE_KEY: 'aimmHopeAccountChoice',
      AIMM_HOPE_BACKUP_AGENT_ID: 'agent_2601kqm4g7txfsvv0pkvpe02389p',
      RT_ANT_KEY_STORAGE: 'rt-ant-key', EL_KEY_STORAGE: 'el-key',
      HOPE_STT_TOKEN_STORAGE: 'hope-token',
      AIMM_PROXY_URL: 'https://worker.test',
      localStorage: localStorageStub({ aimmHopeAccountChoice: accountChoice }),
      console: { log() {}, warn() {}, error() {} },
      window: { isSecureContext: true },
      document: { getElementById() { return { textContent: '', classList: { add() {}, remove() {} } }; } },
      setTimeout(callback) { timers.push(callback); return timers.length; },
      setInterval() { return 1; }, clearInterval() {},
      toast() {}, rtSetStatus() {}, setVoiceState() {},
      elSetAgentStatus() {}, elCleanup() {},
      getHopeAccountChoice() { return context.localStorage.getItem('aimmHopeAccountChoice') || 'auto'; },
      getHopeAgentId() {
        const choice = context.getHopeAccountChoice();
        return choice === 'backup' ? 'agent_2601kqm4g7txfsvv0pkvpe02389p' : 'agent_9001m42hnyrwedts40en5a5npapp';
      },
      getActiveAgentId() { return context.getHopeAgentId(); },
      activeTabId() { return 'workbench'; }, getActivePersonaKey() { return 'hope'; },
      timeOfDay() { return 'day'; }, getRecentCallContext() { return null; },
      pickPersonaGreeting() { return 'Hi'; }, pickGreeting() { return 'Hi'; },
      buildHopeVoiceMixContextBlock() { return ''; }, buildSelectedStemAnalysisState() { return null; },
      buildProfileDigest() { return ''; }, getProfileContext() { return ''; },
      getAichatTools() { return []; },
      HOPE_VOICE: { syncButtons() {}, applyMute() {}, setSpeaking() {}, setListening() {} },
      EL: {
        active: false, connecting: false, ending: false, endRequested: false,
        liveSessions: [], pendingContext: null, suppressNextTabChange: false,
        lastSeenTab: null, sessionGreeting: '', sessionTimeOfDay: '',
        conversation: null, lastMode: 'listening'
      },
      TOOL_DEFS: [], AICHAT_TOOL_DEFS: [],
      TAB_DISPLAY_NAMES: {}, TAB_PURPOSES: {},
      AICHAT: { history: [] }, SESSION_BREAKDOWN: {},
      RT: { active: false, connecting: false }
    });
    vm.runInContext(exhaustionSource, context);
    vm.runInContext(elStartSource, context);
    context.elCleanup = () => {
      context.EL.connecting = false;
      context.EL.active = false;
    };
    context.elLoadSDK = async () => ({ Conversation: {
      async startSession(options) {
        starts.push(options.agentId);
        if (starts.length <= exhaustionCount) throw new Error('insufficient_credits');
        return { endSession() {} };
      }
    } });
    await vm.runInContext('elStart()', context);
    while (timers.length) {
      const callback = timers.shift();
      await callback();
    }
    return starts;
  }

  const autoStarts = await runAttempts('auto', 2);
  assert.deepEqual(autoStarts, [
    'agent_9001m42hnyrwedts40en5a5npapp',
    'agent_2601kqm4g7txfsvv0pkvpe02389p'
  ], 'Auto tries the main agent and retries once with the Backup agent ID after exhaustion');
  assert.equal((await runAttempts('primary', 1)).length, 1, 'Primary does not fail over');
  assert.equal((await runAttempts('backup', 1)).length, 1, 'Backup does not fail over');
});

test('Hope route mode defaults to Agent and treats invalid stored values as Agent', () => {
  const context = vm.createContext({
    HOPE_USAGE_VOICE_MODE_KEY: 'aiMixMastersHopeVoiceMode_v1',
    localStorage: localStorageStub()
  });
  vm.runInContext(usageModeSource, context);
  const getMode = vm.runInContext('hopeUsageGetMode', context);
  assert.equal(getMode(), 'agent');
  context.localStorage.setItem('aiMixMastersHopeVoiceMode_v1', 'invalid');
  assert.equal(getMode(), 'agent');
  context.localStorage.setItem('aiMixMastersHopeVoiceMode_v1', 'usage');
  assert.equal(getMode(), 'usage');
});

test('Hope route toggle flips stored mode and repaints the Luna or Agent label', () => {
  const button = { textContent: '', dataset: {}, setAttribute(name, value) { this[name] = value; } };
  const status = { hidden: false, textContent: '', classList: { add() {}, remove() {} } };
  const mic = { title: '', setAttribute(name, value) { this[name] = value; } };
  const context = vm.createContext({
    EL: { active: false, connecting: false, ending: false },
    HOPE_USAGE_VOICE: { continuous: false, recording: false, processing: false },
    HOPE_USAGE_VOICE_MODE_KEY: 'aiMixMastersHopeVoiceMode_v1',
    localStorage: localStorageStub(),
    document: { getElementById(id) { return id === 'hopeVoiceRouteBtn' ? button : id === 'hopeUsageStatus' ? status : mic; } },
    toast() {}, hopeUsageStatus() {}
  });
  vm.runInContext(usageModeSource, context);
  vm.runInContext(routeToggleSource, context);
  vm.runInContext('hopeUsageToggleRoute()', context);
  assert.equal(context.localStorage.getItem('aiMixMastersHopeVoiceMode_v1'), 'usage');
  assert.equal(button.textContent, 'Luna');
  vm.runInContext('hopeUsageToggleRoute()', context);
  assert.equal(context.localStorage.getItem('aiMixMastersHopeVoiceMode_v1'), 'agent');
  assert.equal(button.textContent, 'Agent');
});
