# TTS Revert Guide — ElevenLabs TTS → OpenAI TTS

**Context:** The `aichatSpeak` function was temporarily switched from OpenAI TTS to
ElevenLabs TTS on 2026-06-17 so Kev could test with a free-plan EL key while the
Creator plan renewal was pending. When the Creator plan key is renewed, revert using
the steps below.

---

## What changed (2026-06-17 — build 2026-06-17.1)

| Location | Change |
|---|---|
| `aichatSpeak()` function | Calls `POST /v1/text-to-speech/WAhoMTNdLdMoq1j3wf3I/stream` (EL) instead of `POST /v1/audio/speech` (OpenAI) |
| Settings panel | New "Read replies aloud" toggle card (auto-speak via EL TTS) |
| `onMessage` handler | Auto-read trigger checks `aimmTtsAutoRead_v1` flag |
| Init block | Restores toggle state from localStorage |

---

## Option A — one-command revert (restores entire index.html to pre-change state)

```bash
cd ~/Documents/Claude/Artifacts/aimm
git checkout 13bba9e -- index.html
git add index.html
git commit -m "Revert aichatSpeak to OpenAI TTS (Creator plan renewed)"
git push
```

`13bba9e` is the last commit before the TTS change. This restores everything.

---

## Option B — surgical revert (keep other changes, just swap the TTS function back)

Replace the `aichatSpeak` function in `index.html` with the original below.
Search for `async function aichatSpeak(idx)` and replace the entire function body
(up to the closing `}` before `function aichatStopTTS`).

Also remove the "Read replies aloud" card from the Settings panel
(search `data-tile-id="read-aloud"`).

Also remove the `aimmTtsAutoRead_v1` auto-speak lines from `onMessage`
and the init block (search `ralToggle`).

### Original aichatSpeak (OpenAI TTS):

```javascript
async function aichatSpeak(idx){
  // Toggle off if user clicks the same message again
  if (TTS.playingIdx === idx || TTS.loadingIdx === idx){
    aichatStopTTS();
    return;
  }
  // Capture selection BEFORE we tear down anything (re-render below clears it)
  const selectedText = aichatGetSelectionInMsg(idx);

  // Stop anything else in flight
  aichatStopTTS();

  const msg = AICHAT.history[idx];
  if (!msg || msg.role !== 'ai') return;

  const oaKey = localStorage.getItem(RT_KEY_STORAGE);
  if (!oaKey){
    aichatStatus('No OpenAI key saved. Add one on the 🎙️ Hope tab to enable Read aloud.', 'err');
    return;
  }

  // If a selection inside this message exists, read just that. Otherwise the full message.
  const usingSelection = !!selectedText;
  let text = usingSelection
    ? aichatStripMd(selectedText)
    : aichatStripMd(msg.content);
  if (!text){ aichatStatus('Nothing readable in that selection.', 'err'); return; }
  let truncated = false;
  if (text.length > TTS_MAX_CHARS){
    text = text.slice(0, TTS_MAX_CHARS) + '… The rest was cut off — open the message to read the remainder.';
    truncated = true;
  }

  const voice = (document.getElementById('aiChatTtsVoice')||{}).value || 'echo';
  const model = (document.getElementById('aiChatTtsModel')||{}).value || 'tts-1';

  TTS.loadingIdx = idx;
  aichatRender(); // reflect loading state on the button
  aichatStatus(`Generating speech (${model}, ${voice})${usingSelection?' · selection only':''}…`, 'busy');

  try{
    TTS.abort = new AbortController();
    const resp = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + oaKey
      },
      body: JSON.stringify({ model, voice, input: text, response_format: 'mp3' }),
      signal: TTS.abort.signal
    });
    TTS.abort = null;
    if (!resp.ok){
      const errTxt = await resp.text();
      TTS.loadingIdx = -1;
      aichatRender();
      aichatStatus(`TTS error ${resp.status}: ${errTxt.slice(0,250)}`, 'err');
      return;
    }
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const audio = aichatTtsAudioEl();
    // Clean up any previous blob URL
    if (audio.dataset.blobUrl){
      try{ URL.revokeObjectURL(audio.dataset.blobUrl); }catch(_){}
    }
    audio.dataset.blobUrl = url;
    audio.src = url;

    // Track cost — charge per character on the input
    const rate = (TTS_RATES[model] || TTS_RATES['tts-1']).perChar;
    const cost = text.length * rate;
    if (cost > 0){
      try{ addSpend('oai', cost); rtRenderCost(); }catch(_){}
    }

    TTS.loadingIdx = -1;
    TTS.playingIdx = idx;
    aichatRender();
    // Decorate the message body with word spans so we can highlight as it reads.
    aichatInstallWordSpans(idx, text);

    await audio.play();
    const note = truncated ? ' · message was truncated to fit TTS limit' : '';
    const what = usingSelection ? `selection (${text.length} chars)` : `${text.length} chars`;
    aichatStatus(`Reading aloud · $${cost.toFixed(4)} · ${what}${note}`, 'ok');
  } catch(e){
    TTS.loadingIdx = -1;
    TTS.playingIdx = -1;
    aichatRemoveWordSpans();
    aichatRender();
    if (e.name !== 'AbortError'){
      aichatStatus('TTS failed: ' + (e.message||String(e)), 'err');
    } else {
      aichatStatus('Read-aloud cancelled.', 'ok');
    }
  }
}
```

---

## Checklist after revert

- [ ] Bump `AIMM_BUILD` (search `const AIMM_BUILD`) to today's date
- [ ] Hard-refresh the app in browser (Ctrl+Shift+R)
- [ ] Test: click speaker icon on a text reply — should use OpenAI TTS (echo voice)
- [ ] Optionally: clear `aimmTtsAutoRead_v1` from DevTools → Application → localStorage
- [ ] Update ElevenLabs API key in Settings to your Creator plan key
- [ ] Regenerate and discard the free-plan test key at elevenlabs.io → Developers → API Keys
