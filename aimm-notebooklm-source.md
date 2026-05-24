# AI Mix Masters (AIMM) — Deep Dive Source Document

*A comprehensive briefing document on AI Mix Masters: what it is, what it does, why it exists, the problems it solves, the build journey behind it, and where this kind of tool could take home music production next.*

---

## The thirty-second pitch

AI Mix Masters — AIMM — is a single-page, browser-only mixing and mastering workbench built around a 450-plugin home studio. It pairs a genre-aware plugin chain builder, platform-specific loudness targets, a symptom-driven troubleshooter, and a snapshot journal with a real-time voice co-pilot called Hope. Hope is an ElevenLabs Conversational AI agent driven by Claude Sonnet 4.6. She can look at the workbench, read it back, change it, troubleshoot it, remember what you taught her from last session, and route niche producer questions out to a deeper research model with live web search when she's about to bluff.

It runs entirely in a Chrome tab. Nothing leaves the browser except calls the user explicitly makes to OpenAI, Anthropic, and ElevenLabs with their own API keys. No accounts, no backend, no telemetry. The whole app is one HTML file — about nine thousand lines of vanilla JavaScript, CSS, and HTML with no framework and no build step. The state — your chains, your plugin library, your custom symptoms, your knowledge base, your favourite snapshots, your conversation history with Hope — all lives in browser localStorage.

That's the surface. Underneath, it's a small but unusually dense exploration of what a real, useful, voice-driven creative tool feels like in 2026 — and a working answer to the question "what does an AI collaborator for a bedroom producer actually look like when it stops being a chatbot?"

---

## What AIMM is and what it does

The app is organised around seven tabs, plus settings. Each one is a workspace, and most of them can be driven either with the mouse or by talking to Hope.

The **Conversation** tab is where Hope lives. There's a transcript that mixes voice turns and typed turns into a single thread. A floating microphone, present on every tab, is the universal call trigger — tap it and Hope picks up the conversation roughly where you left it last time. Below the transcript sits a grid of "snapshot pills" — pinnable moments from past calls that act as both memory anchors and one-click recall buttons. Click a pill body to drop its text back into Hope's context. Click the green check icon that appears on hover and you can restore the entire workbench state — chain, genre, platform target, meters, symptoms — that was captured when that snapshot was first saved. There's a backup-before-restore checkbox on by default, so you can always roll back.

The **Library** tab is the plugin warehouse. Around four hundred and fifty plugins are seeded — Waves, iZotope, Universal Audio, Softube, SSL Native, Plugin Alliance, Native Instruments, Sonnox, Slate, Eiosis, oeksound, Soundtoys, Antares, Celemony, LiquidSonics and more — organised by signal-chain stage and decorated with a star system that highlights genre-specific top picks. There's an Import flow that takes a paste, a screenshot, or a phone photo of a plugin window and uses Claude to normalise the name, guess the publisher, slot it into the right stage, and flag duplicates before committing. The library is filterable by publisher.

The **Workbench** tab is the chain builder. Five buses — master, vocal, 808, drum, FX — each with its own drag-to-reorder plugin chain. Inline notes stick to each plugin so a setting you discovered on Tuesday is still attached to the plugin on Friday. There's an Auto-fill button that calls Haiku to suggest a starting chain based on your selected genre, and there are preset chains saved per-bus that you can pull from.

The **Repair** tab is the diagnostic surface. A meter check compares your readings to the active platform target — Spotify, Apple Music, club-loud, SoundCloud, Tidal — and flags pass, warn, or fail per metric. A troubleshooter lets you toggle symptom pills like "harsh hats," "muddy 808," "vocals sit too far back," "pumping," "phase weirdness on the kick" and surfaces recipe chains for each. You can add your own custom symptoms; the pills are drag-to-reorder and hide-able.

The **Insight** tab is the memory store. Two things live here. The knowledge base — your durable, persistent producer learnings, organised into eight collapsible categories: mixing techniques, producer interviews and chains, plugin recipes, reference tracks, mastering, vocal techniques, workflow, and a miscellaneous bucket. You can drop a PDF, DOCX, TXT, MD, or pasted research synthesis into the tab and Claude Haiku extracts a title, tags, summary, and (soon) a category in one call before saving the note active and ready to inject into Hope's next conversation. The other thing on this tab is Hope's Memory — a 2-kilobyte profile dossier that gets auto-extracted from each voice call by Haiku and grows over time. This is how Hope remembers that you prefer the Maag EQ4 on the master, that you mix at 78 BPM, that you don't like compressors on the 808 bus, that you're working on a specific project name.

The **Snapshots** tab is the journal. Every "snapshot to Claude" action you take during a conversation produces a pill. Pills can be favourited, edited, copied, deleted, restored. The hover icons are colour-coded — green check to apply, gold star to favourite, blue pencil to edit, purple copy icon to clipboard, red trash. Snapshots that captured workbench state restore it; snapshots that didn't recall their text into the next conversation.

The **Reference** tab is the static reading-room — frequency maps showing what lives at which Hz, loudness target reference cards, true-peak ceiling notes, stereo-width-by-band charts. Drag-to-reorder, custom tile creation, dismiss-and-revert.

The voice-driven element binds everything together. Hope can read context off any tab, switch to a different tab on your behalf, add a plugin to the master bus, remove one from the vocal chain, switch the genre to UK drill, flag a symptom, capture a thought to your roadmap inbox, emit a NotebookLM research prompt for you to copy and run externally, look up a plugin in the library, search her own source code if you ask her how something is wired, read project documentation if you ask her what's coming next. There are thirty registered client tools she can call. Every call is logged to the browser console so you can watch what she's doing.

---

## The problem AIMM was built to solve

Most plugin-rich home producers run into the same wall. The library is too big. There are eight equalisers that could go on the master. There are six saturators that could glue the drum bus. There are four de-essers, three of which were bought because a YouTube tutorial recommended them in 2022 and have been unopened since. The plugins are sitting on the hard drive doing nothing.

The conventional fix is a chain template — paste in a producer's signal chain, copy it, work backwards. The problem is that chain templates are static. They don't know what genre you're cutting today. They don't know what your previous mix sounded like. They don't know your library — they assume you own the same plugins as the producer who wrote them. And they certainly can't troubleshoot a mix in flight.

The other fix is a chatbot. Ask GPT what to put on a trap 808. It will give you a generic answer that doesn't reference your plugins. Ask it to be more specific and it might hallucinate plugin names that don't exist. Ask it for the setting on the Maag EQ4 air band and it will guess. Ask it three follow-up questions and it has forgotten what the first one was about.

AIMM is built around a different premise. The tool should:

- **Know what plugins you own.** Not in the abstract — the actual ones, importable from a screenshot in thirty seconds. The library is the ground truth, and Hope works from it.
- **Know what genre you're working in right now.** Trap, drill, UK drill, phonk, rage, cloud, Memphis, Jersey club, hyperpop, boom bap. Each one has different chain logic and different loudness targets.
- **Know the platform you're targeting.** A Spotify master, an Apple Music master, a club-loud master, a SoundCloud demo and a Tidal release are five different mixes. The meter check folds the platform target into pass/warn/fail.
- **Remember across sessions.** The next call should start where the last one ended, not from scratch.
- **Refuse to bluff.** When a question is niche enough that the voice model is going to invent a plugin or fake an engineer's chain, it should route the question out to a deeper research model with live web search and come back with a grounded answer.
- **Stay out of the way.** No login, no subscription, no telemetry. The user pays per-call rates directly to the providers with their own keys. The producer's notes are theirs.

That set of constraints is what shapes the entire architecture. The single-HTML-file rule, the browser-only state, the bring-your-own-keys model, the voice-first interface, the genre + platform + symptom triple that's always available in Hope's context, the knowledge base that injects into every session, the snapshot pills as both memory and undo, the per-call profile extraction — all of it follows from "make a tool that knows my room."

---

## Who AIMM is for

The target user is the home producer who has accumulated a serious plugin collection — somewhere between two hundred and a thousand individual plugins across the major publishers — and is mixing their own work at home. The genre is broadly trap and adjacent hip-hop styles, but the architecture extends cleanly into any modern production style that lives at the intersection of programmed beats, processed vocals, and platform-aware loudness targets. UK drill, phonk, rage, cloud, hyperpop, lo-fi, R&B, pop — the chain logic varies but the workbench, troubleshooter, and platform target system apply.

The user has, broadly, three frustrations the tool addresses:

The first is **plugin paralysis**. Owning the tools doesn't translate into using them, and the bedroom mixer who has spent four years on Black Friday deals often defaults to the same six plugins over and over. AIMM's library view, with its genre-aware top-pick stars and stage-organised columns, surfaces plugins that fit the current context, and Hope can be asked things like "what should I try on a UK drill vocal that I haven't used in a while?"

The second is **decision fatigue under cost pressure**. Renting studio time, paying for sessions, or simply running out of weekend hours all push for faster decisions. The troubleshooter's symptom pills compress what would normally be a five-minute YouTube search ("how do I fix harsh hats on a trap mix") into a one-click pull-up of recipe chains using the user's own plugins. The voice conversation cuts the typing back further — you can describe what you're hearing without taking your hands off the controller.

The third is **continuity loss between sessions**. The classic bedroom-producer experience is sitting down on Saturday and having forgotten everything you decided on Tuesday. AIMM's snapshot pills, knowledge base, and Hope's memory dossier are three layers of persistence aimed directly at that. The most recent call's tail summary is injected into the next call's opening context, so Hope doesn't say "what are we working on?" — she says, paraphrasing, "last time we were on the Drum Bus working through the kick fundamental issue, did you land that?"

The secondary audience, less explicit but real, is the producer who treats their plugin investment as a kind of musical capital and wants a tool that respects it. The library import flow — paste, screenshot, or photo — exists because the producer's own library is the canonical source, not the developer's seed list. Every star, every chain preset, every recipe is referenced against what the user actually owns.

It is not built for big-room professional studios, mix engineers running Pro Tools sessions for major-label artists, or mastering houses running iZotope Insight in serious commercial pipelines. Those workflows have their own integrations and their own collaborative needs. AIMM is for the person mixing alone, often at night, in a bedroom or a small treated room, with their own collection and their own taste.

---

## Inside the seven tabs, tab by tab

A more concrete tour, for anyone trying to picture the surface.

**Conversation** is voice-first. Hope greets the user with a time-aware line from a pool of about ninety variations — three moods times three time-slots times ten lines each, so even after dozens of calls she rarely repeats herself. The transcript renders both voice turns (tagged with a source field) and typed turns. Above the transcript is a status strip — the global session indicator, present on every tab now after the most recent reconciliation pass, that paints green while a call is live and reverts to neutral when idle. Below the transcript is the compose area, resizable by a horizontal drag handle so users with longer typing fingers can give themselves room. Below that, the snapshot pills grid — twenty-four pills capacity, split favourites-first.

**Library** is a stage-organised grid. Roughly fifteen stages — input gain, gate, EQ, compression, saturation, exciter, de-esser, transient designer, parallel processing, reverb, delay, stereo widener, multiband processor, limiter, metering — with the user's plugins slotted into the right stage. Star icons highlight genre-favoured plugins. Publisher filters let the producer toggle off plugins from publishers they don't have installed (an iLok cert error mid-mix is the worst). The Import flow uses Claude to normalise a pasted plugin name, infer publisher and stage, check for duplicates, and ask before committing.

**Workbench** is five buses on a single screen. Master, vocal, 808, drum, FX. Each bus shows its current chain — a vertical stack of plugin tiles, each with the plugin name, publisher tag, drag handle, settings note. You can drag a plugin between buses, drag to reorder, click an X to remove. The Auto-fill button calls Haiku to suggest a chain seeded from the current genre. A preset picker per-bus pulls from a curated set — eight different eight-oh-eight chains, six master chains, four vocal chains — each one a starting point that can be modified and saved.

**Repair** is two halves. The meter check on top takes loudness (LUFS), true peak (dBTP), and dynamic range readings and compares them to the active platform target with green/amber/red colour-coding. Below, the troubleshooter — a grid of symptom pills you toggle on when you hear them. Active symptoms inject into Hope's next context update, so a producer can flip on "harsh hats" and "muddy 808," start a call, and Hope opens by referencing both issues without being prompted. The symptom grid is fully customisable — drag-to-reorder, hide built-ins, add custom symptoms like "my room is rattling at 60 Hz."

**Insight** has two stacked surfaces. The knowledge base on top — eight collapsible category cards with notes, drag-and-drop import, a byte meter showing the soft 8000-byte budget, and per-note actions for edit, dismiss, summarise, toggle-active. Notes default to active when imported from a drop, meaning they flow into every Hope and Claude session that follows. Hope's Memory below — a 2KB plain-text dossier that auto-grows after each call, capturing durable preferences (favourite plugins, mix-room facts, project names, hard "don't-recommend" items) extracted by Haiku from the call transcript.

**Snapshots** is the journal. Every time the user clicks "snapshot to Claude" during a conversation, a pill is created. Pills can carry workbench state for one-click restore. Pills can be favourited, edited (title + body in a modal), copied to clipboard, deleted. Pills are filterable. The hover-action system was just unified to use semantic colour modifiers — green for apply, gold for favourite, blue for edit, purple for copy, red for delete — so the affordance is consistent across the grid.

**Reference** is the reading room. Four major card sections — frequency map (sub-bass, bass body, low mids, mids, presence, air, with frequency ranges and what each band does in a mix), loudness targets (Spotify, Apple, Tidal, club, SoundCloud LUFS targets explained), true peak ceilings (−1 dBTP for streaming, why), stereo width by band (mono below 120 Hz, etc.). All drag-to-reorder, all customisable, with an add-custom-tile affordance for per-user trivia.

**Settings** is the eighth tab, rightmost. API keys (ElevenLabs, Anthropic, agent IDs), models (research brain selector — Sonnet 4.6 default, Opus 4.6 for maximum), costs (live spend per provider, balance fetchers, top-up shortcuts), session safety (cost-per-minute, soft cap, auto-pause threshold, usage dashboards links), and notes (the browser-only privacy promise, a tip box).

---

## Hope, the voice partner

Hope is the personality at the centre of the app. She's not a feature with a microphone icon — she's the way most of the work happens, with a name, a voice, a tone, and a memory.

Technically, Hope is an ElevenLabs Conversational AI agent. Her TTS voice is one of the production voices in the ElevenLabs catalogue, running on the eleven-v-three conversational model with expressive mode on. Her brain is Claude Sonnet 4.6 — the same model that powers a lot of the rest of the AIMM ecosystem. She has thirty client tools available to her, ranging from workbench manipulation (add a plugin, switch a genre, clear a bus, toggle a symptom) to introspection (search the live source code, read a project doc, switch a tab on your behalf) to capture (drop an idea into a roadmap inbox so the user doesn't lose it).

She has a personality that's been deliberately tuned. Warm. Producer-coach. Not corporate. Not hype. The system prompt frames her as a collaborator who's been there before — she's not impressed by big plugin names, she pushes back on overprocessing, she's quick to call out when a chain has too much going on. She refers to the user by name (Kev), she remembers things from previous calls without restating them in full, and she avoids the conversational tics that mark out generic voice assistants: no "I'd be happy to," no "great question," no "let me know if there's anything else."

There's a sister system that makes the continuity work. At the end of every call, before the transcript is wiped, a Haiku call extracts profile updates — durable preferences and facts — and merges them into a 2KB dossier. At the start of every call, the dossier is injected as part of the contextual update bundle. The result is that Hope walks into call number forty knowing that the user mixes at 78 BPM, prefers the Maag EQ4 air band on the master, doesn't like the FabFilter Pro-MB on vocals, is working on a record called something specific. She doesn't need to ask.

There's also a sister knowledge base. Notes the user drops onto the Insight tab — pasted research, NotebookLM syntheses, PDF interviews, Reddit threads — are extracted into structured notes and injected into Hope's contextual update on every call. So if the user reads a Jaycen Joshua interview about drum bus architecture and drops the PDF on the Insight tab, Hope has read it by the next call and can quote it back when asked.

The bluff problem is solved by routing. Hope's system prompt explicitly tells her: if the question is niche, recent, or specific enough that you're going to make something up, call the research tool. The research tool fires off a Claude call with web search enabled. Two to four seconds of "hold on, let me check on that" later, Hope has a grounded answer with citations, and she reads it back. The user knows it came from research because of the slight pause; the alternative — a confident hallucination — would erode trust permanently.

The cross-call continuity is the part that quietly changes how the tool feels. Most voice assistants treat each session as standalone. AIMM treats them as a single conversation that happens to have pauses, sometimes overnight, sometimes a week. The tail of the previous call's transcript is summarised and surfaced in the next call's opening context. The mid-call tab awareness fires a contextual update when the user navigates — Hope knows you moved from Workbench to Repair without being told. The combination is what makes the tool feel less like a chatbot you're using and more like a person who's actually in the room with you.

---

## The build: stack, decisions, scars

A few facts about the technical foundations, because the design choices say something about what kind of tool this is.

**Single file. Vanilla JS.** The entire application is one HTML file — about nine thousand lines including inline CSS and JavaScript. No framework. No bundler. No build step. No server. Edits go directly to the file. Deploys are a git push to a GitHub Pages branch. The file is hosted on GitHub Pages with the same address the project started with. This isn't laziness — it's a design constraint. The promise is "you can fork this, change it, host it yourself, and never touch a build pipeline." It also means the entire app's behaviour is greppable in one place.

**Browser-only state.** Everything — the chain, the library customisations, the genre, the target, the snapshots, the journal, the knowledge base, Hope's memory dossier, the favourite pills, the custom symptoms, the saved layouts, the API keys — lives in browser localStorage. The privacy promise in the README is "browser only" and it's enforced by architecture, not by policy. There is no server the developer runs. Hope's voice goes directly from the browser to ElevenLabs. Hope's brain calls go from ElevenLabs to Anthropic. Research calls go from the browser to Anthropic. The developer has no access to any of it.

**Bring-your-own-keys.** No subscription. No accounts. The user pastes API keys for ElevenLabs, Anthropic, and (optionally) OpenAI directly into the Settings tab. Cost meters show what each provider is costing in real time. Soft budget caps and auto-pause behaviour exist to prevent runaway sessions. ElevenLabs sits on the Creator plan at twenty-two dollars a month for the conversational AI minutes — that's the only fixed cost. Anthropic and OpenAI are pay-as-you-go.

**The voice migration story.** This is the part of the project's history that's most interesting from a tooling-evolution perspective. The voice partner started life on the OpenAI Realtime API in early 2026. That worked — WebRTC voice with function calling, low latency, reasonable cost. The migration to ElevenLabs Conversational AI happened in five batches across May 2026 and shipped on a branch called voice-elevenlabs. The reasons were tonal: ElevenLabs' voices are noticeably warmer and more expressive than OpenAI's at the time, the eleven-v-three model handles emotional delivery better, and the architectural shift to "the conversational platform" rather than "the model" meant the brain could be swapped from GPT to Claude Sonnet 4.6, which has a different personality and a stronger grasp of production technique. The migration was non-trivial — five named batches covering UI sweeps, dictation engine swap (Whisper to Scribe v2), tab merging, cost panel rewiring, settings tab split.

**The SDK pin scar.** Halfway through the migration, hours were lost to a transport error: `NegotiationError: negotiation timed out`. The cause was an SDK version mismatch — newer versions of the ElevenLabs JavaScript client pulled in LiveKit v2 which expected newer endpoints, while ElevenLabs' production server was still on LiveKit Server 1.9.0. The fix was pinning the SDK at version 0.1.7, which uses a direct WebSocket transport. That pin is now a documented constraint that future builders have to respect.

**The prompt override scar.** ElevenLabs' agent dashboard has a setting that should allow the system prompt to be overridden from code, but in practice the server rejects the override with a WebSocket close code regardless of the toggle. The workaround is to inject context via a different mechanism — a function called `sendContextualUpdate` — that the server accepts. So Hope's system prompt is configured in the ElevenLabs dashboard and published there; her per-call context (current workbench state, knowledge base notes, profile dossier, focus tab) is injected on connect via the contextual update channel.

**Thirty tools and counting.** Hope's tool surface grew from thirteen in the early days to twenty-eight in early May to thirty by mid-May. Recent additions: `inspect_app` (Hope can grep her own source code for any term), `read_doc` (Hope can read four whitelisted project docs — CLAUDE.md, ROADMAP.md, README.md, DASHBOARD.html), `emit_notebooklm_prompt` (Hope can ask the user to run a research topic through NotebookLM externally and bring the synthesis back), `capture_to_roadmap` (Hope can drop an idea into a structured inbox visible on the project dashboard, killing a hallucination class where she would claim to have "added it to the roadmap" without actually doing so).

**The dashboard and roadmap.** A `ROADMAP.md` file is the canonical source-of-truth for what's done, what's in flight, what's queued. A `DASHBOARD.html` file is a visual mirror of the same content with click-to-expand sections, tile counters that auto-derive from the markdown, and per-card "Continue here" buttons that copy a project-bootstrap prompt into the clipboard and pop a modal explaining where to paste it. Both are maintained reflexively — anything captured, shipped, or status-changed updates both files in the same turn. The convention is documented in a non-negotiable maintenance protocol at the top of `CLAUDE.md`.

**The handover discipline.** Sessions are stateful. The last two session handovers are kept live in `CLAUDE.md` so any future Claude or Cowork session picks up exactly where the previous one ended. Older handovers are preserved verbatim in a `docs/HANDOVERS/` archive with a newest-first index. The session-start ritual is: read the handover, scan the dashboard, check for drift, fix anything stale before answering the user. This is what makes the tool sustainable across dozens of sessions without losing the thread.

---

## What this opens — boundaries and possibilities for home production

The interesting question isn't what AIMM does. The interesting question is what AIMM hints at — what kind of tool category this would slot into if generalised, and what it suggests about the next wave of home-studio software.

**The voice-first creative tool is no longer hypothetical.** Most music software treats voice as a future feature — something to think about for accessibility, not a primary interface. AIMM is built voice-first. The floating microphone is the universal call trigger across every tab. The transcript is shared between voice and text. The producer can talk through a problem while staring at a meter, never taking their hand off the controller, and Hope can read the meter, suggest a plugin, add it to the right bus, and explain why. The hands-free, eyes-on-the-meter loop is faster than mouse-and-menu for the kinds of decisions that come up mid-mix. Once a producer has worked with this for a week, going back to clicking through plugin menus feels archaic.

**The "knows my room" tool is more powerful than the generic tool.** Every AI music tool currently on the market is generic by default. They don't know your plugins. They don't know your room. They don't know your taste. They give answers in the abstract. AIMM's premise — that the AI should be grounded in the user's specific library, genre context, platform target, and personal history — is replicable in any creative domain. The same architecture could ground a writing tool in the user's specific previously-published work, a video editing tool in the user's specific footage library, a graphic design tool in the user's specific brand assets. The principle generalises: ground the AI in the user's specific working context, not the abstract.

**Bring-your-own-keys changes the economics.** AIMM has no subscription. There's no monthly fee paid to the developer because there's no developer-run server. The user pays per-minute, per-token rates directly to the model providers. A casual user might spend two dollars a month on Hope. A power user mixing every day might spend twenty. The economics flip — the tool stops being a SaaS product that needs to justify a monthly bill and starts being a free utility that costs as much as the user uses it. This pattern, generalised, threatens a lot of incumbent SaaS pricing models and opens space for indie-built tools that don't need scale to be sustainable.

**Single-file, browser-only is a viable distribution model.** AIMM is one HTML file hosted on GitHub Pages. Anyone can fork it, modify it, host their own. The barrier to running it locally is "open the file" — there's no install. The barrier to modifying it is "edit the file in any text editor." This is the polar opposite of the modern web-app stack — no Next.js, no Vercel, no environment variables, no node modules — and it suggests there's a path for small, sharp creative tools that escape the framework treadmill entirely.

**The collaborative future is more interesting than the local one.** AIMM doesn't have live collaboration. There's no way for two producers to work on the same chain at the same time, or for an artist and engineer in different cities to mix together. The reason is architectural — there's no server. But the snapshot system is already a collaboration primitive: copy a snapshot to clipboard, paste in Slack or email, the recipient pastes it back into their own AIMM, and the workbench state restores. With a thin backend layer, that becomes real-time co-editing. With a public sharing layer, that becomes a community of producers sharing chains the way GitHub users share repos. With a marketplace layer, that becomes a place where engineers sell preset chains and producers buy them. The path from where AIMM is today to "Spotify for mix chains" or "GitHub for production templates" is a short one.

**The home-studio AI partner as a category.** AIMM is a member of a category that doesn't really exist yet — the persistent, named, voice-driven, context-aware creative AI partner. Most current AI tools are sessional. You open a chat, ask a question, close the tab, the model forgets you. AIMM treats Hope as a continuing relationship. The cross-call memory, the named persona, the warm tonal calibration, the willingness to push back, the refusal to bluff — all of it points at AI partners that have identity, history, and trust over time. This is a much more powerful design pattern than "chatbot with no memory" and it generalises to a writing partner, a coding partner, a fitness coach, a chef, a mental-health companion. The architecture AIMM has worked out — persistent state, profile extraction at session end, contextual updates on connect, refusal to bluff via research routing — is the basic shape of every long-term AI partner that follows.

**Limits worth naming.** AIMM is desktop-only — mobile is explicitly not a target, because the touch-and-mic ergonomics of mixing on a phone are wrong. AIMM is single-user — the snapshot copy/paste system is the only collaboration today. AIMM is genre-focused — it leans hard into trap and adjacent hip-hop styles, and while the architecture extends to any genre, the seed library and presets and recipes are tuned to that world. AIMM is single-author — it's been built by one person, with AI collaborators, across what looks like roughly a hundred sessions. The discipline that makes that possible (the maintenance protocol, the handover archive, the operational invariants) is part of what makes the project interesting as a development case study.

---

## The cultural angle

There's one more thing worth saying, which is what AIMM represents culturally. Most music software is built by companies for users. There's a power asymmetry — the company decides what features ship, what the price is, what the privacy story is, what the AI is trained on, what gets deprecated. The user has very little leverage.

AIMM is built by a producer for producers. The producer pays the providers directly. The producer keeps the state. The producer can fork the code. The producer decides what gets shipped next — there's a dashboard, there's a roadmap, there are captured ideas from voice calls sitting in an inbox waiting to be promoted.

It's a small thing. It's one HTML file. But it points at a possible alternative to the current music-tech landscape — one where the producer is not the customer to be extracted from, but the builder doing the extracting. Open formats, browser storage, model-agnostic backends, single-file distribution, voice-first interaction, persistent named AI partners with their own identity and memory. Each of these is a small choice. Together they suggest a different shape for the bedroom studio of the next five years.

That's the deeper interesting thing about AIMM. Not "an AI mixing assistant exists." That was always going to happen. The interesting thing is what shape it takes when it's built by someone who actually mixes, for the way actual mixing works, with the design choices that follow.

---

## Quick reference appendix

For the hosts of the audio overview, in case they want to drop specifics:

- **Name**: AI Mix Masters (AIMM). Previously Master Mix Workbench. Before that, Trap Master Reference. The repo slug stays unchanged for compatibility.
- **Live URL**: hosted on GitHub Pages, the user's personal subdomain
- **Stack**: single HTML file, vanilla JavaScript, no framework, no build, no backend
- **Voice partner**: Hope, ElevenLabs Conversational AI with Claude Sonnet 4.6 brain and eleven-v-three conversational TTS
- **Library size**: approximately 450 plugins seeded; user-extensible via paste/screenshot/photo import flow
- **Genres covered**: trap, drill, UK drill, phonk, rage, cloud, Memphis, Jersey club, hyperpop, boom bap
- **Platform targets**: Spotify, Apple Music, club-loud, SoundCloud, Tidal
- **Tabs**: Conversation, Library, Workbench, Repair, Insight, Snapshots, Reference, Settings (eight total)
- **Voice tool surface**: 30 registered client tools as of May 2026
- **Privacy model**: browser-only state, bring-your-own-keys, no developer-run servers, no telemetry
- **Open-source status**: code is on GitHub, single-file, forkable
- **Cost to user**: roughly $22/month for ElevenLabs Creator plan + per-call rates to Anthropic for research, no subscription to the developer
- **Built**: as of May 2026, the voice migration is complete; tool count is 30; nothing chunky in flight; the next planned feature is multiple voice personas (Matthew the Mix Engineer, Markey the Producer Coach, Katie the A&R, Ashley the Vocal Producer, Lauren the Lo-Fi Curator) auto-switching based on the active tab.

End of source document.
