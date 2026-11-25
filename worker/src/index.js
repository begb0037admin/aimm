// AIMM key relay — Cloudflare Worker
//
// Holds the real OpenAI + ElevenLabs API keys as Worker secrets and
// forwards requests from the AIMM app, so no API key ever lives in the
// (public) GitHub repo, on GitHub Pages, or in browser localStorage.
//
// Routes:
//   /hope/ai           → OpenAI Responses API (non-streaming Luna)
//   /elevenlabs/<path> → https://api.elevenlabs.io/<path>   (injects xi-api-key)
//   /elevenlabs-backup/v1/user/subscription → backup account (GET only)
//
// Deploy + secrets: see worker/README.md.

const REPO_YT_VIDEOS = new Map(Object.entries({"6WPtHxWkY2k":{"title":"Logic Pro 101: Beginner’s Guide","channel":"SEIDS","chunks":14},"86BqtxsJWnI":{"title":"Melodyne in Logic Pro 101: Beginner Guide","channel":"SEIDS","chunks":10},"VZtH4_Z7gos":{"title":"3 Easy Ways to Create Bass In Logic Pro","channel":"SEIDS","chunks":4},"K6fC7VBBj_o":{"title":"Create a Stutter Effect in Logic (Using ONLY Stock Plugins)","channel":"SEIDS","chunks":3},"JPKUpYrnXQs":{"title":"Melodyne Is $99–$700… Logic Pro Has This Free","channel":"SEIDS","chunks":1},"0ITnE9QmgKs":{"title":"How to Produce a Demo in Logic Pro","channel":"SEIDS","chunks":6},"YRvSLQwVG7g":{"title":"Free Logic Pro Plugins You're Sleeping On (Right Now!)","channel":"SEIDS","chunks":3},"gQ2dTLPbOks":{"title":"5 Logic Pro Automation Tricks You NEED to Try (feat. Hex FX)","channel":"SEIDS","chunks":4},"RfR-0M7YoFM":{"title":"How to Write Beautiful Chord Progressions in Logic Pro (Even If You Don’t Play Piano)","channel":"SEIDS","chunks":4},"YljiLCUs4Kc":{"title":"How I Turned a 4-Bar Loop Into a Full Song","channel":"SEIDS","chunks":3},"jBJh9Sn2RSE":{"title":"Make INSANE Sounds in Logic Pro (No Plugins Needed)","channel":"SEIDS","chunks":4},"phuwWWSWrDY":{"title":"Most Producers Have NO Idea These Logic Pro Features Exist","channel":"SEIDS","chunks":4},"zpyJFmx9NAU":{"title":"You’re Not Using Logic Pro Correctly (If You Don’t Do This)","channel":"SEIDS","chunks":2},"sxvAhaqQ5Ew":{"title":"Every Producer Should Try THIS Daily Exercise","channel":"SEIDS","chunks":3},"8C837VYG1ws":{"title":"3 Ways to Create Chords in Logic Pro","channel":"SEIDS","chunks":4},"p0bnk53H5hc":{"title":"Secret Logic Pro Shortcuts That Will Save You HOURS","channel":"SEIDS","chunks":2},"Nsn_koz9tVI":{"title":"Logic Pro Tricks EVERY User Should Know NOW!","channel":"SEIDS","chunks":6},"iAXC61dcGBg":{"title":"Set Up the Ultimate Logic Pro Template - It'll Save You HOURS!","channel":"SEIDS","chunks":3},"T9cjd8EElKs":{"title":"This Logic Pro Workflow Changed My Life!","channel":"SEIDS","chunks":6},"ccnq0qay7Fs":{"title":"Writer’s Block? Use These Logic Pro Song Starters","channel":"SEIDS","chunks":3},"JyhywO6OMX0":{"title":"I Mixed A Rap Vocal From Start To Finish In 12 Minutes","channel":"Help Me Devvon","chunks":4},"iVXy2Gb7uj8":{"title":"Soft Clipper + 2 Limiters: The Mix Bus Chain That Changed Everything","channel":"Help Me Devvon","chunks":5},"SSztp1T9WFQ":{"title":"How I Mix Vocals on a 2-Track Beat (Exact Method) | 2-Track Surgeon","channel":"Help Me Devvon","chunks":7},"AJOFgB5iG2U":{"title":"How to Create Separation Between Lead and Background Vocals","channel":"Help Me Devvon","chunks":6},"qBerckgnn8c":{"title":"Everything You Need To Know About MASTERING AUDIO In 2026","channel":"Help Me Devvon","chunks":40},"YOpHVSDJ38g":{"title":"The 3 Most Underrated Vocal Compressors I Use","channel":"Help Me Devvon","chunks":3},"e5kfqOHv0wY":{"title":"How I Make Kicks Sound Louder Without Just Turning Them Up","channel":"Help Me Devvon","chunks":2},"B7iw3WNpPA4":{"title":"Why Most 808s Ruin a Mix (And How Pros Make Them Huge Without Losing Headroom)","channel":"Help Me Devvon","chunks":4},"krvV0ZImy0g":{"title":"How to Add Width to Your Bass Without Losing Power","channel":"Help Me Devvon","chunks":3},"suw9oFhH7dg":{"title":"You’re Probably Approaching EQ Wrong","channel":"Help Me Devvon","chunks":16},"7BrLLEw_ibs":{"title":"3 Fixes That Remove Vocal Harshness Fast","channel":"Help Me Devvon","chunks":5},"evGCXW1qbqw":{"title":"WAIT Why Arent You Sidechaining Your REVERBS AND DELAYS?","channel":"Help Me Devvon","chunks":5},"h3pjjX7rNIE":{"title":"I Split My Drums Into 2 Busses—and Everything Snapped Into Place","channel":"Help Me Devvon","chunks":4},"H03yq76gxCM":{"title":"Stop Over-Compressing — Do This Instead | The Uncompressor","channel":"Help Me Devvon","chunks":6},"RV-HddZgpYg":{"title":"How NEAL POGUE Used ONLY PLUGINS For Tyler The Creators CHROMAKOPIA","channel":"Help Me Devvon","chunks":22},"-zhV3LvZ8EY":{"title":"JAYCEN JOSHUA Explains How To Mix Your Drums, Use Plugins And Everything In Between","channel":"Help Me Devvon","chunks":37},"GmhMDJ-d6Aw":{"title":"Koen Heldens Reveals SECRETS Behind Mixing XXXTENTACION’s Music","channel":"Help Me Devvon","chunks":25},"h3R4JW5B4kI":{"title":"Mixing A RNB Hip Hop Song From Start To Finish With ONLY PLUGINS | RNB DREAMS","channel":"Help Me Devvon","chunks":31},"PPy0rlKYAM4":{"title":"Vocal Depth Secrets Revealed: The HMD BLACK VORTEX Is A CHEAT CODE","channel":"Help Me Devvon","chunks":7},"P7DOp0tZx8I":{"title":"4 Auxmen Technique: Add Depth, Width & Focus Fast","channel":"Help Me Devvon","chunks":8},"HxoP95XGT74":{"title":"11 Years of Mixing Advice in 11 Minutes","channel":"In The Mix","chunks":6},"wt8_7C6cpFo":{"title":"Are You Using the Wrong Compressor? Compression Masterclass","channel":"In The Mix","chunks":4},"YA4rZgq0RaI":{"title":"What You Don't Know About Reverb - Reverb Masterclass","channel":"In The Mix","chunks":4},"mk-bbzNkeJc":{"title":"EQ Masterclass - Every EQ Type Explained","channel":"In The Mix","chunks":6},"oY079oVS3Nc":{"title":"10 Years of Mixing Advice in 10 Minutes","channel":"In The Mix","chunks":5},"LnT_9Xo3VDQ":{"title":"10 Years of Mixing Advice in 10 Minutes - Part 2","channel":"In The Mix","chunks":5},"l3CIMMwVc6Q":{"title":"Mastering Start To Finish - Step By Step Mastering Guide","channel":"In The Mix","chunks":6},"yRzMby4PXzc":{"title":"Mixing Start To Finish: A Step by Step Guide to Balanced Mixes","channel":"In The Mix","chunks":10},"r8BWhS8gwio":{"title":"Sidechain Compression Masterclass - Advanced Mixing Tutorial","channel":"In The Mix","chunks":4},"ONBw9mlWfF0":{"title":"Eliminate Frequency Masking - Free and Simple Mixing Technique","channel":"In The Mix","chunks":3},"Jx32vNC9pus":{"title":"Why Your Mixes Don’t Sound Punchy - Transient Processing Technique","channel":"In The Mix","chunks":3},"3quD9xTaOzg":{"title":"Use THIS Compression Trick For BETTER Low End","channel":"In The Mix","chunks":3},"kEiILPm1VSc":{"title":"Mid Side EQ Simplified - A Powerful Tool for Stereo Mixing","channel":"In The Mix","chunks":4},"5QkBUJqSTbY":{"title":"How Loud Should You Master Your Music?","channel":"In The Mix","chunks":5},"4V2dh0gz4xg":{"title":"Do high pass filters ruin your mixes? Fixing Bad Music Production and Mixing Advice EP.2","channel":"In The Mix","chunks":3},"OoA51whvlUM":{"title":"Mixing A Song Start To Finish: Can You Hear The Difference?","channel":"In The Mix","chunks":5},"H6i55lXAMh0":{"title":"Bass Sound Design: 808s, Plucks, Growls and Sub Bass","channel":"In The Mix","chunks":7},"n6ew5mMN2pQ":{"title":"Everything you need to know about Saturation - Audio Engineering","channel":"In The Mix","chunks":6},"FFkSYlXQMxk":{"title":"Are You Using This Compression Trick? - Upwards Compression Tutorial","channel":"In The Mix","chunks":5},"pjMCyLsRNig":{"title":"Make Your Voice Sound Better - Vocal EQ Zones","channel":"In The Mix","chunks":6},"OYoPq-0Mps0":{"title":"Mixing Rap Vocals with a 2-Track Beat (Start to Finish)","channel":"Sean Divine","chunks":7},"PRtoLbLLgjc":{"title":"Perfect Rap Vocal Layers EVERY TIME (Start to Finish)","channel":"Sean Divine","chunks":4},"8ZnP8f9op1k":{"title":"Holy Grail Rap Vocal Chain | Logic Pro Edition","channel":"Sean Divine","chunks":4},"tEkKzCi8fwg":{"title":"Holy Grail Rap Vocal Chain | Waves Edition","channel":"Sean Divine","chunks":5},"dXYZiSvusyw":{"title":"Ozone 12: Your Old Mastering Workflow is OBSOLETE","channel":"Sean Divine","chunks":6},"4nvY91YvpY8":{"title":"Mastering a Song from Scratch in Logic Pro (Stock Plugins ONLY!)","channel":"Sean Divine","chunks":8},"-z13OdC-hwo":{"title":"LOUD Mastering with 1 PLUGIN (Start to Finish)","channel":"Sean Divine","chunks":8},"NNpmYe-TNBA":{"title":"iZotope Audiolens | Match Spotify Song Loudness and Tonal Balance","channel":"Sean Divine","chunks":2},"Oz_2ECzbW1M":{"title":"Why Your Kicks, 808s and Sub Bass Suck","channel":"Sean Divine","chunks":4},"uwBwBGMIGbQ":{"title":"Dynamic EQ Sidechaining | Kicks, 808s and Sub Bass","channel":"Sean Divine","chunks":2},"yRh96IOjvu8":{"title":"Design and Mix the Perfect 808 Bass 🔈🎚","channel":"Sean Divine","chunks":3},"H_Qix1Z_iRY":{"title":"Mixing SUPER LOW SUB BASS Like A Pro","channel":"Sean Divine","chunks":5},"D3LhWEFiICI":{"title":"The Only Gain Staging Tutorial You Need (No More Guessing)","channel":"Sean Divine","chunks":4},"lIMVB75WafY":{"title":"Compression Ear Training Masterclass in 12 Minutes","channel":"Sean Divine","chunks":4},"_d6aHdyOuDk":{"title":"Using Reverb to Create a VIBE (Full Mixing Guide)","channel":"Sean Divine","chunks":3},"lMhuAn0QChM":{"title":"Why Your Reverb Sounds AMATEUR (And How to Fix It)","channel":"Sean Divine","chunks":3},"-Y4_aLOJH_Q":{"title":"Mixing Rap Vocals to Perfectly Blend with the Beat","channel":"Sean Divine","chunks":5},"jZxWLGMWWxc":{"title":"Top 5 Mixing Myths Killing Your Mix","channel":"Sean Divine","chunks":7},"HqQzw-8EBhQ":{"title":"Ultimate Guide to Mixing with Headphones","channel":"Sean Divine","chunks":6},"NXosD9yzUfI":{"title":"Mixing LOUD Beats that Compete (5 Simple Steps)","channel":"Sean Divine","chunks":5},"LJ4DLA4EUow":{"title":"This is a 12 minute mixing course","channel":"Big Z","chunks":5},"S89aG5-ajxc":{"title":"How to get incredibly punchy masters","channel":"Big Z","chunks":2},"zTZtK1jNk7Y":{"title":"How to eq like a pro (stop guessing)","channel":"Big Z","chunks":3},"api8s3a_GZA":{"title":"Why other mixes sound louder than yours (it's not mastering)","channel":"Big Z","chunks":3},"Yb7I9Lx9F_w":{"title":"2,921 Mixes Later, This Is The #1 Change I Make","channel":"Big Z","chunks":2},"6_0bgfNEyws":{"title":"If You Only Learn 1 Mixing Trick, Learn This","channel":"Big Z","chunks":3},"cI9snwEnLDo":{"title":"How To Get A Mathematically Perfect Low End Mix!","channel":"Big Z","chunks":3},"3c_0DdbNOYc":{"title":"How To Get A Mathematically Balanced Vocal Mix","channel":"Big Z","chunks":3},"rGk8iMimYQs":{"title":"Watch This Before Adding Reverb To Your Mix","channel":"Big Z","chunks":3},"0ZOx2o_2Zfw":{"title":"I Mixed 1,000 Tracks (Here's My #1 Tip)","channel":"Big Z","chunks":3},"TAZh8oCUFKs":{"title":"How to squeeze the last 10% out of a mix","channel":"Big Z","chunks":4},"UOuTV2n6xh0":{"title":"Why your kick is ruining your mix (and how to fix it)","channel":"Big Z","chunks":3},"Q0UxdQUoEKQ":{"title":"How To Compress Like A Pro!","channel":"Big Z","chunks":3},"peAfZdYcWtk":{"title":"How to balance this area for a world class mix","channel":"Big Z","chunks":3},"_RoamlCqD3s":{"title":"I Mixed 500 Songs, This Is The #1 Problem I Found...","channel":"Big Z","chunks":2},"RJpWP48zZM4":{"title":"The Mastering Chain That Never Fails","channel":"Mastering.com","chunks":7},"cqZ5iMj72cU":{"title":"Every MIXING PLUGIN Explained in 23 Minutes","channel":"Mastering.com","chunks":9},"8-Z0KHeRR3w":{"title":"Do this BEFORE you start mixing (VU Trick)","channel":"Mastering.com","chunks":22},"vuDLaI0ODRw":{"title":"Once you know these 3 things, mixing is so much easier","channel":"Mastering.com","chunks":7},"H4nPHW_zMbc":{"title":"The Only 16 Mixing Tips You’ll Ever Need","channel":"Mastering.com","chunks":21},"fnLL8Qo8S-w":{"title":"The world's shortest compression course","channel":"Mastering.com","chunks":3},"ETrLK0lH6aY":{"title":"3 Levels of Compression - NOOB vs PRO vs EXPERT","channel":"Mastering.com","chunks":7},"nWDgeb6Qpsg":{"title":"3 Levels of Reverb - BEGINNER vs PRO vs EXPERT","channel":"Mastering.com","chunks":8},"P3-gKGjo9iU":{"title":"Mixing Low End: Everything You Need To Know!","channel":"Mastering.com","chunks":14},"Lf9-bvVXEXk":{"title":"Mixing from Scratch with Kevin \"Black Pearl\" McCloskey (DaBaby, Future, Juice WRLD)","channel":"Mastering.com","chunks":41},"7r5iP6v3C8s":{"title":"5 Tips for Mixing Hip Hop and R&B","channel":"Mastering.com","chunks":6},"YOtvxXaoGeA":{"title":"10 Tips For Louder Masters (Without Distortion)","channel":"Mastering.com","chunks":17},"OAS9QaU80nU":{"title":"How PROs Use Vocal Delay & Reverb","channel":"Mastering.com","chunks":11},"xpaAijC4By0":{"title":"VOCAL CHAIN ORDER MATTERS! (How To Order Your Plugins When Mixing Vocals)","channel":"Mastering.com","chunks":3},"Og8tYrFWazE":{"title":"How To Compress Vocals (The Step-By-Step Guide!)","channel":"Mastering.com","chunks":3},"Tq5lDHCKt84":{"title":"A complete guide to GAIN STAGING (your questions answered)","channel":"Mastering.com","chunks":9},"aKrF2dra1S0":{"title":"The SIMPLE Mixing Workflow (How To Mix a Song From Scratch)","channel":"Mastering.com","chunks":4},"5pKbIRxhxIw":{"title":"Compression vs Limiting vs Clipping","channel":"Mastering.com","chunks":4},"TIDfOKrpNrE":{"title":"How to Make Vocals SIT in the Mix [Mixing Vocals]","channel":"Mastering.com","chunks":7},"wrUpFF7nlOg":{"title":"The Best EQ Advice I've Got (The Balance Chart)","channel":"Mastering.com","chunks":8},"XrGZPWuiJ7o":{"title":"Give me 19 mins, and I'll Improve your mixing skills by 126%","channel":"Alex Rome","chunks":6},"xlAf88_zcNk":{"title":"10 Mixing Tips No Producer Should Ignore","channel":"Alex Rome","chunks":8},"l5euqa17NgY":{"title":"This Ruins 90% of Mixes","channel":"Alex Rome","chunks":3},"cU0tHoyJYjo":{"title":"10 Mixing Tips That Changed My Life","channel":"Alex Rome","chunks":6},"nMfQMjx5zNU":{"title":"5 Legendary EQ Tricks The Pro's Use","channel":"Alex Rome","chunks":3},"phXHwcnbtjc":{"title":"How You Should Process your Drums (easiest method)","channel":"Alex Rome","chunks":2},"uPqdBUvepPo":{"title":"How Panning Can Dramatically Improve Any Song","channel":"Alex Rome","chunks":3},"IFBTd3lobEw":{"title":"Should You Be Compressing Drums?","channel":"Alex Rome","chunks":2},"ZapolEsZskQ":{"title":"These Drum Layering Tips Will Blow Your Mind!","channel":"Alex Rome","chunks":4},"UDxvPmeInxg":{"title":"YOUR DRUMS SUCK! Make Them HUGE With This EASY Method (Mixing tutorial)","channel":"Alex Rome","chunks":4},"A0srzTbNxEg":{"title":"Why Your Bass Sounds Muddy and Worthless","channel":"Alex Rome","chunks":3},"5XwYDBcxb7Y":{"title":"How to Properly Mix a Beat From Scratch","channel":"Alex Rome","chunks":4},"zTrJ3M5veWo":{"title":"How I Mix a Vocal in 9 Minutes (Step-By-Step)","channel":"Nathan James Larsen","chunks":2},"qe7nfxqE5WU":{"title":"How I Mix a Vocal in UNDER 5 Minutes","channel":"Nathan James Larsen","chunks":2},"VTUdiZDl7v4":{"title":"You can't hear it... but it's killing your mix","channel":"Nathan James Larsen","chunks":7},"-xDt5KRQLDM":{"title":"Reverb Tricks Pros Use (that you probably don't)","channel":"Nathan James Larsen","chunks":8},"yjD18azGpJA":{"title":"Mixing MISTAKE Nobody Talks About","channel":"Nathan James Larsen","chunks":5},"kRzdmR9oXKo":{"title":"Compression Trick Pro Producers Use","channel":"Nathan James Larsen","chunks":5},"vRa_Zk90lDc":{"title":"EQ Explained in 10 Minutes ... or it's free","channel":"Nathan James Larsen","chunks":5},"yO5AqiiXbsU":{"title":"PRO Secret to 10x Better Mixes","channel":"Nathan James Larsen","chunks":6},"x_BN8a4ZhUU":{"title":"How to Prep a Track for Mixing","channel":"Nathan James Larsen","chunks":5},"J80LDtYJqkM":{"title":"CRUSH Your Drum Production 👉 DO THIS","channel":"Nathan James Larsen","chunks":3},"YNYG80wkaCY":{"title":"Drum Production Trick PROS Use","channel":"Nathan James Larsen","chunks":4},"tfIMlGfflNA":{"title":"How to Tune Vocals (NATURALLY)","channel":"Nathan James Larsen","chunks":8},"ms7EpjeB5Wo":{"title":"Mixing a Hip-Hop track with Waves plugins - FULL MIX WALKTHROUGH!","channel":"Adam Lewis Mixing","chunks":21},"mZjBN4L7iro":{"title":"FULL RAP MIX WALKTHROUGH // How I Mixed Khaled Siddiq - Still On Deen","channel":"Adam Lewis Mixing","chunks":23},"3a5Wnbv7HDM":{"title":"Mixing a Boom Bap Hip-Hop track with WAVES PLUGINS! [Full Mix Breakdown]","channel":"Adam Lewis Mixing","chunks":19},"Lnd4_cgWorY":{"title":"FULL WALKTHROUGH - Mixing an R&B Song in Logic / STOCK PLUGINS ONLY","channel":"Adam Lewis Mixing","chunks":20},"OTMNjugA6Qw":{"title":"FULL MIX WALKTHROUGH - Mixing Jafro's ‘Hardest Bars’ Freestyle","channel":"Adam Lewis Mixing","chunks":22},"lR6Jk-1Fzy0":{"title":"FULL MIX WALKTHROUGH! How I mixed: 'What You On' by Maniscooler, Kamakaze, JayaHadADream","channel":"Adam Lewis Mixing","chunks":31},"HAjkil80ilw":{"title":"Mixing R&B Vocals with WAVES Plugins Only - FULL WALKTHROUGH!","channel":"Adam Lewis Mixing","chunks":20},"lGTTnHjTnFY":{"title":"Full Walkthrough of a HIP-HOP mix! With Slate Digital & SSL Plugins","channel":"Adam Lewis Mixing","chunks":22},"gb5mgGBj70E":{"title":"FULL WALKTHROUGH! - Hip-Hop/Rap Mixing with Waves Plugins [Kamakaze - BACKWIDDA]","channel":"Adam Lewis Mixing","chunks":17},"COvnmkGVC3I":{"title":"FULL R&B VOCAL MIX WALKTHROUGH! How I Mixed: Tsharna - Think About Me","channel":"Adam Lewis Mixing","chunks":27},"6xZXCcbInMs":{"title":"FULL WALKTHROUGH! Mixing a 90s Style BOOM BAP Hip-Hop Track","channel":"Adam Lewis Mixing","chunks":20},"5RH8XgeW7mA":{"title":"Full UK Rap Mix & Master Walkthrough - How I Mixed: Tray Avlon - 'Opposites'","channel":"Adam Lewis Mixing","chunks":22},"d_cPDKfWBso":{"title":"Full Melodic Hip-Hop Mix & Master Walkthrough: How I Mixed: Sane - ‘F.W.T.O.’","channel":"Adam Lewis Mixing","chunks":16},"bQjLhaEacPM":{"title":"Full In-Depth R&B Mix Walkthrough: 'Love Well' by Im*ni","channel":"Adam Lewis Mixing","chunks":11},"P1tWSWn1IpI":{"title":"Full Rap Mix & Master Walkthrough - How I Mixed: Jafro - 'Pop Smoke'","channel":"Adam Lewis Mixing","chunks":13},"pEMVjcuPLDY":{"title":"5 MILLION+ Streams! - Full Mix Walkthrough for Kamakaze - 'Coldiene’","channel":"Adam Lewis Mixing","chunks":8},"0uMk3PgmeoQ":{"title":"How I edit RAP VOCALS before mixing","channel":"Adam Lewis Mixing","chunks":9},"SeVMJChLuP8":{"title":"Full Vocal FIXING & EDITING Masterclass! (clipping, room reverb, breaths, timing and more)","channel":"Adam Lewis Mixing","chunks":19},"pjwsE7KS-QU":{"title":"Creating Delay Throws & Mixing Adlibs for a Hip-Hop Track [with H-Delay]","channel":"Adam Lewis Mixing","chunks":4},"0HAIoywKysI":{"title":"USE THIS to remove reverb and room echoes from your vocals!","channel":"Adam Lewis Mixing","chunks":2},"QuGtNqH-DfU":{"title":"How to mix Vocals in 6 SIMPLE Steps 🔥 AutoTune, EQ, Compression, Reverb, Delay","channel":"Try Karra","chunks":4},"NuPC8LCBP2M":{"title":"Recording & Mixing Pop Vocals with Waves Plugins | Logic Pro Tutorial","channel":"Try Karra","chunks":4},"XRrBvCMHUM4":{"title":"Recording & Mixing RnB / Pop Vocals | Gen 2 Apollo & UAD Plugins Sound Quality Test 🎧🎶","channel":"Try Karra","chunks":5},"TsIqmGDW3a0":{"title":"Recording & Mixing Vocals in Ableton 12 | 100% STOCK PLUGINS!","channel":"Try Karra","chunks":6},"xArNj4IG_XY":{"title":"Recording & Mixing Vocals in Logic Pro 11 | 100% STOCK PLUGINS TUTORIAL","channel":"Try Karra","chunks":7},"9XntU0nLEfY":{"title":"How to Mix Vocals in Logic (STOCK PLUGINS)","channel":"Try Karra","chunks":5},"fMKdpBUfsxo":{"title":"How To Mix Vocals in Ableton (STOCK PLUGINS)","channel":"Try Karra","chunks":7},"siDJWWsPxEI":{"title":"How to Record & Mix Vocals in FL Studio (99% STOCK PLUGINS!)","channel":"Try Karra","chunks":7},"hGvJJAyHRyg":{"title":"How To EQ Dance Music","channel":"Streaky","chunks":6},"JQGzreWqbv4":{"title":"The Vocal Mixing Mistake Almost Everyone Makes","channel":"Streaky","chunks":2},"eFMedQGPVNk":{"title":"Stop Using Reverb Like This (Do THIS Instead)","channel":"Streaky","chunks":2},"HCGmhEPthpM":{"title":"SECRET LOW END BACK BUSS TRICK","channel":"Streaky","chunks":3},"_luxYVFmCB4":{"title":"Drum Processing Trick Your Mix Needs","channel":"Streaky","chunks":3},"Uf-xPF98y-k":{"title":"FIX YOUR LOW END","channel":"Streaky","chunks":3},"hBRUKlSr7Q4":{"title":"The EQ Step Everyone Skips","channel":"Streaky","chunks":4},"dY7AgHAp3Iw":{"title":"WHY Your LOW END Isn't PUNCHY!","channel":"Streaky","chunks":3},"XZLOvuTZGhU":{"title":"BASS SATURATION TRICK THEY ALL DO","channel":"Streaky","chunks":2},"dMHyEHXosiU":{"title":"🪄 EQ Magic Settings : 25 Years of Pro Mastering","channel":"Streaky","chunks":3},"txaDbWZVurI":{"title":"RADIO READY Vocal compression | Pro Engineer Mixing Tutorial","channel":"Streaky","chunks":3},"CXtl5_NlTIs":{"title":"Perfect Compression In 321 Seconds","channel":"Streaky","chunks":2},"MLK5Sm2d9zI":{"title":"The Mixing Routine That Changed My Life","channel":"Streaky","chunks":4},"8uHzFnlgW40":{"title":"Dry To Pro Vocals (8 Step Chain)","channel":"Streaky","chunks":3},"iZToEmjulUw":{"title":"How Pro Engineers Put Effects On Vocals","channel":"Streaky","chunks":2},"jl8y51bouno":{"title":"EQ Trick They All Use","channel":"Streaky","chunks":2},"kWQvUHFRRIs":{"title":"Eliminate Muddy Bass For Good!","channel":"Streaky","chunks":3},"Crk68mwelXU":{"title":"Pass The Car Test Every Time!","channel":"Streaky","chunks":4},"a1UBwlDFAMA":{"title":"THE 808 MIXING TRICK | How To Mix 808 And Kick Like A Pro","channel":"Streaky","chunks":3},"onKW6a9P4i0":{"title":"THE KICK AND BASS MIXING TRICK | How To Mix Low End","channel":"Streaky","chunks":4},"ZwfmbjHfJRY":{"title":"MIXING VOCALS: 4 Different Artists with Joe Carrell","channel":"Produce Like A Pro","chunks":27},"2uFh8yUKdOg":{"title":"How Do You MIX 149 TRACKS Without Mud? - Dax Liniere Mixing Majora - \"Kursk\"","channel":"Produce Like A Pro","chunks":30},"fG0osLq6tDE":{"title":"4 Different Ways to Mix Vocals, From Aggressive Compression to Natural Space","channel":"Produce Like A Pro","chunks":19},"DMwPQzGz6sw":{"title":"Mixing Vocals - 4 Different Approaches: Marc Daniel Nelson, Bob Horn, Darrell Thorp and Ariel Chobaz","channel":"Produce Like A Pro","chunks":25},"bwgPTcp2BWI":{"title":"5 Different Ways to Mix Bass, From Sub Weight to Surgical Precision","channel":"Produce Like A Pro","chunks":7},"_4L64XEaqEs":{"title":"Mixing Bass 5 Different Ways From 5 Different Mixers","channel":"Produce Like A Pro","chunks":11},"af1m_FzPeEo":{"title":"Mixing DRUMS - Inside the Mixer’s Mind – Four Distinct Philosophies","channel":"Produce Like A Pro","chunks":27},"q7H7tY-A3yA":{"title":"Mixing Hip Hop Kick With Ariel Chobaz","channel":"Produce Like A Pro","chunks":6},"4pMlRuv6Bo4":{"title":"How To Use COMPRESSION: Ultimate Breakdown","channel":"Produce Like A Pro","chunks":6},"rAaUViksMmU":{"title":"5 Tips For Mixing Powerful Hip-hop Vocals","channel":"Produce Like A Pro","chunks":13},"qGSPUXjOXpM":{"title":"Record & Mix RnB Trap Vocals with AMAC - [🔥New Course Excerpt🔥]","channel":"Produce Like A Pro","chunks":12},"8UhzB0FYPNk":{"title":"Top 5 Rap Vocal Mixing Tips from Producer Willie Green","channel":"Produce Like A Pro","chunks":5},"nkPnxOkUd6s":{"title":"5 Quick EQ Mixing Tricks - Warren Huart: Produce Like A Pro","channel":"Produce Like A Pro","chunks":7},"7tJfy7_2fTk":{"title":"5 Quick Vocal Mixing Tricks - Warren Huart: Produce Like A Pro","channel":"Produce Like A Pro","chunks":4},"MKQlt1NUYn0":{"title":"Mixing Hip Hop Vocals featuring Ariel Chobaz & Bob Horn - Warren Huart: Produce Like A Pro","channel":"Produce Like A Pro","chunks":7},"NSMIJnokXIo":{"title":"Mixing Hip Hop with Ariel Chobaz - Warren Huart: Produce Like a Pro","channel":"Produce Like A Pro","chunks":28},"TFpjs7JqyHI":{"title":"Mixing Kick & Bass in Hip Hop (ft. Ariel Chobaz & Bob Horn)  - Warren Huart: Produce Like A Pro","channel":"Produce Like A Pro","chunks":6},"cAQbGAp83To":{"title":"Mixing Hip Hop/R&B From Start To Finish with Marc Daniel Nelson","channel":"Produce Like A Pro","chunks":10},"xBsAB-s-PKY":{"title":"Mixing Hip Hop (FREE Custom Presets!) - Marc Daniel Nelson","channel":"Produce Like A Pro","chunks":11},"7RPymX8W7bg":{"title":"5 Hip-Hop Vocal Mixing Tricks from Paul \"Willie Green\" Womack!","channel":"Produce Like A Pro","chunks":4},"gXfqSmLcOgA":{"title":"Mixing Vocals in Logic Pro 11 - Stock Plugins ONLY!!!","channel":"Yaahn Hunter Jr","chunks":5},"Is03RVW9ddU":{"title":"Mixing & Mastering in Ableton Live 12 (Stock Plugins ONLY)","channel":"Yaahn Hunter Jr","chunks":11},"1vJk_ieTde4":{"title":"Mixing R&B Vocals in Logic Pro | Stock Plugins ONLY!","channel":"Yaahn Hunter Jr","chunks":4},"i6A2-xZKUes":{"title":"how you can MIX r&b background vocals using Logic Pro Stock Plugins..","channel":"Yaahn Hunter Jr","chunks":4},"ER1R8ZTCloE":{"title":"Mixing Kicks and 808's like a PRO! Logic Pro Stock Plugins!","channel":"Yaahn Hunter Jr","chunks":3},"3B1U8x_gTIg":{"title":"PRODUCERS! Low-End Mixing Made Simple!","channel":"Yaahn Hunter Jr","chunks":3},"rGV6QkD0a5k":{"title":"Producers! Here's The SECRETS to BASS LINES!","channel":"Yaahn Hunter Jr","chunks":2},"MIQNepvYlSE":{"title":"Producers! Here's How to Improve Your Bass Lines!","channel":"Yaahn Hunter Jr","chunks":2},"SpmqsnwcHsE":{"title":"secrets to making YOUR beats HIT HARD!","channel":"Yaahn Hunter Jr","chunks":2},"5I_qx4qSkDo":{"title":"Mixing Secrets for Music Producers!","channel":"Yaahn Hunter Jr","chunks":4},"8Up6C2j1ggo":{"title":"How to Mix and Master in Logic Pro | Stock Plugins ONLY!","channel":"Yaahn Hunter Jr","chunks":6},"DY_MMDWMKOM":{"title":"How To Mix Vocals | Logic Pro X | Stock Plugins ONLY!","channel":"Yaahn Hunter Jr","chunks":8},"uKp_IkHd8C4":{"title":"Tuning Vocals in Logic Pro | Stock Plugins Only!","channel":"Yaahn Hunter Jr","chunks":4},"LA-hwN5e0hY":{"title":"Ultimate Vocal Chain | Logic Pro X | Yaahn Hunter Jr","channel":"Yaahn Hunter Jr","chunks":4},"UAEnjE2xmXA":{"title":"R&B Vocal Chains Advanced","channel":"Yaahn Hunter Jr","chunks":3},"rswG_lIggmY":{"title":"Every Genre's Kick Drum Explained In Detail","channel":"TheCosmicAcademy","chunks":4},"I_X-XEpX6LY":{"title":"Most EQ Problems Come From Skipping This Step","channel":"TheCosmicAcademy","chunks":2},"eAgy6SLhjlk":{"title":"You’re Mixing Wrong: Loud + Clean Happens Before Mastering","channel":"TheCosmicAcademy","chunks":3},"9Oy_iVDcnsE":{"title":"Every song with HEAVY LOW END should use this compression trick","channel":"TheCosmicAcademy","chunks":2},"gY2YbQl4icE":{"title":"Unf*ck Your Master (Limiters Are KILLING Your Low End)","channel":"TheCosmicAcademy","chunks":2},"S1bB1N6KIz4":{"title":"New Producer Mistakes That Can Lead to Muddy Drum Mixes","channel":"TheCosmicAcademy","chunks":5},"dXNkqDDfgAM":{"title":"Your Kick And Snare Are KILLING Your Mix","channel":"TheCosmicAcademy","chunks":3},"tCFRrplNEjs":{"title":"The LIKELY Reason Why Your Kick & Bass STILL Don’t Compare To The Pros","channel":"TheCosmicAcademy","chunks":3},"UQpyAuq5vHk":{"title":"Solving your BIGGEST kick drum problems in 180 seconds","channel":"TheCosmicAcademy","chunks":3},"F77V5u6-Efg":{"title":"This 3-Minute Mixing Strategy Wins GRAMMYS (here’s how to do it)","channel":"TheCosmicAcademy","chunks":2},"0JzfVLF7NXU":{"title":"How Bedroom Producers Can Improve Their Mix Quality","channel":"TheCosmicAcademy","chunks":4},"oCaMcnhvLd8":{"title":"the BEST mixing advice I ever received...","channel":"TheCosmicAcademy","chunks":5},"BOg6Rq_WIds":{"title":"Why Everyone Seems To Have Better Mixes Than You -- Not What You'd Think","channel":"TheCosmicAcademy","chunks":5},"slWhNujTSeY":{"title":"SECRET KICK RECIPE: Best Way To Sample Kicks From The Pros","channel":"TheCosmicAcademy","chunks":3},"eqTk8okIj7M":{"title":"Full MASTERCLASS On Drums | For FREE","channel":"TheCosmicAcademy","chunks":17},"sSJutuZVBcE":{"title":"IT WORKS: Proven to balance & improve a muddy mixdown (all genres)","channel":"TheCosmicAcademy","chunks":4},"Q-kHzdIwiE8":{"title":"CHEAT CODE for loud and punchy Drums (FL Studio, Ableton, Logic Pro)","channel":"TheCosmicAcademy","chunks":4},"MDx1NBcRop4":{"title":"Kick Drum Secrets - A \"not so typical\" approach to make your KICK stand out","channel":"TheCosmicAcademy","chunks":4},"bpOZ7Thulaw":{"title":"The Hidden Psychology of Mixes That Sound Good","channel":"TheCosmicAcademy","chunks":3},"Vl9har5cbOA":{"title":"Bainz mixing 'Money On Money' by Young Thug ft. Future | Trailer","channel":"Mix With The Masters","chunks":1},"dyXTW_07X4c":{"title":"Bainz mixing 'Yea Yea Yea' by Young Thug | Trailer","channel":"Mix With The Masters","chunks":1},"9_bQBSWhr6I":{"title":"Bainz building an analog mix bus for Young Thug | Sneak Peek","channel":"Mix With The Masters","chunks":2},"feLGO4-XmA0":{"title":"Bainz mixing 'Tick Tock' by Young Thug | Trailer","channel":"Mix With The Masters","chunks":1},"KngUEpde9Qg":{"title":"Bainz mixing vocals for Young Thug | Sneak Peek","channel":"Mix With The Masters","chunks":3},"g-Avgl7FVJ8":{"title":"Illangelo producing 'Crew Love' by Drake ft. The Weeknd | Trailer","channel":"Mix With The Masters","chunks":1},"v5iCL2UWPoU":{"title":"Illangelo producing & mixing \"Alone Again\" by The Weeknd","channel":"Mix With The Masters","chunks":1},"r789GUiEekY":{"title":"Illangelo programming drums for Drake & The Weeknd | Sneak Peek","channel":"Mix With The Masters","chunks":2},"VK4z52yF7Bw":{"title":"Illangelo mixing vocals for Post Malone | Sneak Peek","channel":"Mix With The Masters","chunks":2},"NzSvZaxZUHM":{"title":"Producing The Weeknd's vocals with Illangelo","channel":"Mix With The Masters","chunks":5},"1DMe4BvFdBQ":{"title":"Teezio Mixing ‘Blow for Blow’ by Tee Grizzley (feat. J. Cole) | Trailer","channel":"Mix With The Masters","chunks":2},"PC5ar4Ci5Uw":{"title":"Teezio mixing 'Angel Numbers' by Chris Brown | Trailer","channel":"Mix With The Masters","chunks":1},"k9uQ80y_sGE":{"title":"Teezio mixing vocals for Chris Brown | Sneak Peek","channel":"Mix With The Masters","chunks":2},"ie9uo19y7J0":{"title":"Teezio mixing 'Freak' by Chris Brown | Trailer","channel":"Mix With The Masters","chunks":1},"mfSzkQOlb_4":{"title":"Leslie Brathwaite Mixing ’Glory’ by JID | Trailer","channel":"Mix With The Masters","chunks":1},"EZDM33TLXxo":{"title":"Leslie Brathwaite mixing ‘Churchill Downs’ by Jack Harlow feat. Drake","channel":"Mix With The Masters","chunks":1},"-zeVcD2jgwc":{"title":"Leslie Brathwaite mixing ‘Days Come and Go' By Lil Uzi Vert | Trailer","channel":"Mix With The Masters","chunks":1},"9L-I4PhzFdI":{"title":"Leslie Brathwaite mixing drums for Jack Harlow & Drake｜Sneak Peek","channel":"Mix With The Masters","chunks":2},"QfQC1GIlRDA":{"title":"Leslie Brathwaite mixing 'Bongos' by Cardi B ft. Megan Thee Stallion | Trailer","channel":"Mix With The Masters","chunks":1},"E01jKewY4As":{"title":"Leslie Brathwaite mixing vocals for Cardi B | Sneak Peek","channel":"Mix With The Masters","chunks":2},"ExCRuI06iTg":{"title":"ExCRuI06iTg","channel":"Mix With The Masters","chunks":2},"AWCNt23AZKI":{"title":"Decision making with Leslie Brathwaite","channel":"Mix With The Masters","chunks":2},"CjCYftTxWJ4":{"title":"Leslie Brathwaite mixing Cardi B","channel":"Mix With The Masters","chunks":1},"D4QpaiqvTYo":{"title":"Leslie Brathwaite Mixing \"Happy\" by Pharrell Williams","channel":"Mix With The Masters","chunks":1},"lwObd9IpMeI":{"title":"Mixing during lockdown with Leslie Brathwaite","channel":"Mix With The Masters","chunks":2},"ZglkJ1odChg":{"title":"Leslie Brathwaite mixing “Ohmygah” by Os Young | Trailer","channel":"Mix With The Masters","chunks":1},"Rzn_7Y7qB24":{"title":"Leslie Brathwaite Mixing ‘Big’ by Rita Ora, David Guetta, Imanbek & Gunna","channel":"Mix With The Masters","chunks":1},"1smew-Y7Ttc":{"title":"Mixing IV Jay with Leslie Brathwaite","channel":"Mix With The Masters","chunks":1},"zpf6pIo3HKY":{"title":"Being efficient - Leslie Brathwaite","channel":"Mix With The Masters","chunks":4},"yu5ShUuJNZM":{"title":"Jaycen Joshua mixing 'D-R-U-N-K' by Lady London","channel":"Mix With The Masters","chunks":1},"LY-vU5MwBvs":{"title":"Jaycen Joshua's drum bus","channel":"Mix With The Masters","chunks":3},"5jDVJnVsy44":{"title":"Jaycen Joshua - Critical Listening Workshop","channel":"Mix With The Masters","chunks":1},"B6vOZqqolRw":{"title":"Advanced Mixing Workshop with Jaycen Joshua | Trailer","channel":"Mix With The Masters","chunks":1},"BELkgU5j2ww":{"title":"Jaycen Joshua on creative drum mixing","channel":"Mix With The Masters","chunks":3},"YMCSaRJo4_8":{"title":"Jaycen Joshua Mixing ’Take Me Back To London’ by Ed Sheeran ft. Stormzy | Trailer","channel":"Mix With The Masters","chunks":1},"I6G4J8VfOXg":{"title":"Studio Secrets with Jaycen Joshua | Sneak Peek","channel":"Mix With The Masters","chunks":2},"UuckAptGmrg":{"title":"Jaycen Joshua Studio Workshop Mixing an Emerging Artist | Trailer","channel":"Mix With The Masters","chunks":1},"Mwrmzn0mGGE":{"title":"Jaycen Joshua mixing 'Oliveira Dos Cen Anos' by C. Tangana | Trailer","channel":"Mix With The Masters","chunks":1},"h8-z1LKAYXA":{"title":"Jaycen Joshua mixing group vocals for C. Tangana | Sneak Peek","channel":"Mix With The Masters","chunks":2},"L6xx7DWKzng":{"title":"Mixing Summits with Jaycen Joshua","channel":"Mix With The Masters","chunks":6},"jaottsDfxNc":{"title":"Mixing process with Jaycen Joshua and Dave Pensado","channel":"Mix With The Masters","chunks":1},"5-T3hXtsYL4":{"title":"Anthony Kilhoffer Producing, Mixing & Mastering 'Ni**as In Paris' by JAY-Z and Kanye West  | Trailer","channel":"Mix With The Masters","chunks":1},"CJLb1RZRcaE":{"title":"Boi-1da producing ‘Mafia’ by Travis Scott","channel":"Mix With The Masters","chunks":1},"WW0wvj4LwuA":{"title":"Boi-1da making a beat for Travis Scott | Sneak Peek","channel":"Mix With The Masters","chunks":2},"Q3pRQpGx3IQ":{"title":"Jahaan Sweet composing & beatmaking for Drake and Travis Scott | Trailer","channel":"Mix With The Masters","chunks":1},"cer_YU6Rrhs":{"title":"Jahaan Sweet making a beat for Drake | Sneak Peek","channel":"Mix With The Masters","chunks":2},"QDvQ8x0QyFI":{"title":"Starting a new production with Young Guru","channel":"Mix With The Masters","chunks":3},"eg_z5GByPx0":{"title":"Young Guru producing 'The Kudeta' by Voli Contra","channel":"Mix With The Masters","chunks":1},"2PJzFvkZvCo":{"title":"Taking your ideas to the next level with Young Guru","channel":"Mix With The Masters","chunks":4},"lRpGlHUMTXw":{"title":"Producing ‘After Party’ by Don Toliver with Sonny Digital","channel":"Mix With The Masters","chunks":1},"VD67m0Bwgv8":{"title":"H.E.R.'s song arrangement with Rodney Jerkins","channel":"Mix With The Masters","chunks":1},"LHuksljL9BQ":{"title":"Production Seminar (Episode 2) with Timbaland, Jaycen Joshua & Dave Pensado","channel":"Mix With The Masters","chunks":1},"kMDyzj69eOU":{"title":"Timbaland, Jaycen Joshua and Dave Pensado producing a track at Studios La Fabrique","channel":"Mix With The Masters","chunks":2},"TgdkWXlGnN0":{"title":"Stuart White mixing a beat for Beyoncé | Sneak Peek","channel":"Mix With The Masters","chunks":1},"fZ1zbfQ45TQ":{"title":"Stuart White mixing ‘BREAK MY SOUL (THE QUEENS REMIX)’ by Beyoncé | Trailer","channel":"Mix With The Masters","chunks":1},"wsi4Cyizql4":{"title":"Stuart White recording and mixing vocals for Beyoncé | Sneak Peek","channel":"Mix With The Masters","chunks":2},"jrUKl2fTnKQ":{"title":"Mixing 'Yoncé' by Beyoncé with Stuart White | Trailer","channel":"Mix With The Masters","chunks":1},"E8ecbW46mEo":{"title":"Mixing vocals in the box with Stuart White","channel":"Mix With The Masters","chunks":2},"9s6zAz3y9Pk":{"title":"Ben Baptie engineering & mixing ‘Gorilla’ by Little Simz | Trailer","channel":"Mix With The Masters","chunks":1},"Hunq0HakrI4":{"title":"Julian Casablancas’ vocal sound with Ben Baptie","channel":"Mix With The Masters","chunks":3},"wqgu41v2_zc":{"title":"Ben Baptie Mixing‘Doomed’ By Moses Sumney | Trailer","channel":"Mix With The Masters","chunks":1},"JxKbsqFPOyw":{"title":"Tom Elmhirst mixing 'TIL FURTHER NOTICE' by Travis Scott ft. James Blake & 21 Savage | Trailer","channel":"Mix With The Masters","chunks":1},"7vn_iIyOULQ":{"title":"Tom Elmhirst creating a mix template for Travis Scott | Sneak Peek","channel":"Mix With The Masters","chunks":2},"1FsiCRl_yO0":{"title":"Vocal Production Workshop with Tom Elmhirst | Trailer","channel":"Mix With The Masters","chunks":1},"EHLY5bk2TvY":{"title":"Tom Elmhirst breaks down his mix of 'Rolling in the Deep' by Adele","channel":"Mix With The Masters","chunks":2},"OW3FKauvUZo":{"title":"Mixing Dua Lipa's vocals with Josh Gudwin","channel":"Mix With The Masters","chunks":7},"uLimN5bHPR4":{"title":"Kevin Davis mixing vocals for Jennifer Hudson | Sneak Peek","channel":"Mix With The Masters","chunks":2},"42NZCaL9GF0":{"title":"Finneas Writing and Producing ‘BIRDS OF A FEATHER' by Billie Eilish | Trailer","channel":"Mix With The Masters","chunks":1},"OGKWgxTL2zI":{"title":"Finneas producing 'Therefore I Am' by Billie Eilish","channel":"Mix With The Masters","chunks":1},"CPROY0-0T2U":{"title":"Creative drum sampling with Finneas","channel":"Mix With The Masters","chunks":3},"7Y6aFCS8evg":{"title":"Vocal production for Billie Eilish by Finneas","channel":"Mix With The Masters","chunks":3},"avgF3khAfV0":{"title":"Jon Castelli & Aron Forbes mixing 'THE GREATEST' by Billie Eilish | Trailer","channel":"Mix With The Masters","chunks":1},"-OR_6qyW1iw":{"title":"Jon Castelli and Aron Forbes mixing ‘BIRDS OF A FEATHER’ by Billie Eilish | Trailer","channel":"Mix With The Masters","chunks":1},"8s1sqjwm2BQ":{"title":"Neal H. Pogue Mixing '10%' by Kaytranada ft. Kali Uchis","channel":"Mix With The Masters","chunks":1},"a_aoMLjyp40":{"title":"Understanding Kaytranada's vision with Neal Pogue","channel":"Mix With The Masters","chunks":3},"PBcAwVrX5GQ":{"title":"Mastering Kendrick Lamar's 'HUMBLE' with Mike Bozzi","channel":"Mix With The Masters","chunks":3},"WcYWpi48p3Q":{"title":"Mike Bozzi Mastering \"New Magic Wand\" by Tyler, The Creator","channel":"Mix With The Masters","chunks":2},"gV3ps4_sJkM":{"title":"John Greenham masters 'Bad Guy' by Billie Eilish","channel":"Mix With The Masters","chunks":2},"noBHBQd8sqQ":{"title":"Mastering Workshop with Chris Gehringer | Trailer","channel":"Mix With The Masters","chunks":1},"fM9k0Uz1FbU":{"title":"Mastering Workshop with Chris Gehringer | Trailer","channel":"Mix With The Masters","chunks":1},"jKoovGB6z50":{"title":"Drum programing with Kieron Menzies","channel":"Mix With The Masters","chunks":2},"kQ_ElaLtA6E":{"title":"Mixing Drums with Rafa Sardina","channel":"Mix With The Masters","chunks":2},"dDeF1qs3g4I":{"title":"Digital Audio Manipulation with Shawn Everett","channel":"Mix With The Masters","chunks":2},"pmDJ4uJPXx4":{"title":"Creating vocal stacks with Kuk Harrell","channel":"Mix With The Masters","chunks":3},"Uo9E2elXAlI":{"title":"Radio-ready vocal effects with Kuk Harrell","channel":"Mix With The Masters","chunks":2},"iC9S_9hdO4k":{"title":"Vocal dimensions with Dave Pensado","channel":"Mix With The Masters","chunks":2},"Jl7MdmjgbJU":{"title":"How CLA prepares vocals for a mix","channel":"Mix With The Masters","chunks":2},"7R0nD4nCYVU":{"title":"Vocal chain with Tony Maserati","channel":"Mix With The Masters","chunks":2},"7EZWECZoZnA":{"title":"The power of dynamics with Michael Brauer","channel":"Mix With The Masters","chunks":1},"7qfyx7sGEi4":{"title":"The power of multi-bus processing with Michael Brauer","channel":"Mix With The Masters","chunks":2},"8_J9DP4EsFk":{"title":"Mix buss & drum processing with Andrew Scheps","channel":"Mix With The Masters","chunks":7},"NQe_d6e50v8":{"title":"Andrew Scheps Deconstructing a Mix (VOD Release)","channel":"Mix With The Masters","chunks":1},"GJclT90IhPM":{"title":"What Every Logic Pro Stock Effect Actually Does | Part 1: Volume & Frequency","channel":"That Logic Pro Guy","chunks":4},"82QhJNcX1ag":{"title":"Logic Pro’s Most Ignored Editor Is More Powerful Than You Think","channel":"That Logic Pro Guy","chunks":4},"ogueQ7UGT-k":{"title":"Most Logic Users Miss this Hidden Vocal Tuning Trick","channel":"That Logic Pro Guy","chunks":3},"Ud6JxO59UyE":{"title":"The Secret to Confident Vocal Mixing","channel":"That Logic Pro Guy","chunks":2},"9pZwC0L526M":{"title":"The Right Way to Compress in Logic Pro 12 (My New Plug-In Makes It Easy)","channel":"That Logic Pro Guy","chunks":5},"_3zEpK9Pnfw":{"title":"Stop Bouncing Stems Manually in Logic Pro 12 (Use THIS Instead)","channel":"That Logic Pro Guy","chunks":3},"0rbYt65Chko":{"title":"Logic Pro 12 for Beginners: Everything You Need To Know","channel":"That Logic Pro Guy","chunks":7},"TDQp6t2D4GM":{"title":"The Ultimate Logic Pro Beginner Template (DOWNLOAD FOR FREE) - Also Compatible w/ Logic Pro for iPad","channel":"That Logic Pro Guy","chunks":4},"-WcHqVQEk7A":{"title":"Create Custom Apple Loops (Will Improve Your Workflow 10x Over)","channel":"That Logic Pro Guy","chunks":8},"8NVX_dCiss8":{"title":"\"Master Logic Pro: 3 Tips TO DO When Finishing Your Songs\"","channel":"That Logic Pro Guy","chunks":2},"5iwq0KK6Bys":{"title":"\"Speed Up Your Workflow: Editing Audio Faster in Logic Pro\"","channel":"That Logic Pro Guy","chunks":2},"3cliyjdnjcM":{"title":"\"Pro-Level Hi Hat Programming in Logic Pro: Tips and Techniques\"","channel":"That Logic Pro Guy","chunks":3},"_o7-pH_B-gI":{"title":"\"Master Stereo Imaging in Logic Pro: The Ultimate Panning Guide\"","channel":"That Logic Pro Guy","chunks":2},"DVlL71pCU6I":{"title":"\"Demystifying Flex Pitch in Logic Pro: Your Complete Guide\"","channel":"That Logic Pro Guy","chunks":5},"h5WRi_Mx3wI":{"title":"\"Unlock the Power of Smart Tempo in Logic Pro X: Your Complete Guide\"","channel":"That Logic Pro Guy","chunks":3},"uUbryAgIgto":{"title":"\"Logic Pro Sampling Made Easy: 3 Methods to Try\"","channel":"That Logic Pro Guy","chunks":3},"AA1bCqg5ZdM":{"title":"\"Add Some Swag to Your Tracks with Logic Pro X Swing: Here's How It Works\"","channel":"That Logic Pro Guy","chunks":3},"K-ZXDVFpF38":{"title":"\"Essential Settings for Logic Pro: Don't Miss Out, Especially If You're a Beginner!\"","channel":"That Logic Pro Guy","chunks":3},"Y8BoJEVB-us":{"title":"\"Mastering Logic Pro: Go Deeper with the Mixer (Video 4 - Understanding the G.U.I)\"","channel":"That Logic Pro Guy","chunks":3},"M8A3TQbJSVs":{"title":"\"Mastering Logic Pro: Tips on Organizing the Mixer (Video 5 - Understanding the G.U.I)\"","channel":"That Logic Pro Guy","chunks":2},"YhbRfdXbXF8":{"title":"Make Any Drum Kit Sound HUGE in Logic Pro","channel":"TheModernCreative","chunks":4},"VSFpZOb3JZI":{"title":"👉 Logic Pro 12 for Beginners: Start Here First","channel":"TheModernCreative","chunks":7},"fBd11XdMidk":{"title":"The Compressor Trick Nobody Teaches","channel":"TheModernCreative","chunks":4},"kC9ASvQ08AE":{"title":"How to Use Split EQ in 5 Easy Steps (Must Watch)","channel":"TheModernCreative","chunks":5},"C_GSco8i7Rg":{"title":"How To Increase or Decrease LUFS (Get Control of Your LOUDNESS!!!)","channel":"TheModernCreative","chunks":4},"6m02XaDBC6E":{"title":"What is Loudness Range? LRA?  (Featuring \"Oxygen\" by Black Salt Audio)","channel":"TheModernCreative","chunks":5},"SZECarsIRhg":{"title":"\"Unlock Pro-Level Sound: The Secret Kick Mastering Trick\"","channel":"TheModernCreative","chunks":2},"0F5K-FHzTuM":{"title":"Solve THIS Mixing Problem and Your Mix Will Thank You For It!!!","channel":"TheModernCreative","chunks":2},"UL9ODT3Pp04":{"title":"Exporting FX, Bus, Sends, and Aux Tracks in Logic Pro","channel":"TheModernCreative","chunks":2},"aN4vcXUvxko":{"title":"How to Set Up Inputs and Outputs in Logic Pro 2025 - Input Output #loogicpro11","channel":"TheModernCreative","chunks":2},"yaVxvnC-cuc":{"title":"\"Master Logic Pro Organization: Find Your Files Fast\"","channel":"TheModernCreative","chunks":4},"RAGmG2IgL7Y":{"title":"Easy Way to Map any Parameter! Control Surface Workflow in Logic Pro","channel":"TheModernCreative","chunks":3},"kRIWbzhZGaE":{"title":"Midi Mapping Made Easy in Logic Pro - The Cleanest Workflow in the Game","channel":"TheModernCreative","chunks":2},"FlEnfLh_4N0":{"title":"Logic Pro Quit Unexpectedly While Using a 3rd Party Plug In! Here is how to fix it","channel":"TheModernCreative","chunks":1},"adW4OMG3nnQ":{"title":"How to Create a Headphone Mix in Logic Pro","channel":"TheModernCreative","chunks":3},"zfi0CPHsc1M":{"title":"\"Overcoming Logic Pro X Automation Glitches: Tips to Restart and Succeed\"","channel":"TheModernCreative","chunks":4},"n_7wKDnFq4s":{"title":"\"Create the Drum Tracks of your Dreams\" Modo Drum User Guide - Manual Read Through","channel":"TheModernCreative","chunks":17},"hwX8KY9Y8K8":{"title":"How to Set Up Modo Drums in Multi-Output Mode (Get the Best Drum Sound Possible)","channel":"TheModernCreative","chunks":2},"Yg1P8YsYD78":{"title":"\"Discover the Magic Touch: Post-Production Secrets for Amazing Sound\"","channel":"TheModernCreative","chunks":3},"fD_LP2n53AU":{"title":"This Could Cut Your Vocal Mixing Time in Half (HVX Chain)","channel":"TheModernCreative","chunks":3},"TgksUAuKYNQ":{"title":"Your Choruses Never Sound Big Because of This","channel":"Make Your Music","chunks":2},"rPsfPIR65FM":{"title":"You Finished The Loop... Now What?","channel":"Make Your Music","chunks":4},"KOHpgBZ7E8Q":{"title":"How Producers Actually Build Songs","channel":"Make Your Music","chunks":8},"QZDEaD6xdkk":{"title":"How 6 Tracks Can Sound Bigger Than 70","channel":"Make Your Music","chunks":3},"agtJwXo0yXM":{"title":"How Pro Producers Make Fake Drums Sound Real","channel":"Make Your Music","chunks":2},"OGVqEmLuD78":{"title":"Why Your Mixes Never Sound Professional","channel":"Make Your Music","chunks":4},"e29xSAHo2-o":{"title":"You Only Need 4 Logic Plugins To Mix Professionally","channel":"Make Your Music","chunks":4},"xZ_qArTOO2g":{"title":"The Real Reason Your Vocals Sound Unfinished","channel":"Make Your Music","chunks":3},"5QDXc8s6GgM":{"title":"The #1 EQ Mistake Ruining Your Sound","channel":"Make Your Music","chunks":3},"Rp4cGZZ25hA":{"title":"The Complete Logic Pro Roadmap (Beginner to Pro System)","channel":"Make Your Music","chunks":20},"HZ4mILMvB2Y":{"title":"This Beginner Logic Pro Vocal Is TERRIBLE (I fixed it in 5 minutes)","channel":"Make Your Music","chunks":3},"LHTRSmNDLO4":{"title":"16 Brutally Honest Mixing Truths","channel":"Make Your Music","chunks":6},"EqTKc7H04ks":{"title":"The worlds shortest EQ course you'll ever need","channel":"Make Your Music","chunks":1},"HCFe3Ll5UO0":{"title":"THE worlds shortest Compression course you'll ever need","channel":"Make Your Music","chunks":1},"0MfIcuQBtHc":{"title":"THE worlds shortest REVERB course you'll ever need","channel":"Make Your Music","chunks":1},"IYvWlB5OhLg":{"title":"Produce RADIO READY vocals with ONLY stock plugins (save $1000+)","channel":"Make Your Music","chunks":7},"E747iUQFO-s":{"title":"Fix these 5 mistakes and instantly level up your sound in Logic Pro","channel":"Make Your Music","chunks":3},"3HJZU1JPRtU":{"title":"The 3 STEP Vocal SYSTEM Every Logic Pro User Should Know","channel":"Make Your Music","chunks":5},"vL39ztfu44s":{"title":"3 Logic Pro Drummer Tricks That The PROS are hiding from you","channel":"Make Your Music","chunks":6},"dxwzh1TMN0s":{"title":"Here's Why You Struggle To Finish Songs","channel":"Make Your Music","chunks":2},"6OHC6nEpMjs":{"title":"3 Common Vocal Mix Issues - SOLVED! (easier than you think)","channel":"Radium Records","chunks":6},"5_k4vhNI5yM":{"title":"Why Your Bass Keeps Disappearing (And the Fix Is Surprisingly Simple)","channel":"Radium Records","chunks":7},"HaIkvZTDn6k":{"title":"5 Things Separating Your Mix From a Professional Release","channel":"Radium Records","chunks":12},"qytYf9Rkrjs":{"title":"Stop Guessing EQ Moves, Find What Your Mix Actually Needs!","channel":"Radium Records","chunks":11},"PQbppVLQWFw":{"title":"How to Fix a Harsh Mix: Vocals, Guitars & Master Buss","channel":"Radium Records","chunks":10},"J0mUp4a-RTk":{"title":"How To Make Vocals Sound Bigger (Pro Vocal Stacking)","channel":"Radium Records","chunks":11},"q_wGl-y_XoU":{"title":"You’re Using Vocal Reverb Wrong (Here’s What To Do Instead)","channel":"Radium Records","chunks":11},"HSEksjYbgh0":{"title":"From Good to Great: The Secret to Polished Vocals","channel":"Radium Records","chunks":7},"qooS6iSnpHc":{"title":"Limiter vs Compressor Explained: Why Your Mix Sounds Flat","channel":"Radium Records","chunks":12},"_HvrYkH4nWU":{"title":"The #1 VOCAL MIXING MISTAKE You're Making and How to Fix It NOW","channel":"Radium Records","chunks":21},"yDQ7C92REGo":{"title":"Hard Clipping vs. Soft Clipping & Oversampling Explained","channel":"Radium Records","chunks":6},"u6M5Ul7by48":{"title":"VOCAL CHAIN BREAKDOWN | RADIUM MIXING SERIES","channel":"Radium Records","chunks":8},"J9vgpqQTS0A":{"title":"Favorite Plugins For Side Chaining Kick & Bass | Radium Mix Series","channel":"Radium Records","chunks":7},"3jVagfJtKKE":{"title":"Why Top 40 Hits Crush Spotify’s -14 LUFS Rule – 4 Tips for Loud, Competitive Masters","channel":"Matty Harris Mixing & Mastering","chunks":6},"_A4kiYlLXeU":{"title":"Your Song Sounds Quiet on Spotify? Try This One Trick","channel":"Matty Harris Mixing & Mastering","chunks":3},"9eCtJDbO8SY":{"title":"The EXACT 4-Step Vocal CHAIN That Fixes 90% of Mixing Problems","channel":"Matty Harris Mixing & Mastering","chunks":4},"ouDohkUxqbs":{"title":"Top 5 Bass Mixing Secrets for Punch & Definition","channel":"Matty Harris Mixing & Mastering","chunks":4},"eqNJCfMUC6k":{"title":"Mastering with Limiters: A Beginners Guide","channel":"Matty Harris Mixing & Mastering","chunks":5},"HMYETfqhgSo":{"title":"When and How to Use Clipping in Mastering","channel":"Matty Harris Mixing & Mastering","chunks":3},"f95PTpyCZSs":{"title":"How to Use Mid/Side Compression Like a Pro!","channel":"Matty Harris Mixing & Mastering","chunks":4},"jUtVdtAPmBI":{"title":"When & Why to Use Fast Compresssor Attack Times","channel":"Matty Harris Mixing & Mastering","chunks":3},"9N8FkWvXjT8":{"title":"4 MUST KNOW Drum Mixing Tips for PRO Level Sound Quality","channel":"Matty Harris Mixing & Mastering","chunks":5},"SiXszvGdYHI":{"title":"How to make your Mix sound Fuller","channel":"Matty Harris Mixing & Mastering","chunks":4},"Kxa49c9W5Mg":{"title":"How to Make Your Vocals Sound HUGE Like the Pros!","channel":"Matty Harris Mixing & Mastering","chunks":5},"B2f5-ltNr2w":{"title":"6 PRO Vocal Reverb Secrets (That Top Mixers Don't Tell You)","channel":"Matty Harris Mixing & Mastering","chunks":5},"SL6Kah5TO1s":{"title":"Every Type of Reverb Explained (and When to Use Each One)","channel":"Matty Harris Mixing & Mastering","chunks":4},"R0XW09YTLaQ":{"title":"Before and After: Turning This Demo Into a Hit","channel":"Matty Harris Mixing & Mastering","chunks":7},"tVo7csI7WNY":{"title":"3 Rules to Finally Release Your Music Instead of Sitting on It","channel":"Matty Harris Mixing & Mastering","chunks":3},"phrT2b0kMmg":{"title":"Stem Mastering Beat My Stereo Master — Here's Why","channel":"Matty Harris Mixing & Mastering","chunks":5},"GvNrhzc7c2A":{"title":"Ozone 12 Rap Mastering Cheat Code","channel":"Matty Harris Mixing & Mastering","chunks":4},"btvDzi07gEw":{"title":"I Mastered a Track Using Only Logic’s Built-In Plugins (Shockingly Good)","channel":"Matty Harris Mixing & Mastering","chunks":5},"WFRmDdUk9Ok":{"title":"How I Get That Analog Sound Mixing Entirely In the Box","channel":"Matty Harris Mixing & Mastering","chunks":4},"dsrPyxqjTn4":{"title":"Use Subloom to add massive sub to your kick drum","channel":"Matty Harris Mixing & Mastering","chunks":3},"uPAV9yV8dJ0":{"title":"Beginner EQ Tutorial: Controls, Filters, Types of EQs, and Uses | Plugin Alliance","channel":"Plugin Alliance","chunks":5},"y8qlt_EXup0":{"title":"4 Creative EQ Effects You NEED to Start Using | Plugin Alliance","channel":"Plugin Alliance","chunks":3},"qXY6-emrH7Y":{"title":"Multiband Compression vs. Dynamic EQ","channel":"Plugin Alliance","chunks":8},"e2GeoUGyJKk":{"title":"Vari-Mu Compressors: Everything You Need to Know","channel":"Plugin Alliance","chunks":9},"aY34EsloiCk":{"title":"What Is a FET Compressor?","channel":"Plugin Alliance","chunks":8},"1w0wsAfbR28":{"title":"Choosing the Right Compressor: VCA, Opto, Vari-Mu or FET?","channel":"Plugin Alliance","chunks":9},"aB7bxmtoElg":{"title":"What Makes Opto Compressors Unique?","channel":"Plugin Alliance","chunks":5},"8vteowQ7bGI":{"title":"How to Apply Multiband Compression to Your Mix | Plugin Alliance","channel":"Plugin Alliance","chunks":9},"pRmaAXa2U9E":{"title":"How to Fatten Audio While Preserving Dynamics | Plugin Alliance","channel":"Plugin Alliance","chunks":3},"lOAj8XkFxWI":{"title":"Saturation: The Secret to a Killer Rock Mix | Plugin Alliance","channel":"Plugin Alliance","chunks":3},"ST17hWbtXhg":{"title":"Tips to Add Vintage Character to Your Mix | Plugin Alliance","channel":"Plugin Alliance","chunks":3},"ydWsQKraPH8":{"title":"How to Make Your Music Louder Using a Clipper Plugin | Plugin Alliance","channel":"Plugin Alliance","chunks":4},"85-GmZ9YF7k":{"title":"How Loud to Master Music in 2023: Mastering Masterclass | Plugin Alliance","channel":"Plugin Alliance","chunks":13},"4LYNwje9QBE":{"title":"Mix an Entire Song with Just One Compressor: Here’s How | Plugin Alliance","channel":"Plugin Alliance","chunks":6},"IKZMd050zMU":{"title":"EQing Hip Hop with the Kirchhoff-EQ | Plugin Alliance","channel":"Plugin Alliance","chunks":5},"KY_vkQtpbQk":{"title":"Mixed with MEGA - Paul Womack - Rap Beats and Vocals | Plugin Alliance","channel":"Plugin Alliance","chunks":16},"nhKS1y1albs":{"title":"How to Mix a Song with Adam Moseley: Start to Finish | Plugin Alliance","channel":"Plugin Alliance","chunks":18},"PmooDUSlPoA":{"title":"Craig Bauer Shares Mastering Compression Tips | Plugin Alliance","channel":"Plugin Alliance","chunks":5},"CrZRBUFW3tE":{"title":"Top 5 Mixing Tips from The Pros | Plugin Alliance","channel":"Plugin Alliance","chunks":2},"VntJv7x7YjI":{"title":"10 steps to mix a song (start to finish) | iZotope","channel":"iZotope","chunks":21},"scnEaDXiX8w":{"title":"What is sibilance and how to fix it | iZotope","channel":"iZotope","chunks":3},"SG7NFwWP9o4":{"title":"8 ways to mix faster & better | iZotope","channel":"iZotope","chunks":4},"L5_59o7Kl7Q":{"title":"Which is better? Mono or stereo bass | iZotope","channel":"iZotope","chunks":5},"Qu6UNk496QE":{"title":"5 ways to take your mix from amateur to professional | iZotope","channel":"iZotope","chunks":8},"2JJ0H5O6tl4":{"title":"Why phase matters – and how to fix phase alignment issues | iZotope","channel":"iZotope","chunks":2},"_RqSRicd4po":{"title":"Top 5 ways to use saturation in a mix | iZotope","channel":"iZotope","chunks":3},"U_3fd2FTsHQ":{"title":"How to compress vocals (and why), part 1 | iZotope","channel":"iZotope","chunks":7},"ObxMcs-wYKw":{"title":"How to compress drums (and why), part 2 | iZotope","channel":"iZotope","chunks":8},"dumwqvSKRQ4":{"title":"How to compress guitar and bass (and why), part 3 | iZotope","channel":"iZotope","chunks":8},"hrlx9Gre-jo":{"title":"How to compress synths and keys (and why), part 4 | iZotope","channel":"iZotope","chunks":5},"qu4TzqSM7z4":{"title":"How to order your effects chain | iZotope","channel":"iZotope","chunks":4},"5bm1E5K1qXU":{"title":"10 mixing tips every producer should know | iZotope","channel":"iZotope","chunks":5},"nT4CS8VwobQ":{"title":"How to mix drums for clarity and impact","channel":"iZotope","chunks":4},"ROxtY-RebiY":{"title":"How to mix kick and bass: fundamentals for a cohesive sound","channel":"iZotope","chunks":5},"Z2Zzl-LG7dk":{"title":"How to EQ vocals for presence, balance, and intelligibility","channel":"iZotope","chunks":6},"lS-C-k9qAW8":{"title":"Bass EQ tips: how to tighten up your low end","channel":"iZotope","chunks":6},"ts_q5QlJyH0":{"title":"7 essential EQ secrets from the pros","channel":"iZotope","chunks":7},"mwtm-ben-baptie-michael-kiwanuka-beautiful-life-p01":{"title":"Beautiful Life — Part 1: Equipment Room Design Monitoring Signal Flow Rough Mix Routine Vocal Chain Effects Grit Emotion","channel":"Mix With The Masters","chunks":6},"mwtm-ben-baptie-michael-kiwanuka-beautiful-life-p02":{"title":"Beautiful Life — Part 2: Stereo Field Contrast Panning Strings Drums Bass Relationship EQ Compression Analog Mix Treatment","channel":"Mix With The Masters","chunks":4},"mwtm-ben-baptie-michael-kiwanuka-beautiful-life-p03":{"title":"Beautiful Life — Part 3: ITB Mix Chain High End Saturation Width Automation Gain Staging Limiters Finding The Sweet Spot","channel":"Mix With The Masters","chunks":5},"mwtm-andrew-scheps-go-to-eq-plugins-p01":{"title":"Go-to EQ Plugins — Part 1: Go To EQ Plugins","channel":"Mix With The Masters","chunks":3},"mwtm-andy-wallace-using-the-dynamics-on-a-ssl-console-p01":{"title":"Using the Dynamics on a SSL Console — Part 1: Using The Dynamics On A SSL Console","channel":"Mix With The Masters","chunks":2},"mwtm-bainz-young-thug-yea-yea-yea-p01":{"title":"Yea Yea Yea — Part 1: Hardware Overview Analog Mix Bus 808 Drums Samples","channel":"Mix With The Masters","chunks":3},"mwtm-bainz-young-thug-yea-yea-yea-p02":{"title":"Yea Yea Yea — Part 2: Samples Lead Vocals","channel":"Mix With The Masters","chunks":5},"mwtm-bainz-young-thug-yea-yea-yea-p03":{"title":"Yea Yea Yea — Part 3: Lead Vocals Ad Libs Effects Throws Mix Comparison","channel":"Mix With The Masters","chunks":3},"mwtm-bainz-young-thug-yea-yea-yea-p04":{"title":"Yea Yea Yea — Part 4: Plugin Analysis Mixing Practice Workflow","channel":"Mix With The Masters","chunks":3},"mwtm-bainz-young-thug-yea-yea-yea-p05":{"title":"Yea Yea Yea — Part 5: Mix Bus Limiting Loudness Effects Sends Session Management Hybrid Workflow","channel":"Mix With The Masters","chunks":4},"mwtm-bainz-young-thug-yea-yea-yea-p06":{"title":"Yea Yea Yea — Part 6: Printing Stems Atmos Preparation Professional Practice","channel":"Mix With The Masters","chunks":5},"mwtm-david-wrench-arlo-parks-too-good-p01":{"title":"Too Good — Part 1: New Studio Design Speaker Setup ITB vs Analog Project Background Drums Percussion Bass","channel":"Mix With The Masters","chunks":6},"mwtm-david-wrench-sophie-ellis-bextor-freedom-of-the-night-p01":{"title":"Freedom Of The Night — Part 1: Introduction Production Constraints Percussion Songwriting Mixing EQing Editing","channel":"Mix With The Masters","chunks":3},"mwtm-david-wrench-sophie-ellis-bextor-freedom-of-the-night-p02":{"title":"Freedom Of The Night — Part 2: Drums Sidechain Compression Equalization Time Based Effects Multiband Compression Panning","channel":"Mix With The Masters","chunks":3},"mwtm-gavin-lurssen-reuben-cohen-pharrell-williams-caparezza-mastering-workshop-p01":{"title":"Happy, Ti Fa Stare Bene — Part 1: Console Equipment Overview Typical Signal Path Gear Characteristics Purposes","channel":"Mix With The Masters","chunks":6},"mwtm-gavin-lurssen-reuben-cohen-pharrell-williams-caparezza-mastering-workshop-p02":{"title":"Happy, Ti Fa Stare Bene — Part 2: Passive Console Gear Modification Reference Tracks Monitoring Frequency Crossover","channel":"Mix With The Masters","chunks":6},"mwtm-gavin-lurssen-reuben-cohen-pharrell-williams-caparezza-mastering-workshop-p03":{"title":"Happy, Ti Fa Stare Bene — Part 3: Cohen Comparison Between Happy Mix And Master Commentary EQ Level Rides","channel":"Mix With The Masters","chunks":4},"mwtm-greg-wells-onerepublic-apologize-p01":{"title":"Apologize — Part 1: The Unusual Story Behind The Record Band Label Issues Timbaland Remix Release Schedule","channel":"Mix With The Masters","chunks":7},"mwtm-greg-wells-onerepublic-apologize-p02":{"title":"Apologize — Part 2: Piano And Vocals Microphone Setups Outboard Compression Signal Chains","channel":"Mix With The Masters","chunks":4},"mwtm-greg-wells-onerepublic-apologize-p03":{"title":"Apologize — Part 3: Drums And Percussion Kick Loop Treatment Other Drum Tracks Blending Samples Effects","channel":"Mix With The Masters","chunks":3},"mwtm-greg-wells-onerepublic-apologize-p04":{"title":"Apologize — Part 4: Strings BVs Electric Guitar Bass Recording An Octet Adding MIDI Processing BV Tips","channel":"Mix With The Masters","chunks":3},"mwtm-jaycen-joshua-dave-pensado-advanced-mix-techniques-p01":{"title":"Advanced Mix Techniques — Part 1: Mix Analyses Dry Energy Cleanliness Transients vs Loudness Front To Back Panning Fletcher Munson Curve","channel":"Mix With The Masters","chunks":7},"mwtm-jaycen-joshua-dave-pensado-advanced-mix-techniques-p02":{"title":"Advanced Mix Techniques — Part 2: Gain Structure Low End Reference Frequency Masking Pre Delay Stereo Spreading Summing Multiband","channel":"Mix With The Masters","chunks":8},"mwtm-jaycen-joshua-dave-pensado-advanced-mix-techniques-p03":{"title":"Advanced Mix Techniques — Part 3: Low End Consistency Side Chaining Dynamic EQ Transformer Tracks White Noise Odd Even Harmonics","channel":"Mix With The Masters","chunks":10},"mwtm-jaycen-joshua-dave-pensado-advanced-mix-techniques-p04":{"title":"Advanced Mix Techniques — Part 4: Vocal Effects Section Based Treatment Spreading A Mono Signal Adding Variation To Loops Band Saturation","channel":"Mix With The Masters","chunks":7},"mwtm-jaycen-joshua-dave-pensado-advanced-mix-techniques-p05":{"title":"Advanced Mix Techniques — Part 5: Conserving Voltage Filtering Kick Drum Sustain Loudness Before Mix Buss Tracking Signal Chain Vocal Space","channel":"Mix With The Masters","chunks":9},"mwtm-jaycen-joshua-dave-pensado-advanced-mix-techniques-p06":{"title":"Advanced Mix Techniques — Part 6: EQ Types Taming Harshness Phase Cancellation Automating Parallel Compression Tape Emulation Mix","channel":"Mix With The Masters","chunks":9},"mwtm-jaycen-joshua-dave-pensado-advanced-mix-techniques-p07":{"title":"Advanced Mix Techniques — Part 7: Headroom For Mastering Checking For Distortion RMS Level Vocal Chains Effects Artefacts Adding Air","channel":"Mix With The Masters","chunks":7},"mwtm-jaycen-joshua-lady-london-d-r-u-n-k-p01":{"title":"D-R-U-N-K — Part 1: Gear Preferences Plugins Monitoring Session Overview Drums Kick Snare","channel":"Mix With The Masters","chunks":2},"mwtm-jaycen-joshua-lady-london-d-r-u-n-k-p02":{"title":"D-R-U-N-K — Part 2: Rhythm Section Transients Saturation Kick Snare Bass","channel":"Mix With The Masters","chunks":2},"mwtm-jaycen-joshua-lady-london-d-r-u-n-k-p03":{"title":"D-R-U-N-K — Part 3: Bass Hi Hats Stereo Imaging Gain Staging Early Reflections","channel":"Mix With The Masters","chunks":2},"mwtm-jaycen-joshua-lady-london-d-r-u-n-k-p04":{"title":"D-R-U-N-K — Part 4: Hi Hats Guitar Early Reflections Saturation Warmth","channel":"Mix With The Masters","chunks":2},"mwtm-jaycen-joshua-lady-london-d-r-u-n-k-p05":{"title":"D-R-U-N-K — Part 5: Lead Vocal Compression Equalization Reverb","channel":"Mix With The Masters","chunks":2},"mwtm-jaycen-joshua-lady-london-d-r-u-n-k-p06":{"title":"D-R-U-N-K — Part 6: Rap Vocal Compression Resonance Control Equalization","channel":"Mix With The Masters","chunks":2},"mwtm-jaycen-joshua-lady-london-d-r-u-n-k-p07":{"title":"D-R-U-N-K — Part 7: Vocals Instrumental Mix Balance Background Vocals Adlibs Problem Solving","channel":"Mix With The Masters","chunks":3},"mwtm-jaycen-joshua-lady-london-d-r-u-n-k-p08":{"title":"D-R-U-N-K — Part 8: Vocal Adlibs Skits Automation Stereo Imaging Reverb","channel":"Mix With The Masters","chunks":3},"mwtm-jaycen-joshua-lady-london-d-r-u-n-k-p09":{"title":"D-R-U-N-K — Part 9: Finishing The Mix Bus Processing Mid Side Masking Client Relationships","channel":"Mix With The Masters","chunks":5},"mwtm-john-greenham-billie-eilish-k-flay-donna-missal-mastering-workshop-p01":{"title":"Mastering Workshop — Part 1: Professional Background Equipment Monitoring Loudness Converters Metering Dynamics","channel":"Mix With The Masters","chunks":6},"mwtm-john-greenham-billie-eilish-k-flay-donna-missal-mastering-workshop-p02":{"title":"Mastering Workshop — Part 2: Mastering Bad Guy Everything I Wanted By Billie Eilish","channel":"Mix With The Masters","chunks":2},"mwtm-john-greenham-billie-eilish-k-flay-donna-missal-mastering-workshop-p03":{"title":"Mastering Workshop — Part 3: Mastering Dating My Dad By K Flay Sex Is Good But Have You Tried By Donna Missal","channel":"Mix With The Masters","chunks":2},"mwtm-josh-gudwin-justin-bieber-love-yourself-p01":{"title":"Love Yourself — Part 1: Track Background Noise Reduction Tuning Inserts Effects Guitar Lead Vocal BVs Ad Libs Trumpet","channel":"Mix With The Masters","chunks":6},"mwtm-josh-gudwin-justin-bieber-love-yourself-p02":{"title":"Love Yourself — Part 2: Recording Justins Vocals Reverb Delay Doubling Chorus Mix Buss Treatment Song Quality","channel":"Mix With The Masters","chunks":5},"mwtm-josh-gudwin-silk-city-ft-dua-lipa-electricity-p01":{"title":"Electricity — Part 1: Monitoring Environment Equipment Plug Ins Analog Summing","channel":"Mix With The Masters","chunks":7},"mwtm-josh-gudwin-silk-city-ft-dua-lipa-electricity-p02":{"title":"Electricity — Part 2: VCA Faders Auxiliary Tracks Pre Post Fader Mix Buss","channel":"Mix With The Masters","chunks":3},"mwtm-josh-gudwin-silk-city-ft-dua-lipa-electricity-p03":{"title":"Electricity — Part 3: Vocal Track Separation Signal Chains Parameter Settings Drum Processing","channel":"Mix With The Masters","chunks":7},"mwtm-kevin-davis-sam-smith-normani-dancing-with-a-stranger-p01":{"title":"Dancing with a Stranger — Part 1: Professional Background Workflow Evolution Setup Summing Vocal Processing Stem Creation","channel":"Mix With The Masters","chunks":6},"mwtm-kevin-davis-sam-smith-normani-dancing-with-a-stranger-p02":{"title":"Dancing with a Stranger — Part 2: Rough Mix Consideration Keyboards Rhythm Vocal Section Relationship Hooks Master Chain","channel":"Mix With The Masters","chunks":5},"mwtm-kevin-davis-sam-smith-normani-dancing-with-a-stranger-p03":{"title":"Dancing with a Stranger — Part 3: Dynamic Range Based On Genre Reference Tracks Limiting Drums Percussion Treatment Mastering","channel":"Mix With The Masters","chunks":2},"mwtm-kevin-davis-sam-smith-normani-dancing-with-a-stranger-p04":{"title":"Dancing with a Stranger — Part 4: Music Buss Vocal Effects Working With Stargate Approvals Maintaining Perspective Monitoring","channel":"Mix With The Masters","chunks":4},"mwtm-leslie-brathwaite-cardi-b-megan-thee-stallion-bongos-p01":{"title":"Bongos — Part 1: Mixing Philosophy Critical Listening Lead Vocals Cardi B","channel":"Mix With The Masters","chunks":4},"mwtm-leslie-brathwaite-cardi-b-megan-thee-stallion-bongos-p02":{"title":"Bongos — Part 2: Vocals Resonance Control Processing Workflow Megan Thee Stallion","channel":"Mix With The Masters","chunks":5},"mwtm-leslie-brathwaite-cardi-b-megan-thee-stallion-bongos-p03":{"title":"Bongos — Part 3: 808 Bass Kick Snare Percussion Transitions Vocal Chops Automation Rides Drops","channel":"Mix With The Masters","chunks":4},"mwtm-leslie-brathwaite-cardi-b-megan-thee-stallion-bongos-p04":{"title":"Bongos — Part 4: Managing Relationships Major Label Artists Mix Bus Processing Attention To Detail","channel":"Mix With The Masters","chunks":4},"mwtm-leslie-brathwaite-cardi-b-money-p01":{"title":"Money — Part 1: Rough Mix Analysis Producer Engineer Rapport Template Starting Points","channel":"Mix With The Masters","chunks":6},"mwtm-leslie-brathwaite-cardi-b-money-p02":{"title":"Money — Part 2: Vocals 808 Samples Plug In Choices Rough Mix Elements","channel":"Mix With The Masters","chunks":5},"mwtm-leslie-brathwaite-cardi-b-money-p03":{"title":"Money — Part 3: Vocal Effects Hook Clean Version Edits","channel":"Mix With The Masters","chunks":4},"mwtm-leslie-brathwaite-cardi-b-money-p04":{"title":"Money — Part 4: Revision Request Hi Hats Piano Money Vocal Sample","channel":"Mix With The Masters","chunks":3},"mwtm-leslie-brathwaite-cardi-b-money-p05":{"title":"Money — Part 5: Gain Staging Mix Buss Mastering Monitoring Streaming Platforms","channel":"Mix With The Masters","chunks":5},"mwtm-leslie-brathwaite-iv-jay-care-p01":{"title":"Care — Part 1: Dialogue With Artist Label Early Mix Approach Vocal Focus Subtractive EQ Signal Chain","channel":"Mix With The Masters","chunks":8},"mwtm-leslie-brathwaite-iv-jay-care-p02":{"title":"Care — Part 2: Pitch Correction Effects Compression Creating Space Mix Buss Loudness For Clients","channel":"Mix With The Masters","chunks":6},"mwtm-leslie-brathwaite-iv-jay-care-p03":{"title":"Care — Part 3: Instrument Focus 808 Kick Snare Hats Synth Bass Enhancement Stereo Manipulation","channel":"Mix With The Masters","chunks":8},"mwtm-leslie-brathwaite-iv-jay-care-p04":{"title":"Care — Part 4: Bussing System Filter Automation Gain Staging Mix Headroom Basic Principles","channel":"Mix With The Masters","chunks":5},"mwtm-leslie-brathwaite-iv-jay-care-p05":{"title":"Care — Part 5: Vocal Music Blend Level Automation Client Requests Final Tweaks Printing The Mix","channel":"Mix With The Masters","chunks":5},"mwtm-leslie-brathwaite-pharrell-williams-happy-p01":{"title":"Happy — Part 1: Professional Background Working With Pharrell Business Reference Tracks Rough Mix","channel":"Mix With The Masters","chunks":8},"mwtm-leslie-brathwaite-pharrell-williams-happy-p02":{"title":"Happy — Part 2: Session Layout Colour Coding Track Groups Rough Mix Analysis Backing Vocals","channel":"Mix With The Masters","chunks":5},"mwtm-leslie-brathwaite-pharrell-williams-happy-p03":{"title":"Happy — Part 3: Vocal Focus Individual Auxiliary Signal Chains Automation Doubling Phase","channel":"Mix With The Masters","chunks":8},"mwtm-leslie-brathwaite-pharrell-williams-happy-p04":{"title":"Happy — Part 4: Kick Snare Bass Claps Bongos Keys Low End Individual Sub Mix","channel":"Mix With The Masters","chunks":4},"mwtm-leslie-brathwaite-pharrell-williams-happy-p05":{"title":"Happy — Part 5: Signal Routing EQ Filtering Mix Buss Processing Automation Consumer Listening","channel":"Mix With The Masters","chunks":7},"mwtm-mike-bozzi-kendrick-lamar-sza-mastering-workshop-p01":{"title":"Humble, Love Galore, The Weekend — Part 1: Mikes Background Modern Workflow And Aesthetics Mix Buss Advice Sample Rate Bit Depth Signal Path","channel":"Mix With The Masters","chunks":7},"mwtm-mike-bozzi-kendrick-lamar-sza-mastering-workshop-p02":{"title":"Humble, Love Galore, The Weekend — Part 2: Mastering Humble Subtle EQ Vocal Focus Monitoring Considerations Listening Space","channel":"Mix With The Masters","chunks":3},"mwtm-mike-bozzi-kendrick-lamar-sza-mastering-workshop-p03":{"title":"Humble, Love Galore, The Weekend — Part 3: Mastering Love Galore De Essing Adding Warmth And Air Taming High Mids Commentary On Widening","channel":"Mix With The Masters","chunks":3},"mwtm-mike-bozzi-kendrick-lamar-sza-mastering-workshop-p04":{"title":"Humble, Love Galore, The Weekend — Part 4: Mastering The Weekend Adding Clarity Soft Saturation Light Limiting Dithering Streaming Algorithms","channel":"Mix With The Masters","chunks":3},"mwtm-neal-pogue-kaytranada-ft-kali-uchis-10-percent-p01":{"title":"10% — Part 1: Mix Translation OTB vs ITB Monitoring Session Management Groove Drums Bass Synths","channel":"Mix With The Masters","chunks":6},"mwtm-neal-pogue-kaytranada-ft-kali-uchis-10-percent-p02":{"title":"10% — Part 2: Vocals Printed Effects Stems Mix Buss Treatment Recalls Summing Templates Mastering","channel":"Mix With The Masters","chunks":5},"mwtm-russell-elevado-d-angelo-till-its-done-p01":{"title":"Till It's Done — Part 1: Console Analog Preference SSL Models","channel":"Mix With The Masters","chunks":6},"mwtm-russell-elevado-d-angelo-till-its-done-p02":{"title":"Till It's Done — Part 2: Effects Philosophy Revisions Work Speed","channel":"Mix With The Masters","chunks":6},"mwtm-russell-elevado-d-angelo-till-its-done-p03":{"title":"Till It's Done — Part 3: Bass Treatment Compressor Tone Vocal","channel":"Mix With The Masters","chunks":3},"mwtm-russell-elevado-d-angelo-till-its-done-p04":{"title":"Till It's Done — Part 4: Tape Echos Drums Re Amp Printed Effects","channel":"Mix With The Masters","chunks":4},"mwtm-russell-elevado-d-angelo-till-its-done-p05":{"title":"Till It's Done — Part 5: Automation Stage Fader Status Snapshot Rides","channel":"Mix With The Masters","chunks":2},"mwtm-stuart-white-beyonce-break-my-soul-the-queens-remix-p01":{"title":"BREAK MY SOUL - THE QUEENS REMIX — Part 1: Instrumental Drums Low End","channel":"Mix With The Masters","chunks":3},"mwtm-stuart-white-beyonce-break-my-soul-the-queens-remix-p02":{"title":"BREAK MY SOUL - THE QUEENS REMIX — Part 2: Samples Vocals Ear Candy","channel":"Mix With The Masters","chunks":3},"mwtm-stuart-white-beyonce-break-my-soul-the-queens-remix-p03":{"title":"BREAK MY SOUL - THE QUEENS REMIX — Part 3: Sound Design FX Chains Backing Vocals","channel":"Mix With The Masters","chunks":4},"mwtm-stuart-white-beyonce-break-my-soul-the-queens-remix-p04":{"title":"BREAK MY SOUL - THE QUEENS REMIX — Part 4: Special Effects Reverbs Filter Sweeps","channel":"Mix With The Masters","chunks":3},"mwtm-stuart-white-beyonce-break-my-soul-the-queens-remix-p05":{"title":"BREAK MY SOUL - THE QUEENS REMIX — Part 5: Automation Adlibs Vocal Tracking","channel":"Mix With The Masters","chunks":2},"mwtm-stuart-white-beyonce-break-my-soul-the-queens-remix-p06":{"title":"BREAK MY SOUL - THE QUEENS REMIX — Part 6: Vocal Tracking Mix Bus Processing Limiting Mastering","channel":"Mix With The Masters","chunks":4},"mwtm-stuart-white-beyonce-yonce-p01":{"title":"Yoncé — Part 1: Template Overview Effects Sends Gain Staging Drums And Percussion","channel":"Mix With The Masters","chunks":4},"mwtm-stuart-white-beyonce-yonce-p02":{"title":"Yoncé — Part 2: Low End Processing Percussion Strings Synths Backing Vocals Publishing Splits","channel":"Mix With The Masters","chunks":3},"mwtm-stuart-white-beyonce-yonce-p03":{"title":"Yoncé — Part 3: Vocal Tracking De Essing EQ Compression Reverb Delays Routing Sound Design","channel":"Mix With The Masters","chunks":4},"mwtm-stuart-white-beyonce-yonce-p04":{"title":"Yoncé — Part 4: Mix Bus Tracking vs Mixing Headroom Production Workflow Summing","channel":"Mix With The Masters","chunks":4},"mwtm-tchad-blake-arctic-monkeys-r-u-mine-p01":{"title":"R U Mine? — Part 1: Kick Drum Processing Kit Distortion Polarity Phase EQ","channel":"Mix With The Masters","chunks":3},"mwtm-tchad-blake-arctic-monkeys-r-u-mine-p02":{"title":"R U Mine? — Part 2: Kit Modulation Snare Guitars Bass Phase Shelving","channel":"Mix With The Masters","chunks":1},"mwtm-teezio-tee-grizzley-j-cole-blow-for-blow-p01":{"title":"Blow for Blow — Part 1: Mix Template Breakdown Drums","channel":"Mix With The Masters","chunks":4},"mwtm-teezio-tee-grizzley-j-cole-blow-for-blow-p02":{"title":"Blow for Blow — Part 2: Synths Samples","channel":"Mix With The Masters","chunks":2},"mwtm-teezio-tee-grizzley-j-cole-blow-for-blow-p03":{"title":"Blow for Blow — Part 3: J Cole Vocals EQ De Essing Feedback","channel":"Mix With The Masters","chunks":4},"mwtm-teezio-tee-grizzley-j-cole-blow-for-blow-p04":{"title":"Blow for Blow — Part 4: Tee Grizzley Vocals","channel":"Mix With The Masters","chunks":6},"mwtm-teezio-tee-grizzley-j-cole-blow-for-blow-p05":{"title":"Blow for Blow — Part 5: Mix Bus Processing","channel":"Mix With The Masters","chunks":2},"mwtm-teezio-tee-grizzley-j-cole-blow-for-blow-p06":{"title":"Blow for Blow — Part 6: Community Mindset Business Affairs","channel":"Mix With The Masters","chunks":4},"mwtm-tom-elmhirst-adele-rolling-in-the-deep-p01":{"title":"Rolling in the Deep — Part 1: Neve VR Setup Sends Busses Signal Chains Rough Mix Vocal Automation","channel":"Mix With The Masters","chunks":4},"mwtm-tom-elmhirst-adele-rolling-in-the-deep-p02":{"title":"Rolling in the Deep — Part 2: Mix Recap Master Bus EQ VCA Gain Staging","channel":"Mix With The Masters","chunks":2},"mwtm-tom-elmhirst-adele-rolling-in-the-deep-p03":{"title":"Rolling in the Deep — Part 3: Drum Samples Percussion Parallel Compression Vocal Effects","channel":"Mix With The Masters","chunks":4},"mwtm-tom-elmhirst-vocal-production-workshop-p01":{"title":"Vocal Production Workshop — Part 1: Introduction Drag Drop Workflow Building FX Chains Elisa","channel":"Mix With The Masters","chunks":2},"mwtm-tom-elmhirst-vocal-production-workshop-p02":{"title":"Vocal Production Workshop — Part 2: Elisa Blending Effects Arrangement Automation Instrumental Effects","channel":"Mix With The Masters","chunks":1},"mwtm-tom-elmhirst-vocal-production-workshop-p03":{"title":"Vocal Production Workshop — Part 3: Norah Jones Natural Ambience Warmth Stereo Width Modulation Instrumental Effects","channel":"Mix With The Masters","chunks":2},"mwtm-tom-elmhirst-vocal-production-workshop-p04":{"title":"Vocal Production Workshop — Part 4: Travis Scott Digital Effects Pitch Shifting Distortion Glitches","channel":"Mix With The Masters","chunks":2},"mwtm-tom-elmhirst-vocal-production-workshop-p05":{"title":"Vocal Production Workshop — Part 5: David Bowie Analog Delay Saturation Filtering Automation Instrumental Effects","channel":"Mix With The Masters","chunks":2},"mwtm-tom-elmhirst-vocal-production-workshop-p06":{"title":"Vocal Production Workshop — Part 6: David Bowie Scene Changes Arrangement Experimentation","channel":"Mix With The Masters","chunks":2},"mwtm-tom-elmhirst-vocal-production-workshop-p07":{"title":"Vocal Production Workshop — Part 7: Melody Gardot Building FX Chains Inspiration Unique Sounds","channel":"Mix With The Masters","chunks":2},"mwtm-tom-elmhirst-vocal-production-workshop-p08":{"title":"Vocal Production Workshop — Part 8: Melody Gardot Time Stretching Audio Suite Effects Automation Dropouts","channel":"Mix With The Masters","chunks":1},"mwtm-tom-elmhirst-vocal-production-workshop-p09":{"title":"Vocal Production Workshop — Part 9: Melody Gardot Additional Production Final Tweaks Aesthetics","channel":"Mix With The Masters","chunks":2},"mwtm-tony-maserati-james-blunt-paradise-p01":{"title":"Paradise — Part 1: Communication With James Team Rough Mix Notes Hybrid Template Gear Operating Level","channel":"Mix With The Masters","chunks":5},"mwtm-tony-maserati-james-blunt-paradise-p02":{"title":"Paradise — Part 2: Instrumental Mix Fader Levels Metering Trim Group Low End Organ Bass Drums","channel":"Mix With The Masters","chunks":4},"mwtm-tony-maserati-james-blunt-paradise-p03":{"title":"Paradise — Part 3: Main Drums Room Sound Subtractive EQ Compression Phase Kick Blending Headroom","channel":"Mix With The Masters","chunks":3},"mwtm-tony-maserati-james-blunt-paradise-p04":{"title":"Paradise — Part 4: Organ Low End Parallel Processing Large Monitors Guitar Effects Programmed Drums","channel":"Mix With The Masters","chunks":3},"mwtm-tony-maserati-james-blunt-paradise-p05":{"title":"Paradise — Part 5: Phase Relationships Transient Design Flaming Timing Reverb Limiter Analog Mix Chain","channel":"Mix With The Masters","chunks":5},"mwtm-tony-maserati-james-blunt-paradise-p06":{"title":"Paradise — Part 6: Vocal Tuning De Ess Compression EQ Verse Chorus Tone Balance Gain Structure Ideas","channel":"Mix With The Masters","chunks":4},"mwtm-tony-maserati-james-blunt-paradise-p07":{"title":"Paradise — Part 7: Rough Mix Comparison Drum Piano Issues Interference With Lead Vocal Level Automation","channel":"Mix With The Masters","chunks":1},"mwtm-tony-maserati-james-blunt-paradise-p08":{"title":"Paradise — Part 8: Synth Filtering Low End Focus Softening Drum Clicks Detailed Automation Tweaks","channel":"Mix With The Masters","chunks":3},"mwtm-tony-maserati-james-blunt-paradise-p09":{"title":"Paradise — Part 9: Section Links Guitar Compression Effects Cymbals Problematic Edits Making Room For Vocals","channel":"Mix With The Masters","chunks":3},"mwtm-tony-maserati-james-blunt-paradise-p10":{"title":"Paradise — Part 10: BV Thickening Doubler Reverb Compression Lead Vocal Multi Band Mix Limiting","channel":"Mix With The Masters","chunks":3},"mwtm-tony-maserati-james-blunt-paradise-p11":{"title":"Paradise — Part 11: Guitar Echo Stereo Spread Parallel Vocal Chain Drum Issues Gain Structure ITB vs Hybrid Mix","channel":"Mix With The Masters","chunks":5},"mwtm-tony-maserati-raye-where-is-my-husband-p01":{"title":"WHERE IS MY HUSBAND! — Part 1: Project Overview Background Process","channel":"Mix With The Masters","chunks":2},"mwtm-tony-maserati-raye-where-is-my-husband-p02":{"title":"WHERE IS MY HUSBAND! — Part 2: Horns Samples Automation Drums Bass Parallel Compression","channel":"Mix With The Masters","chunks":3},"mwtm-tony-maserati-raye-where-is-my-husband-p03":{"title":"WHERE IS MY HUSBAND! — Part 3: Drums Bass Equalization Compression Editing Vocal Automation","channel":"Mix With The Masters","chunks":1},"mwtm-tony-maserati-raye-where-is-my-husband-p04":{"title":"WHERE IS MY HUSBAND! — Part 4: Keys Compression Automation Timeline Strings Mix Bus Hardware Printing Hybrid Mixing","channel":"Mix With The Masters","chunks":2},"mwtm-tony-maserati-raye-where-is-my-husband-p05":{"title":"WHERE IS MY HUSBAND! — Part 5: Vocals Automation Harmonies Headroom","channel":"Mix With The Masters","chunks":3},"mwtm-tony-maserati-raye-where-is-my-husband-p06":{"title":"WHERE IS MY HUSBAND! — Part 6: Vocals Effects Panning Reverbs","channel":"Mix With The Masters","chunks":2},"mwtm-tony-maserati-raye-where-is-my-husband-p07":{"title":"WHERE IS MY HUSBAND! — Part 7: Subgroups Mix Bus Gain Staging Analog Summing Hybrid Mixing Limiting","channel":"Mix With The Masters","chunks":3},"mwtm-tony-maserati-raye-where-is-my-husband-p08":{"title":"WHERE IS MY HUSBAND! — Part 8: Loudness Pre Mastering Panning Summing Clocking","channel":"Mix With The Masters","chunks":2},"mwtm-tony-maserati-raye-where-is-my-husband-p09":{"title":"WHERE IS MY HUSBAND! — Part 9: Professional Journey Career Mix Philosophy","channel":"Mix With The Masters","chunks":2},"mwtm-ben-baptie-moses-sumney-doomed-p01":{"title":"Doomed — Part 1: Vocals Synth Parallel Vocal Treatment EQing Multiband Compression Vocal Effects","channel":"Mix With The Masters","chunks":4},"mwtm-ben-baptie-moses-sumney-doomed-p02":{"title":"Doomed — Part 2: Vocals Printing To Tape Tape Emulation Committing To Tracks","channel":"Mix With The Masters","chunks":2},"mwtm-ben-baptie-moses-sumney-doomed-p03":{"title":"Doomed — Part 3: Reverb Outboard Gear","channel":"Mix With The Masters","chunks":3},"mwtm-ben-baptie-moses-sumney-doomed-p04":{"title":"Doomed — Part 4: Effects Ad Libs Bass Synth Background Vocals Automation","channel":"Mix With The Masters","chunks":2},"mwtm-ben-baptie-moses-sumney-doomed-p05":{"title":"Doomed — Part 5: Mix Bus Processing Tips For Long Sessions Mix Philosophy","channel":"Mix With The Masters","chunks":4},"mwtm-david-wrench-arlo-parks-too-good-p02":{"title":"Too Good — Part 2: Guitars Rhodes Piano Hammond Organ Mellotron Arrangement Stereo Image Effects Dynamics","channel":"Mix With The Masters","chunks":4},"mwtm-david-wrench-arlo-parks-too-good-p03":{"title":"Too Good — Part 3: Vocal Tracking Mic Technique Signal Chain Presence EQ Compression De Essing Level Automation Reverb","channel":"Mix With The Masters","chunks":4},"mwtm-david-wrench-arlo-parks-too-good-p04":{"title":"Too Good — Part 4: Master Chain Attack Release Saturation Mix Versions Multi Band Limiting Translation LUFS Mastering","channel":"Mix With The Masters","chunks":4},"mwtm-david-wrench-arlo-parks-too-good-p05":{"title":"Too Good — Part 5: Cohesion Rough Mix Reference Disagreements Artist Relations Dismissing Ego Knowing When To Finish","channel":"Mix With The Masters","chunks":5},"mwtm-david-wrench-sophie-ellis-bextor-freedom-of-the-night-p03":{"title":"Freedom Of The Night — Part 3: Bass Comping Compression Guitar Synth Electric Piano Automation","channel":"Mix With The Masters","chunks":3},"mwtm-david-wrench-sophie-ellis-bextor-freedom-of-the-night-p04":{"title":"Freedom Of The Night — Part 4: Vocals Automation Vocal Editing Compression De Essing Printing Tracks","channel":"Mix With The Masters","chunks":2},"mwtm-david-wrench-sophie-ellis-bextor-freedom-of-the-night-p05":{"title":"Freedom Of The Night — Part 5: Vocals Background Vocals Time Based Effects Modulation","channel":"Mix With The Masters","chunks":2},"mwtm-david-wrench-sophie-ellis-bextor-freedom-of-the-night-p06":{"title":"Freedom Of The Night — Part 6: Mix Bus Processing Equalization Compression Limiting Mastering","channel":"Mix With The Masters","chunks":2},"mwtm-gavin-lurssen-reuben-cohen-pharrell-williams-caparezza-mastering-workshop-p04":{"title":"Happy, Ti Fa Stare Bene — Part 4: Cohen Soft Bypass Full Chain Individual Insert Activation D A A D Gain Structure","channel":"Mix With The Masters","chunks":5},"mwtm-gavin-lurssen-reuben-cohen-pharrell-williams-caparezza-mastering-workshop-p05":{"title":"Happy, Ti Fa Stare Bene — Part 5: Lurssen Signal Chain For Ti Fa Stare Bene Solid State vs Tube Circuitry LMC Plug In","channel":"Mix With The Masters","chunks":6},"mwtm-gavin-lurssen-reuben-cohen-pharrell-williams-caparezza-mastering-workshop-p06":{"title":"Happy, Ti Fa Stare Bene — Part 6: Lurssen Mastering The Track With Real Time Level EQ Manoeuvres Commentary","channel":"Mix With The Masters","chunks":4},"mwtm-andrew-scheps-kaleo-way-down-we-go-p01":{"title":"Way Down We Go — Part 1: Studio Session Pre Mix Preparation","channel":"Mix With The Masters","chunks":3},"mwtm-andrew-scheps-kaleo-way-down-we-go-p02":{"title":"Way Down We Go — Part 2: Kick Drum Attack Definition","channel":"Mix With The Masters","chunks":3},"mwtm-andrew-scheps-kaleo-way-down-we-go-p03":{"title":"Way Down We Go — Part 3: Drums Distortion Thickening Technique","channel":"Mix With The Masters","chunks":3},"mwtm-andrew-scheps-kaleo-way-down-we-go-p04":{"title":"Way Down We Go — Part 4: Drum Kit Organization And Layering","channel":"Mix With The Masters","chunks":2},"mwtm-andrew-scheps-kaleo-way-down-we-go-p05":{"title":"Way Down We Go — Part 5: Layered Percussion And Subtle Details","channel":"Mix With The Masters","chunks":3},"mwtm-andrew-scheps-kaleo-way-down-we-go-p06":{"title":"Way Down We Go — Part 6: Drum Layering And Percussion Arrangement","channel":"Mix With The Masters","chunks":3},"mwtm-andrew-scheps-kaleo-way-down-we-go-p07":{"title":"Way Down We Go — Part 7: Bass Recording Microphone Techniques","channel":"Mix With The Masters","chunks":3},"mwtm-andrew-scheps-kaleo-way-down-we-go-p08":{"title":"Way Down We Go — Part 8: Main Guitar And Dobro Arrangement","channel":"Mix With The Masters","chunks":3},"mwtm-andrew-scheps-kaleo-way-down-we-go-p09":{"title":"Way Down We Go — Part 9: Lap Steel Track Balancing","channel":"Mix With The Masters","chunks":3},"mwtm-andrew-scheps-kaleo-way-down-we-go-p10":{"title":"Way Down We Go — Part 10: Piano Dynamics And Recording Quality","channel":"Mix With The Masters","chunks":3},"mwtm-andrew-scheps-kaleo-way-down-we-go-p11":{"title":"Way Down We Go — Part 11: Organ Texture In PreChorus","channel":"Mix With The Masters","chunks":2},"mwtm-andrew-scheps-kaleo-way-down-we-go-p12":{"title":"Way Down We Go — Part 12: Vocal Processing And Effects Chain","channel":"Mix With The Masters","chunks":3},"mwtm-andrew-scheps-kaleo-way-down-we-go-p13":{"title":"Way Down We Go — Part 13: Vocal Processing Plugin Chain","channel":"Mix With The Masters","chunks":5},"mwtm-andrew-scheps-kaleo-way-down-we-go-p14":{"title":"Way Down We Go — Part 14: Master Bus Level Control Compression","channel":"Mix With The Masters","chunks":4},"mwtm-anthony-kilhoffer-jay-z-kanye-west-in-paris-p01":{"title":"In Paris — Part 1: Jay Z Paris Mix Breakdown","channel":"Mix With The Masters","chunks":3},"mwtm-anthony-kilhoffer-jay-z-kanye-west-in-paris-p02":{"title":"In Paris — Part 2: Sample Chopping And Beat Production","channel":"Mix With The Masters","chunks":2},"mwtm-anthony-kilhoffer-jay-z-kanye-west-in-paris-p03":{"title":"In Paris — Part 3: Vocal Track Organization By Section","channel":"Mix With The Masters","chunks":2},"mwtm-anthony-kilhoffer-jay-z-kanye-west-in-paris-p04":{"title":"In Paris — Part 4: Vocal De Esser Processing","channel":"Mix With The Masters","chunks":2},"mwtm-anthony-kilhoffer-jay-z-kanye-west-in-paris-p05":{"title":"In Paris — Part 5: Ending Production Methods","channel":"Mix With The Masters","chunks":2},"mwtm-boi-1da-travis-scott-mafia-production-p01":{"title":"MAFIA — Part 1: Beat Production Breakdown Travis Scott","channel":"Mix With The Masters","chunks":4},"mwtm-boi-1da-travis-scott-mafia-production-p02":{"title":"MAFIA — Part 2: Collaborative Music Creation Process","channel":"Mix With The Masters","chunks":3},"mwtm-boi-1da-travis-scott-mafia-production-p03":{"title":"MAFIA — Part 3: Always Be Prepared With Music","channel":"Mix With The Masters","chunks":3},"mwtm-bainz-young-thug-money-on-money-p01":{"title":"Money On Money — Part 1: In The Box Mixing Techniques","channel":"Mix With The Masters","chunks":3},"mwtm-bainz-young-thug-money-on-money-p02":{"title":"Money On Money — Part 2: Drum Production 808 Setup","channel":"Mix With The Masters","chunks":2},"mwtm-bainz-young-thug-money-on-money-p03":{"title":"Money On Money — Part 3: Vocal Autotune And Effect Adjustments","channel":"Mix With The Masters","chunks":3},"mwtm-bainz-young-thug-money-on-money-p04":{"title":"Money On Money — Part 4: Production Arrangement Variations","channel":"Mix With The Masters","chunks":3},"mwtm-bainz-young-thug-money-on-money-p05":{"title":"Money On Money — Part 5: Rough Mix Playback Review","channel":"Mix With The Masters","chunks":3},"mwtm-bainz-young-thug-money-on-money-p06":{"title":"Money On Money — Part 6: Session Routing Organization Issues","channel":"Mix With The Masters","chunks":3},"mwtm-ben-baptie-little-simz-gorilla-p01":{"title":"Gorilla — Part 1: Mixing Little Sims Gorilla Track","channel":"Mix With The Masters","chunks":4},"mwtm-ben-baptie-little-simz-gorilla-p02":{"title":"Gorilla — Part 2: Vocal Recording Technique And Microphone Selection","channel":"Mix With The Masters","chunks":4},"mwtm-ben-baptie-little-simz-gorilla-p03":{"title":"Gorilla — Part 3: Stereo Mono Sample Dynamics","channel":"Mix With The Masters","chunks":3},"mwtm-ben-baptie-little-simz-gorilla-p04":{"title":"Gorilla — Part 4: Orchestral Room Microphone Setup","channel":"Mix With The Masters","chunks":2},"mwtm-ben-baptie-little-simz-gorilla-p05":{"title":"Gorilla — Part 5: Mixing Into A Limiter","channel":"Mix With The Masters","chunks":3},"mwtm-finneas-billie-eilish-birds-of-a-feather-production-p01":{"title":"Birds Of A Feather — Part 1: Drum Loop Production Techniques","channel":"Mix With The Masters","chunks":3},"mwtm-finneas-billie-eilish-birds-of-a-feather-production-p02":{"title":"Birds Of A Feather — Part 2: Vocal Harmony Stab Techniques","channel":"Mix With The Masters","chunks":2},"mwtm-finneas-billie-eilish-birds-of-a-feather-production-p03":{"title":"Birds Of A Feather — Part 3: Chorus Elements Introduction","channel":"Mix With The Masters","chunks":2},"mwtm-finneas-billie-eilish-birds-of-a-feather-production-p04":{"title":"Birds Of A Feather — Part 4: Verse 2 Arrangement Strategies","channel":"Mix With The Masters","chunks":2},"mwtm-finneas-billie-eilish-birds-of-a-feather-production-p05":{"title":"Birds Of A Feather — Part 5: Novel Songwriting Approaches Third Album","channel":"Mix With The Masters","chunks":3},"mwtm-finneas-billie-eilish-therefore-i-am-production-p01":{"title":"Therefore I Am — Part 1: Producer Introduction And Session Overview","channel":"Mix With The Masters","chunks":3},"mwtm-finneas-billie-eilish-therefore-i-am-production-p02":{"title":"Therefore I Am — Part 2: Vocal Hook Development Process","channel":"Mix With The Masters","chunks":5},"mwtm-finneas-billie-eilish-therefore-i-am-production-p03":{"title":"Therefore I Am — Part 3: Creative Collaboration Scheduling","channel":"Mix With The Masters","chunks":5},"mwtm-finneas-benny-blanco-selena-gomez-eastside-younger-and-hotter-than-me-production-p01":{"title":"Eastside / Younger And Hotter Than Me — Part 1: Producer Self Mixing Session Overview","channel":"Mix With The Masters","chunks":5},"mwtm-finneas-benny-blanco-selena-gomez-eastside-younger-and-hotter-than-me-production-p02":{"title":"Eastside / Younger And Hotter Than Me — Part 2: Intimate Verse To Chorus Progression","channel":"Mix With The Masters","chunks":2},"mwtm-finneas-benny-blanco-selena-gomez-eastside-younger-and-hotter-than-me-production-p03":{"title":"Eastside / Younger And Hotter Than Me — Part 3: Learning Production Through Trial And Error","channel":"Mix With The Masters","chunks":2},"mwtm-finneas-benny-blanco-selena-gomez-eastside-younger-and-hotter-than-me-production-p04":{"title":"Eastside / Younger And Hotter Than Me — Part 4: Song Finishing And Over Production","channel":"Mix With The Masters","chunks":3},"mwtm-finneas-benny-blanco-selena-gomez-eastside-younger-and-hotter-than-me-production-p05":{"title":"Eastside / Younger And Hotter Than Me — Part 5: Collaborative Album Creative Discovery","channel":"Mix With The Masters","chunks":3},"mwtm-finneas-benny-blanco-selena-gomez-eastside-younger-and-hotter-than-me-production-p06":{"title":"Eastside / Younger And Hotter Than Me — Part 6: Late Night Songwriting Breakthroughs","channel":"Mix With The Masters","chunks":5},"mwtm-finneas-benny-blanco-selena-gomez-eastside-younger-and-hotter-than-me-production-p07":{"title":"Eastside / Younger And Hotter Than Me — Part 7: Hidden Production Details And Layers","channel":"Mix With The Masters","chunks":3},"mwtm-finneas-benny-blanco-selena-gomez-eastside-younger-and-hotter-than-me-production-p08":{"title":"Eastside / Younger And Hotter Than Me — Part 8: Bridge Vocal Layering Techniques","channel":"Mix With The Masters","chunks":5},"mwtm-finneas-benny-blanco-selena-gomez-eastside-younger-and-hotter-than-me-production-p09":{"title":"Eastside / Younger And Hotter Than Me — Part 9: Selective Autotune Automation","channel":"Mix With The Masters","chunks":3},"mwtm-finneas-benny-blanco-selena-gomez-eastside-younger-and-hotter-than-me-production-p10":{"title":"Eastside / Younger And Hotter Than Me — Part 10: Vocal Tone And Interpretive Authenticity","channel":"Mix With The Masters","chunks":4},"mwtm-jaycen-joshua-critical-listening-workshop-2026-09-17-p01":{"title":"Critical Listening Workshop — Part 1: Critical Thinking In Mix Analysis","channel":"Mix With The Masters","chunks":3},"mwtm-jaycen-joshua-critical-listening-workshop-2026-09-17-p02":{"title":"Critical Listening Workshop — Part 2: Reference Disc Mix Standards","channel":"Mix With The Masters","chunks":3},"mwtm-jaycen-joshua-critical-listening-workshop-2026-09-17-p03":{"title":"Critical Listening Workshop — Part 3: Understanding Your Ear Preferences","channel":"Mix With The Masters","chunks":4},"mwtm-jaycen-joshua-critical-listening-workshop-2026-09-17-p04":{"title":"Critical Listening Workshop — Part 4: Loudness War Game Changer","channel":"Mix With The Masters","chunks":4},"mwtm-jaycen-joshua-critical-listening-workshop-2026-09-17-p05":{"title":"Critical Listening Workshop — Part 5: Bass Frequency Reference Selection","channel":"Mix With The Masters","chunks":3},"mwtm-jaycen-joshua-critical-listening-workshop-2026-09-17-p06":{"title":"Critical Listening Workshop — Part 6: Bass Drop Anticipation","channel":"Mix With The Masters","chunks":5},"mwtm-jaycen-joshua-critical-listening-workshop-2026-09-17-p07":{"title":"Critical Listening Workshop — Part 7: Song Lyrics Analysis","channel":"Mix With The Masters","chunks":3},"mwtm-jaycen-joshua-critical-listening-workshop-2026-09-17-p08":{"title":"Critical Listening Workshop — Part 8: Classic Rap Vocal Performance","channel":"Mix With The Masters","chunks":4},"mwtm-jaycen-joshua-critical-listening-workshop-2026-09-17-p09":{"title":"Critical Listening Workshop — Part 9: Hook Density Arrangement Progression","channel":"Mix With The Masters","chunks":3},"mwtm-jaycen-joshua-critical-listening-workshop-2026-09-17-p10":{"title":"Critical Listening Workshop — Part 10: Ear Reference And Professional Standards","channel":"Mix With The Masters","chunks":2},"mwtm-jaycen-joshua-critical-listening-workshop-2026-09-17-p11":{"title":"Critical Listening Workshop — Part 11: Low End Mixing And Fidelity","channel":"Mix With The Masters","chunks":3},"mwtm-jaycen-joshua-ed-sheeran-take-me-back-to-london-p01":{"title":"Take Me Back To London — Part 1: Building Client Relationships Through Mixing","channel":"Mix With The Masters","chunks":3},"mwtm-jaycen-joshua-ed-sheeran-take-me-back-to-london-p02":{"title":"Take Me Back To London — Part 2: Mix Version Comparison And Iteration","channel":"Mix With The Masters","chunks":3},"mwtm-jaycen-joshua-ed-sheeran-take-me-back-to-london-p03":{"title":"Take Me Back To London — Part 3: Recording Democratization Engineer Role Change","channel":"Mix With The Masters","chunks":5},"mwtm-jaycen-joshua-ed-sheeran-take-me-back-to-london-p04":{"title":"Take Me Back To London — Part 4: Kick Drum Level Management","channel":"Mix With The Masters","chunks":4},"mwtm-jaycen-joshua-ed-sheeran-take-me-back-to-london-p05":{"title":"Take Me Back To London — Part 5: Compressor Gain Reduction Indicators","channel":"Mix With The Masters","chunks":4},"mwtm-jaycen-joshua-tessa-b-si-seulement-p01":{"title":"Si Seulement — Part 1: Gain Staging And Mixing Fundamentals","channel":"Mix With The Masters","chunks":2},"mwtm-jaycen-joshua-tessa-b-si-seulement-p02":{"title":"Si Seulement — Part 2: Eq Balancing Kick And 808","channel":"Mix With The Masters","chunks":2},"mwtm-jaycen-joshua-tessa-b-si-seulement-p03":{"title":"Si Seulement — Part 3: Delay Effects On Rap Vocals","channel":"Mix With The Masters","chunks":2},"mwtm-jaycen-joshua-tessa-b-si-seulement-p04":{"title":"Si Seulement — Part 4: Vocal Processing With Reverb","channel":"Mix With The Masters","chunks":4},"mwtm-jaycen-joshua-tessa-b-si-seulement-p05":{"title":"Si Seulement — Part 5: Vocal Layering And Production Consistency","channel":"Mix With The Masters","chunks":2},"mwtm-jaycen-joshua-tessa-b-si-seulement-p06":{"title":"Si Seulement — Part 6: Mixing Ari Lennox With Jermaine Dupri","channel":"Mix With The Masters","chunks":6},"mwtm-jimmy-douglass-justin-timberlake-not-a-bad-thing-p01":{"title":"Not A Bad Thing — Part 1: SSL Console Mixing Workflow","channel":"Mix With The Masters","chunks":2},"mwtm-jimmy-douglass-justin-timberlake-not-a-bad-thing-p02":{"title":"Not A Bad Thing — Part 2: Vocal Delay Effects Processing","channel":"Mix With The Masters","chunks":3},"mwtm-jimmy-douglass-justin-timberlake-not-a-bad-thing-p03":{"title":"Not A Bad Thing — Part 3: Emotional Vocal Lyric Analysis","channel":"Mix With The Masters","chunks":3},"mwtm-jimmy-douglass-justin-timberlake-not-a-bad-thing-p04":{"title":"Not A Bad Thing — Part 4: Stem Printing Phase Alignment Issues","channel":"Mix With The Masters","chunks":5},"mwtm-leslie-brathwaite-jack-harlow-drake-churchill-downs-p01":{"title":"Churchill Downs — Part 1: Mix Quality And Client Approval","channel":"Mix With The Masters","chunks":9},"mwtm-leslie-brathwaite-jack-harlow-drake-churchill-downs-p02":{"title":"Churchill Downs — Part 2: Kick Drum Foundation And Balance","channel":"Mix With The Masters","chunks":3},"mwtm-leslie-brathwaite-jack-harlow-drake-churchill-downs-p03":{"title":"Churchill Downs — Part 3: Drums And Sample Balance","channel":"Mix With The Masters","chunks":6},"mwtm-leslie-brathwaite-jack-harlow-drake-churchill-downs-p04":{"title":"Churchill Downs — Part 4: Minimalist Pro Tools Plugin Challenge","channel":"Mix With The Masters","chunks":5},"mwtm-leslie-brathwaite-jack-harlow-drake-churchill-downs-p05":{"title":"Churchill Downs — Part 5: Minimalist Plugin Selection Approach","channel":"Mix With The Masters","chunks":5},"mwtm-leslie-brathwaite-jack-harlow-drake-churchill-downs-p06":{"title":"Churchill Downs — Part 6: Mixing Refinement And Matching Techniques","channel":"Mix With The Masters","chunks":3},"mwtm-leslie-brathwaite-lil-uzi-vert-days-come-and-go-p01":{"title":"Days Come And Go — Part 1: Part 01","channel":"Mix With The Masters","chunks":3},"mwtm-leslie-brathwaite-lil-uzi-vert-days-come-and-go-p02":{"title":"Days Come And Go — Part 2: Subtractive EQ And De Essing Workflow","channel":"Mix With The Masters","chunks":2},"mwtm-leslie-brathwaite-lil-uzi-vert-days-come-and-go-p03":{"title":"Days Come And Go — Part 3: Low End Kick Bass Foundation","channel":"Mix With The Masters","chunks":3},"mwtm-leslie-brathwaite-lil-uzi-vert-days-come-and-go-p04":{"title":"Days Come And Go — Part 4: Vocal Integration And Balance","channel":"Mix With The Masters","chunks":3},"mwtm-leslie-brathwaite-lil-uzi-vert-days-come-and-go-p05":{"title":"Days Come And Go — Part 5: Vocal Clarity And Diction Issues","channel":"Mix With The Masters","chunks":3},"mwtm-tchad-blake-arctic-monkeys-do-i-wanna-know-p01":{"title":"Do I Wanna Know — Part 1: Remix Recording After Decade","channel":"Mix With The Masters","chunks":1},"mwtm-tchad-blake-arctic-monkeys-do-i-wanna-know-p02":{"title":"Do I Wanna Know — Part 2: Part 02","channel":"Mix With The Masters","chunks":1},"mwtm-tchad-blake-arctic-monkeys-do-i-wanna-know-p03":{"title":"Do I Wanna Know — Part 3: Part 03","channel":"Mix With The Masters","chunks":1},"mwtm-tchad-blake-arctic-monkeys-do-i-wanna-know-p04":{"title":"Do I Wanna Know — Part 4: Lyric Writing And Songwriting","channel":"Mix With The Masters","chunks":2},"mwtm-tchad-blake-arctic-monkeys-do-i-wanna-know-p05":{"title":"Do I Wanna Know — Part 5: Part 05","channel":"Mix With The Masters","chunks":2},"mwtm-tchad-blake-arctic-monkeys-do-i-wanna-know-p06":{"title":"Do I Wanna Know — Part 6: Multiple Listens For Mix Decisions","channel":"Mix With The Masters","chunks":3},"mwtm-tchad-blake-arctic-monkeys-do-i-wanna-know-p07":{"title":"Do I Wanna Know — Part 7: Mixing Arrangement Decision Process","channel":"Mix With The Masters","chunks":1},"mwtm-tchad-blake-various-p01":{"title":"Various — Part 1: Gain Structure Digital Vs Analog","channel":"Mix With The Masters","chunks":2},"mwtm-tchad-blake-various-p02":{"title":"Various — Part 2: Color Coding Track Organization","channel":"Mix With The Masters","chunks":4},"mwtm-tchad-blake-various-p03":{"title":"Various — Part 3: Template Setup Workflow Strategies","channel":"Mix With The Masters","chunks":3},"mwtm-tchad-blake-various-p04":{"title":"Various — Part 4: Effects Chain Organization Setup","channel":"Mix With The Masters","chunks":3},"sonnox-oxford-inflator-guide":{"title":"Sonnox Oxford Inflator — Official User Guide and Logic Pro Applications","channel":"Sonnox (official product manual)","chunks":4},"6f1dNbl7c_o":{"title":"You Must Know These 4 Things About Reverb In Logic Pro","channel":"Make Your Music","chunks":5},"mwK3Bv7bTOs":{"title":"7 Easy Reverb Tricks That ALL Logic Pro Beginners Miss","channel":"Make Your Music","chunks":4},"7UW6V2wF4QI":{"title":"5 Brilliant Tips To Learn Compression In Logic Pro","channel":"Make Your Music","chunks":5},"ILMN23lCsow":{"title":"5 Logic Pro Mixing HACKS you haven't seen yet","channel":"Make Your Music","chunks":5},"QxcKVDcRRIQ":{"title":"3 Genius Logic Pro Mixing Tips That Transformed My Music","channel":"Make Your Music","chunks":3},"HMVJIrBmbi0":{"title":"YouTube Tutorials Lied To You About Mixing In Logic Pro","channel":"Make Your Music","chunks":4},"-vg1SqmknFc":{"title":"8 Logic Pro hidden settings that are wasting your time","channel":"Make Your Music","chunks":5},"4Pt9a1ATdfM":{"title":"13 Logic Pro Settings That F*ck Beginners","channel":"Make Your Music","chunks":5},"qEQewAYv1CY":{"title":"The Ultimate Logic Pro PLUGIN Hacks That Took Me Years to Master","channel":"Make Your Music","chunks":4},"zE0Q28pNVZU":{"title":"9 Shocking Logic Pro Mistakes ALL Beginners Make (and how to fix)","channel":"Make Your Music","chunks":3},"VmVx6DFrtjc":{"title":"If You Don't Understand Snap Grid, Then You Don't Understand Logic","channel":"Make Your Music","chunks":4},"UqKXz_SGAXw":{"title":"Producing a Radio-Ready Song in Logic Pro (start to finish walkthrough)","channel":"Make Your Music","chunks":27},"xFykbI7am_Y":{"title":"How to Fake a $100K Studio in Logic (step by step)","channel":"Make Your Music","chunks":4},"ApF9-ds94uY":{"title":"Copy This Song, It’ll 10x Your Logic Pro Skills","channel":"Make Your Music","chunks":4},"JzG37KaZr3s":{"title":"THIS is why your Logic Pro song sounds like a DEMO","channel":"Make Your Music","chunks":4},"6NfXDmoaaHM":{"title":"9 Game Changing Features In Logic 11.1 That You Must See","channel":"Make Your Music","chunks":3},"6CUkv4YU00g":{"title":"Logic 12 Just Made Finishing Songs Way Easier","channel":"Make Your Music","chunks":3},"Yk-2JuwxRVU":{"title":"The BEST Logic Pro Tutorial For Beginners (A free 3+ hour course)","channel":"Make Your Music","chunks":66},"4bFAfa2lKD4":{"title":"a START to FINISH Logic Pro song plan (these 8 min will save you 80 hours)","channel":"Make Your Music","chunks":4},"dgU6yVLZQ4g":{"title":"I made and released a song in Logic Pro.. in 5 hours.","channel":"Make Your Music","chunks":17},"gEFMmirzGnk":{"title":"Give Me 56 minutes AND I’ll improve your Logic Pro skills by 117%","channel":"Make Your Music","chunks":17},"3_2a7bLXhco":{"title":"The Simple Logic Pro Formula That Changed Everything For Me","channel":"Make Your Music","chunks":4},"0fBRsS3_BHA":{"title":"This Just Changed Logic Pro Forever","channel":"Make Your Music","chunks":6},"dnBAg6-DhsY":{"title":"you're wasting months learning Logic Pro like this","channel":"Make Your Music","chunks":6},"NO5Yf-GfHEc":{"title":"9 Obvious Signs You Are An Amateur In Logic Pro","channel":"Make Your Music","chunks":5},"ISAHWCpzufA":{"title":"Why Your Logic Pro Sessions Become Unmanageable","channel":"Make Your Music","chunks":4},"lRtgA8rQuV4":{"title":"You’re Learning Logic Pro The Wrong Way","channel":"Make Your Music","chunks":3},"5wy3Xr1McIw":{"title":"4 Life Changing Logic Pro Quick-Hacks You NEED To Know","channel":"Make Your Music","chunks":5},"Wku6uV5v1g8":{"title":"If you hate Logic Pro, please just watch this","channel":"Make Your Music","chunks":7},"Bc9h9gjtbW4":{"title":"The 39 Logic Pro Key Shortcuts for Faster Mixes","channel":"Mastering.com","chunks":13},"RxGUBUsfpvI":{"title":"Pro Mastering Engineer Reveals His Ozone Maximizer Settings","channel":"Streaky","chunks":2}}));

const UPSTREAMS = {
  elevenlabs: { base: 'https://api.elevenlabs.io',  header: 'xi-api-key', secret: 'ELEVENLABS_API_KEY' },
};

// Origins allowed to call the relay. This is browser-enforced only — a curl
// with a faked Origin header gets through — so it deters casual abuse, not a
// determined attacker who finds the Worker URL. Acceptable for a single-user
// app; add a shared-token check (and rotate keys) before sharing AIMM.
const ALLOWED_ORIGINS = [
  'https://aimixmasters.com',
  'https://www.aimixmasters.com',
  'https://begb0037admin.github.io',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:8765',
  'http://127.0.0.1:8765',
];

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

function jsonResponse(value, status, extraHeaders = {}){
  return new Response(JSON.stringify(value), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

function corsJsonResponse(value, status, origin, request){
  return jsonResponse(value, status, { ...corsHeaders(origin, request) });
}

async function hopeSpeechTicket(secret, origin){
  const expires = Date.now() + 60_000;
  const nonce = crypto.randomUUID();
  const message = `${origin}|${expires}|${nonce}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(String(secret)), { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message)));
  const hex = Array.from(signature, byte => byte.toString(16).padStart(2,'0')).join('');
  return `${expires}.${nonce}.${hex}`;
}

async function hopeSpeechTicketValid(ticket, secret, origin){
  const match = String(ticket || '').match(/^(\d{13})\.([0-9a-f-]{36})\.([0-9a-f]{64})$/i);
  if (!match) return false;
  const expires = Number(match[1]);
  if (expires < Date.now() || expires > Date.now() + 60_000) return false;
  const message = `${origin}|${expires}|${match[2]}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(String(secret)), { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message)));
  const hex = Array.from(signature, byte => byte.toString(16).padStart(2,'0')).join('');
  let mismatch = hex.length ^ match[3].length;
  for (let i=0;i<hex.length;i++) mismatch |= hex.charCodeAt(i) ^ match[3].charCodeAt(i);
  return mismatch === 0;
}

async function readJson(request){
  return JSON.parse(await request.text());
}

function extractVoyageEmbeddings(payload){
  if (!payload || !Array.isArray(payload.data)) {
    throw new Error('Voyage response missing data array');
  }
  return payload.data.map((document, docIndex) => {
    if (!document || !Array.isArray(document.data)) {
      throw new Error(`Voyage response missing data[${docIndex}].data array`);
    }
    return document.data;
  });
}

function extractContextualEmbedding(payload, docIndex){
  const documents = extractVoyageEmbeddings(payload);
  const group = documents[docIndex];
  if (!group) throw new Error(`Voyage response missing data[${docIndex}].data entries`);
  const item = group[0];
  if (!item || !Array.isArray(item.embedding)) {
    throw new Error(`Voyage response contained an invalid embedding at data[${docIndex}].data[0]`);
  }
  return item.embedding;
}

function extractContextualGroup(payload, docIndex){
  const documents = extractVoyageEmbeddings(payload);
  const group = documents[docIndex];
  if (!group) throw new Error(`Voyage response missing data[${docIndex}].data entries`);
  if (!group.every(item => item && Array.isArray(item.embedding))) {
    throw new Error(`Voyage response contained an invalid embedding in data[${docIndex}].data`);
  }

  const hasIndexes = group.some(item => Object.prototype.hasOwnProperty.call(item, 'index'));
  if (!hasIndexes) return group.map(item => item.embedding);
  if (!group.every(item => Number.isInteger(item.index))) {
    throw new Error(`Voyage response contained an invalid index in data[${docIndex}].data`);
  }
  const ordered = new Array(group.length);
  for (const item of group){
    if (item.index < 0 || item.index >= group.length || ordered[item.index]) {
      throw new Error(`Voyage response contained an out-of-range or duplicate index in data[${docIndex}].data`);
    }
    ordered[item.index] = item.embedding;
  }
  if (ordered.some(embedding => !Array.isArray(embedding))) {
    throw new Error(`Voyage response contained incomplete indexed data[${docIndex}].data`);
  }
  return ordered;
}

async function voyageEmbeddings(inputs, inputType, apiKey){
  // The contextualizedembeddings path is the Voyage context-3 endpoint used
  // by this upgrade. Confirm the live endpoint during the first provisioned
  // smoke test before production backfill; this session must not make it.
  const response = await fetch('https://api.voyageai.com/v1/contextualizedembeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs,
      model: 'voyage-context-3',
      input_type: inputType,
      output_dimension: 1024,
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Voyage HTTP ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ''}`);
  }
  return response.json();
}

function validateUpsertBody(body){
  if (!body || typeof body.video_id !== 'string' || !body.video_id.trim()) {
    throw new Error('video_id is required');
  }
  if (!Array.isArray(body.chunks) || !body.chunks.length) {
    throw new Error('chunks must be a non-empty array');
  }
  for (const chunk of body.chunks){
    if (!chunk || !Number.isFinite(Number(chunk.chunk)) ||
        typeof chunk.text !== 'string' || !chunk.text ||
        typeof chunk.title !== 'string' || !chunk.title ||
        typeof chunk.channel !== 'string' || !chunk.channel) {
      throw new Error('each chunk requires chunk, text, title, and channel');
    }
  }
}

function youtubeVideoId(value){
  let url;
  try { url = new URL(String(value || '').trim()); } catch (_) { return null; }
  if (!['http:', 'https:'].includes(url.protocol)) return null;
  const host = url.hostname.toLowerCase();
  let id = '';
  if (host === 'youtu.be' || host === 'www.youtu.be') id = url.pathname.split('/')[1] || '';
  else if (['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com'].includes(host)) {
    if (url.pathname === '/watch') id = url.searchParams.get('v') || '';
    else if (/^\/(embed|live|shorts|v)\//.test(url.pathname)) id = url.pathname.split('/')[2] || '';
  }
  return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

function youtubeChunks(segments){
  const chunks = [], words = [];
  for (const segment of segments){
    const clean = String(segment?.text || '').replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim();
    if (clean) words.push(...clean.split(' '));
    // Keep the exact entry-boundary flush used by scripts/ingest_yt.py.
    if (words.length >= 500) chunks.push(words.splice(0).join(' '));
  }
  if (words.length) chunks.push(words.join(' '));
  return chunks;
}

const YOUTUBE_TRANSCRIPT_ERROR = 'The transcript service is not available right now. Try again in a minute.';
const YOUTUBE_QUOTA_ERROR = 'The monthly limit for adding videos has been reached. It resets next month.';

async function fetchYoutubeTranscript(id, env){
  let response;
  try {
    response = await fetch(`https://api.apify.com/v2/acts/B2eTssvcBFUCcAgtJ/run-sync-get-dataset-items?token=${encodeURIComponent(env.APIFY_TOKEN)}`,{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({urls:[`https://www.youtube.com/watch?v=${id}`]})
    });
  } catch (_) { return {error:YOUTUBE_TRANSCRIPT_ERROR,code:'apify_failed',status:502}; }
  if (response.status === 402 || response.status === 429) return {error:YOUTUBE_QUOTA_ERROR,code:'quota',status:429};
  if (!response.ok) return {error:YOUTUBE_TRANSCRIPT_ERROR,code:'apify_failed',status:502};
  let items;
  try { items = await response.json(); } catch (_) { items = []; }
  const item = Array.isArray(items) ? items.find(v => v.videoId === id) : null;
  const chunks = youtubeChunks(item?.segments || []);
  if (!chunks.length) return {error:'This video has no captions, so there is no transcript to add.',code:'no_captions',status:422};
  return {ok:true,video_id:id,title:String(item.videoTitle || id).slice(0,300),channel:String(item.channelName || 'YouTube').slice(0,200),chunks};
}

function storedYoutubeChunks(transcript){
  return String(transcript || '').split(/(?=^## Chunk \d+\s*$)/m)
    .filter(part => /^## Chunk \d+/m.test(part))
    .map(part => part.replace(/^## Chunk \d+\s*/,'').trim());
}

async function upsertVideo(body, env){
  validateUpsertBody(body);
  const videoId = body.video_id.trim();
  const chunks = body.chunks;
  const newChunkNumbers = chunks.map(c => Number(c.chunk));
  let staleIds = [];
  if (env.AIMM_KV){
    const previousRaw = await env.AIMM_KV.get(`kb-vec-manifest:${videoId}`);
    const previous = previousRaw ? JSON.parse(previousRaw) : [];
    const keep = new Set(newChunkNumbers);
    staleIds = (Array.isArray(previous) ? previous : [])
      .filter(number => !keep.has(Number(number)))
      .map(number => vectorIdFor(videoId, number));
  }
  for (let start = 0; start < chunks.length; start += 50){
    const batch = chunks.slice(start, start + 50);
    const inputs = [batch.map(c => `${deriveSessionLabel(videoId, c.channel)} — ${c.title}\n\n${c.text}`)];
    const voyage = await voyageEmbeddings(inputs, 'document', env.VOYAGE_API_KEY);
    const batchEmbeddings = extractContextualGroup(voyage, 0);
    const vectors = batch.map((chunk, i) => ({
      id: vectorIdFor(videoId, chunk.chunk), values: batchEmbeddings[i],
      metadata: { video_id:videoId, chunk:Number(chunk.chunk), title:chunk.title, channel:chunk.channel, text:chunk.text },
    }));
    if (!vectors.every(v => Array.isArray(v.values))) throw new Error('Voyage returned incomplete batch embeddings');
    await env.VEC_YT_KB.upsert(vectors);
  }
  if (staleIds.length) await env.VEC_YT_KB.deleteByIds(staleIds);
  if (env.AIMM_KV) await env.AIMM_KV.put(`kb-vec-manifest:${videoId}`, JSON.stringify(newChunkNumbers));
  return { ok:true, video_id:videoId, chunks_upserted:chunks.length, stale_deleted:staleIds.length };
}

// Real incident, 2026-10-04: a chunk containing Jaycen Joshua's verbatim
// "eight instances of NLS bus" line was missed by BOTH BM25 and semantic
// search across many real query attempts, despite being an exact, rare-term
// match. Root cause: that specific chunk never re-states "Jaycen Joshua" --
// it's deep in a multi-part lesson transcript where the producer's name is
// only said once, early on. The embedding's only identity signal was
// `${title} — ${channel}`, and for MWTM content `channel` is always the
// generic "Mix With The Masters" (shared across all ~145 videos, zero
// discriminating signal) and `title` is just that part's topic list, never
// the producer's name. So a chunk about "NLS" with no re-stated name had
// nothing in its embedding tying it back to Jaycen Joshua at all. Fix:
// derive a real session label from video_id itself for "mwtm-" prefixed
// videos (the producer/artist/song IS encoded in the slug), and embed that
// alongside title+channel. Non-mwtm videos are untouched -- their `channel`
// field is already the real, specific YouTube channel name, not a shared
// generic one, so this gap is MWTM-specific.
function deriveSessionLabel(videoId, channel){
  if (!videoId.startsWith('mwtm-')) return channel;
  const slug = videoId.replace(/^mwtm-/, '').replace(/-p\d+$/, '');
  const readable = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return `${readable} (${channel})`;
}

// Vectorize caps vector IDs at 64 bytes. Long video_id slugs (MWTM titles in
// particular, e.g. "mwtm-<producer>-<artist>-<song>-p<NN>") combined with
// "::<chunk>" routinely exceed that, causing a silent per-video upsert
// failure (VECTOR_UPSERT_ERROR 40008) -- found live during the 2026-10-03
// backfill (3 real videos hit this). Fix: hash the video_id portion down to
// a short, fixed-length, deterministic value before appending the chunk
// number, instead of concatenating the raw (unbounded-length) video_id.
// A fast synchronous hash (FNV-1a) is used rather than crypto.subtle.digest
// specifically to avoid converting both call sites to async for an ID that
// has no security requirement -- metadata.video_id (unhashed, full string)
// remains the source of truth for display/lookup; this value is purely an
// internal Vectorize key.
function hashVideoId(videoId){
  let hash = 0x811c9dc5; // FNV-1a 32-bit offset basis
  for (let i = 0; i < videoId.length; i++){
    hash ^= videoId.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193); // FNV-1a 32-bit prime
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function vectorIdFor(videoId, chunkNumber){
  return `${hashVideoId(videoId)}::${videoId.slice(0, 40)}::${chunkNumber}`;
}

function corsHeaders(origin, request){
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers':
      request.headers.get('Access-Control-Request-Headers') || 'Content-Type, Authorization',
    // Let the browser read ElevenLabs' actual per-request character charge for
    // Hope's optional usage-based TTS path. The Worker still passes upstream
    // billing headers through unchanged.
    'Access-Control-Expose-Headers': 'character-cost, x-character-count, request-id, xi-request-id',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request, env){
    // /health — visit in any browser tab (no Origin gate, no DevTools needed).
    // Probes ElevenLabs subscription; OpenAI is checked for configuration.
    // Reveals nothing but "key valid / not valid".
    if (new URL(request.url).pathname === '/health'){
      const lines = [];
      lines.push(env.OPENAI_API_KEY ? '✅ OPENAI_API_KEY — configured' : '❌ OPENAI_API_KEY — secret not set');
      for (const [name, up] of Object.entries(UPSTREAMS)){
        const key = env[up.secret];
        if (!key){ lines.push('❌ ' + up.secret + ' — secret not set'); continue; }
        try {
          const probe = await fetch(
            up.base + '/v1/user/subscription',
            { headers: { [up.header]: key } });
          lines.push(probe.ok
            ? '✅ ' + up.secret + ' — OK'
            : '❌ ' + up.secret + ' — rejected by ' + name + ' (HTTP ' + probe.status + ') — check the key value');
        } catch(e){ lines.push('❌ ' + up.secret + ' — ' + e.message); }
      }
      lines.push(env.AIMM_KV
        ? '✅ AIMM_KV — bound (captures sync ON)'
        : '⚠️ AIMM_KV — not bound (captures sync OFF; app falls back to per-browser storage). See worker/README.md "Durable captures".');
      return new Response('AIMM key relay health\n\n' + lines.join('\n') + '\n',
        { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    const url = new URL(request.url);

    // Ingest is a server-to-server path. It intentionally does not use the
    // browser Origin allow-list; the shared ingest secret is mandatory and is
    // checked before reading the request body so an unset secret can never
    // become an authentication bypass.
    if (url.pathname === '/kb/upsert'){
      const suppliedKey = request.headers.get('X-AIMM-Ingest-Key');
      if (!env.AIMM_INGEST_KEY || suppliedKey !== env.AIMM_INGEST_KEY){
        return jsonResponse({ error: 'Forbidden', code: 'bad_ingest_key' }, 403);
      }
      if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
      try {
        if (!env.VOYAGE_API_KEY) return jsonResponse({ error: 'VOYAGE_API_KEY not set', code: 'no_key' }, 501);
        if (!env.VEC_YT_KB) return jsonResponse({ error: 'VEC_YT_KB not bound', code: 'no_index' }, 501);
        const result = await upsertVideo(await readJson(request), env);
        return jsonResponse(result, 200);
      } catch(e){
        return jsonResponse({ error: e.message || String(e), code: 'upsert_failed' }, 502);
      }
    }

    // Research/debug-only; added 2026-10-05 for the KB chunk-dilution validation pilot (ROADMAP item 37); never called by index.html; uses its own EMBED_DEBUG_KEY secret, not the production ingest key.
    if (url.pathname === '/kb/embed-debug'){
      const suppliedKey = request.headers.get('X-AIMM-Ingest-Key');
      if (!env.EMBED_DEBUG_KEY || suppliedKey !== env.EMBED_DEBUG_KEY){
        return jsonResponse({ error: 'Forbidden', code: 'bad_ingest_key' }, 403);
      }
      if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
      try {
        if (!env.VOYAGE_API_KEY) return jsonResponse({ error: 'VOYAGE_API_KEY not set', code: 'no_key' }, 501);
        const body = await readJson(request);
        if (!body || !Array.isArray(body.inputs) || !body.inputs.length) {
          throw new Error('inputs must be a non-empty array');
        }
        if (body.inputs.length > 50) throw new Error('inputs must contain no more than 50 items');
        if (body.inputs.some(input => typeof input !== 'string' || !input.trim())) {
          throw new Error('inputs must contain only non-empty strings');
        }
        const inputType = body.input_type === undefined ? 'document' : body.input_type;
        if (inputType !== 'document' && inputType !== 'query') {
          throw new Error('input_type must be document or query');
        }
        let embeddings;
        if (inputType === 'query') {
          const voyage = await voyageEmbeddings(body.inputs.map(text => [text]), 'query', env.VOYAGE_API_KEY);
          embeddings = body.inputs.map((_, i) => extractContextualEmbedding(voyage, i));
        } else {
          const voyage = await voyageEmbeddings([body.inputs], 'document', env.VOYAGE_API_KEY);
          embeddings = extractContextualGroup(voyage, 0);
        }
        return jsonResponse({ embeddings }, 200);
      } catch(e){
        return jsonResponse({ error: e.message || String(e), code: 'embed_debug_failed' }, 502);
      }
    }

    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED_ORIGINS.includes(origin)){
      return new Response('Forbidden origin', { status: 403 });
    }
    if (url.pathname === '/elevenlabs-backup/v1/user/subscription'){
      if (request.method !== 'GET') return corsJsonResponse({ error:'Method not allowed' },405,origin,request);
      if (!env.ELEVENLABS_API_KEY_BACKUP) return corsJsonResponse({ error:'Backup account is not connected yet',code:'no_backup_key' },503,origin,request);
      const headers = new Headers({ 'xi-api-key': env.ELEVENLABS_API_KEY_BACKUP });
      const upstream = await fetch('https://api.elevenlabs.io/v1/user/subscription', { method:'GET', headers });
      const respHeaders = new Headers(upstream.headers);
      for (const [k, v] of Object.entries(corsHeaders(origin, request))) respHeaders.set(k, v);
      return new Response(upstream.body, { status:upstream.status, headers:respHeaders });
    }
    if (url.pathname.startsWith('/elevenlabs-backup/')){
      return new Response('Not found', { status:404, headers:corsHeaders(origin,request) });
    }
    if (request.method === 'OPTIONS'){
      return new Response(null, { status: 204, headers: corsHeaders(origin, request) });
    }

    // A short-lived ticket lets the browser open a streaming socket without
    // ever receiving the long-lived Deepgram API key or reusing the static
    // Hope speech token in a WebSocket URL.
    if (url.pathname === '/hope/stt/ticket'){
      if (request.method !== 'POST') return corsJsonResponse({ error:'Method not allowed' },405,origin,request);
      if (!env.HOPE_STT_TOKEN) return corsJsonResponse({ error:'Hope speech access is not configured',code:'no_stt_auth' },503,origin,request);
      const supplied=(request.headers.get('Authorization')||'').replace(/^Bearer\s+/i,'');
      const expected=String(env.HOPE_STT_TOKEN);
      let mismatch=supplied.length^expected.length;
      for(let i=0;i<Math.max(supplied.length,expected.length);i++)mismatch|=(supplied.charCodeAt(i)||0)^(expected.charCodeAt(i)||0);
      if(!supplied||mismatch!==0)return corsJsonResponse({ error:'Hope speech access token is missing or invalid',code:'invalid_stt_auth' },401,origin,request);
      return corsJsonResponse({ ticket:await hopeSpeechTicket(expected,origin),expires_in:60 },200,origin,request);
    }

    // A signed, short-lived preflight exposes the actual upstream handshake
    // failure to the app. WebSocket.onerror hides HTTP response bodies/status.
    if (url.pathname === '/hope/stt/probe'){
      if(request.method!=='POST')return corsJsonResponse({error:'Method not allowed'},405,origin,request);
      if(!env.DEEPGRAM_API_KEY)return corsJsonResponse({ok:false,code:'no_deepgram_key',error:'Deepgram speech is not configured.'},503,origin,request);
      if(!env.HOPE_STT_TOKEN||!(await hopeSpeechTicketValid(url.searchParams.get('ticket'),env.HOPE_STT_TOKEN,origin)))return corsJsonResponse({ok:false,code:'invalid_ticket',error:'Speech check expired. Restart the microphone.'},401,origin,request);
      try{
        const upstream=await fetch('https://api.deepgram.com/v2/listen?model=flux-general-en&eot_threshold=0.65&eot_timeout_ms=1600&tag=aimm-hope',{
          headers:{Upgrade:'websocket',Authorization:'Token '+String(env.DEEPGRAM_API_KEY).trim()}
        });
        if(upstream.status===101&&upstream.webSocket){try{upstream.webSocket.close(1000,'preflight complete');}catch(_){}return corsJsonResponse({ok:true},200,origin,request);}
        const detail=(await upstream.text().catch(()=>'' )).replace(/\s+/g,' ').slice(0,400);
        return corsJsonResponse({ok:false,code:'deepgram_connect_failed',status:upstream.status,error:detail||'Deepgram rejected the live speech handshake.'},502,origin,request);
      }catch(error){
        const detail=String(error&&error.message||error).replace(/\s+/g,' ').slice(0,300);
        return corsJsonResponse({ok:false,code:'deepgram_unavailable',error:detail||'Could not connect to Deepgram live speech.'},502,origin,request);
      }
    }

    // Deepgram Flux streaming proxy. Only the short-lived signed ticket is
    // accepted from the browser; the permanent API key stays in Worker Secrets.
    if (url.pathname === '/hope/stt/stream'){
      if(request.method!=='GET'||(request.headers.get('Upgrade')||'').toLowerCase()!=='websocket')return corsJsonResponse({ error:'WebSocket upgrade required',code:'upgrade_required' },426,origin,request);
      if(!env.DEEPGRAM_API_KEY)return corsJsonResponse({ error:'Deepgram speech is not configured',code:'no_deepgram_key' },503,origin,request);
      if(!env.HOPE_STT_TOKEN)return corsJsonResponse({ error:'Hope speech access is not configured',code:'no_stt_auth' },503,origin,request);
      if(!(await hopeSpeechTicketValid(url.searchParams.get('ticket'),env.HOPE_STT_TOKEN,origin)))return corsJsonResponse({ error:'Speech connection ticket is invalid or expired. Restart the microphone.',code:'invalid_ticket' },401,origin,request);
      if(!env.HOPE_STT_LIMIT)return corsJsonResponse({ error:'Hope speech rate limit is not configured',code:'no_rate_limit' },503,origin,request);
      const ip=request.headers.get('CF-Connecting-IP')||'unknown';
      const {success}=await env.HOPE_STT_LIMIT.limit({key:ip});
      if(!success)return corsJsonResponse({ error:'Hope voice is being used too quickly. Wait a minute and try again.',code:'rate_limited' },429,origin,request);
      try{
        const upstream=await fetch('https://api.deepgram.com/v2/listen?model=flux-general-en&eot_threshold=0.65&eot_timeout_ms=1600&tag=aimm-hope',{
          headers:{ Upgrade:'websocket', Authorization:'Token '+String(env.DEEPGRAM_API_KEY).trim() }
        });
        if(upstream.status!==101||!upstream.webSocket)return corsJsonResponse({ error:'Deepgram could not open a live speech connection (HTTP '+upstream.status+').',code:'deepgram_connect_failed' },502,origin,request);
        const pair=new WebSocketPair();
        const [client,server]=Object.values(pair);
        const dg=upstream.webSocket;
        // With the Worker's 2026 compatibility date, WebSocket binary frames
        // arrive as Blob by default. Cloudflare's WebSocket.send() accepts
        // strings, ArrayBuffers, and views — not Blob — so the old relay
        // silently dropped every microphone frame inside its catch block.
        // Normalize both sides before accepting sockets to preserve binary
        // audio frames across the proxy.
        server.binaryType='arraybuffer';
        dg.binaryType='arraybuffer';
        server.accept({allowHalfOpen:true});
        dg.accept({allowHalfOpen:true});
        const relay=(from,to)=>{
          from.addEventListener('message',event=>{try{if(to.readyState===WebSocket.OPEN)to.send(event.data);}catch(error){console.error('[Hope STT] WebSocket frame relay failed:',String(error&&error.message||error));try{if(to.readyState<WebSocket.CLOSING)to.close(1011,'speech frame relay failed');}catch(_){}}});
          from.addEventListener('close',event=>{try{if(to.readyState< WebSocket.CLOSING)to.close(event.code||1000,event.reason||'closed');}catch(_){}});
          from.addEventListener('error',()=>{try{if(to.readyState< WebSocket.CLOSING)to.close(1011,'speech connection error');}catch(_){}});
        };
        relay(server,dg);relay(dg,server);
        return new Response(null,{status:101,webSocket:client});
      }catch(_){
        return corsJsonResponse({ error:'Could not connect to Deepgram live speech.',code:'deepgram_unavailable' },502,origin,request);
      }
    }

    // /hope/stt — short, in-memory push-to-talk transcription for Hope's
    // optional usage-based voice mode. Audio is never written to KV or R2.
    if (url.pathname === '/hope/stt'){
      if (request.method !== 'POST') return corsJsonResponse({ error: 'Method not allowed' }, 405, origin, request);
      if (!env.HOPE_STT_TOKEN) return corsJsonResponse({ error: 'Hope speech access is not configured', code: 'no_stt_auth' }, 503, origin, request);
      const supplied = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
      const expected = String(env.HOPE_STT_TOKEN);
      let mismatch = supplied.length ^ expected.length;
      const compareLength = Math.max(supplied.length, expected.length);
      for (let i = 0; i < compareLength; i++) mismatch |= (supplied.charCodeAt(i) || 0) ^ (expected.charCodeAt(i) || 0);
      if (!supplied || mismatch !== 0) return corsJsonResponse({ error: 'Hope speech access token is missing or invalid', code: 'invalid_stt_auth' }, 401, origin, request);
      if (!env.AI) return corsJsonResponse({ error: 'Workers AI binding is not configured', code: 'no_ai_binding' }, 501, origin, request);
      if (!env.HOPE_STT_LIMIT) return corsJsonResponse({ error: 'Hope transcription rate limit is not configured', code: 'no_rate_limit' }, 503, origin, request);
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const { success } = await env.HOPE_STT_LIMIT.limit({ key: ip });
      if (!success) return corsJsonResponse({ error: 'Hope voice is being used too quickly. Wait a minute and try again.', code: 'rate_limited' }, 429, origin, request);
      const contentType = String(request.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase();
      if (contentType !== 'audio/wav' && contentType !== 'audio/x-wav') {
        return corsJsonResponse({ error: 'Expected a mono 16 kHz PCM WAV recording', code: 'unsupported_audio' }, 415, origin, request);
      }
      const maxBytes = 1_000_000;
      const declaredBytes = Number(request.headers.get('Content-Length'));
      if (Number.isFinite(declaredBytes) && declaredBytes > maxBytes) return corsJsonResponse({ error: 'Recording is too large (maximum 30 seconds)', code: 'audio_too_large' }, 413, origin, request);
      let bytes;
      try {
        const reader = request.body && request.body.getReader();
        if (!reader) return corsJsonResponse({ error: 'Recording body is empty', code: 'empty_audio' }, 400, origin, request);
        const chunks = []; let total = 0;
        while (true){
          const { value, done } = await reader.read();
          if (done) break;
          total += value.byteLength;
          if (total > maxBytes){ await reader.cancel(); return corsJsonResponse({ error: 'Recording is too large (maximum 30 seconds)', code: 'audio_too_large' }, 413, origin, request); }
          chunks.push(value);
        }
        if (!total) return corsJsonResponse({ error: 'Recording body is empty', code: 'empty_audio' }, 400, origin, request);
        bytes = new Uint8Array(total); let offset = 0;
        for (const chunk of chunks){ bytes.set(chunk, offset); offset += chunk.byteLength; }
      } catch(e){
        return corsJsonResponse({ error: 'Could not read the audio recording', code: 'audio_read_failed' }, 400, origin, request);
      }
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      if (bytes.length < 44 || view.getUint32(0, false) !== 0x52494646 || view.getUint32(8, false) !== 0x57415645) {
        return corsJsonResponse({ error: 'Recording is not a valid WAV file', code: 'invalid_wav' }, 400, origin, request);
      }
      let format = null, dataOffset = -1, dataBytes = 0;
      for (let chunkOffset = 12; chunkOffset + 8 <= bytes.length;){
        const chunkId = view.getUint32(chunkOffset, false);
        const chunkSize = view.getUint32(chunkOffset + 4, true);
        const chunkData = chunkOffset + 8;
        const chunkEnd = chunkData + chunkSize;
        if (chunkEnd > bytes.length) return corsJsonResponse({ error: 'WAV chunk exceeds the recording boundary', code: 'invalid_wav' }, 400, origin, request);
        if (chunkId === 0x666d7420){
          if (chunkSize < 16) return corsJsonResponse({ error: 'WAV format chunk is incomplete', code: 'invalid_wav' }, 400, origin, request);
          format = { code:view.getUint16(chunkData,true), channels:view.getUint16(chunkData+2,true), rate:view.getUint32(chunkData+4,true), bits:view.getUint16(chunkData+14,true) };
        } else if (chunkId === 0x64617461){ dataOffset = chunkData; dataBytes = chunkSize; break; }
        chunkOffset = chunkEnd + (chunkSize & 1);
      }
      if (!format || format.code !== 1 || format.rate !== 16000 || format.channels !== 1 || format.bits !== 16) {
        return corsJsonResponse({ error: 'Recording must be mono 16 kHz, 16-bit PCM WAV', code: 'invalid_wav_format' }, 400, origin, request);
      }
      if (dataOffset < 0 || !dataBytes || dataBytes > 960000 || dataOffset + dataBytes > bytes.length) {
        return corsJsonResponse({ error: 'Recording must contain no more than 30 seconds of audio', code: 'invalid_audio_duration' }, 413, origin, request);
      }
      try {
        const result = await env.AI.run('@cf/openai/whisper-large-v3-turbo', {
          audio: { body: new Response(bytes).body, contentType: 'audio/wav' },
          task: 'transcribe', language: 'en', beam_size: 1,
          initial_prompt: 'AIMM audio mixing and mastering: stems, 808, LUFS, true peak, EQ, bus, sidechain, compressor, limiter, Waves, FabFilter, Ozone.'
        });
        const text = String(result && result.text || '').trim();
        if (!text) return corsJsonResponse({ error: 'No speech detected in the recording', code: 'no_speech' }, 422, origin, request);
        return corsJsonResponse({ text, language: result && result.transcription_info && result.transcription_info.language || 'en' }, 200, origin, request);
      } catch(e){
        return corsJsonResponse({ error: 'Cloudflare transcription failed', code: 'stt_failed' }, 502, origin, request);
      }
    }

    // /hope/luna — streamed GPT-6 Luna Responses API for Hope's custom voice
    // route. The key remains a Worker secret; model responses are not stored.
    if (url.pathname === '/hope/luna'){
      if(request.method!=='POST')return corsJsonResponse({error:'Method not allowed'},405,origin,request);
      if(!env.HOPE_STT_TOKEN&&!env.HOPE_INTERNAL_TOKEN)return corsJsonResponse({error:'Hope speech access is not configured',code:'no_stt_auth'},503,origin,request);
      const supplied=(request.headers.get('Authorization')||'').replace(/^Bearer\s+/i,'');
      const matches=expected=>{
        expected=String(expected||'');
        let mismatch=supplied.length^expected.length;
        for(let i=0;i<Math.max(supplied.length,expected.length);i++)mismatch|=(supplied.charCodeAt(i)||0)^(expected.charCodeAt(i)||0);
        return !!expected&&mismatch===0;
      };
      const speechAuth=matches(env.HOPE_STT_TOKEN);
      const internalMatch=matches(env.HOPE_INTERNAL_TOKEN);
      const internalAuth=!speechAuth&&internalMatch;
      if(!supplied||(!speechAuth&&!internalAuth))return corsJsonResponse({error:'Hope speech access token is missing or invalid',code:'invalid_stt_auth'},401,origin,request);
      if(!env.OPENAI_API_KEY)return corsJsonResponse({error:'GPT-6 Luna is not configured on the AIMM Worker',code:'no_openai_key'},503,origin,request);
      if(!env.HOPE_STT_LIMIT)return corsJsonResponse({error:'Hope speech rate limit is not configured',code:'no_rate_limit'},503,origin,request);
      const ip=request.headers.get('CF-Connecting-IP')||'unknown';
      const {success}=await env.HOPE_STT_LIMIT.limit({key:internalAuth?'internal':ip});
      if(!success)return corsJsonResponse({error:'Hope voice is being used too quickly. Wait a minute and try again.',code:'rate_limited'},429,origin,request);
      let body;
      try{body=await readJson(request);}
      catch(_){return corsJsonResponse({error:'Expected a JSON Luna request',code:'invalid_luna_request'},400,origin,request);}
      if(!body||!Array.isArray(body.input)||!body.input.length||body.input.length>24||JSON.stringify(body).length>100000)
        return corsJsonResponse({error:'Luna request is empty or too large',code:'luna_request_too_large'},413,origin,request);
      const safeBody={
        model:'gpt-6-luna',reasoning:{effort:'low'},input:body.input,
        max_output_tokens:Math.max(64,Math.min(internalAuth?1000:1200,Number(body.max_output_tokens)||220)),
        stream:true,store:false,
        ...(!internalAuth&&Array.isArray(body.tools)&&body.tools.length?{tools:body.tools.slice(0,40),tool_choice:'auto'}:{})
      };
      try{
        const upstream=await fetch('https://api.openai.com/v1/responses',{
          method:'POST',headers:{Authorization:'Bearer '+String(env.OPENAI_API_KEY).trim(),'Content-Type':'application/json'},body:JSON.stringify(safeBody)
        });
        if(!upstream.ok){
          const detail=(await upstream.text().catch(()=>'' )).replace(/\s+/g,' ').slice(0,400);
          return corsJsonResponse({error:'GPT-6 Luna request failed (HTTP '+upstream.status+')'+(detail?': '+detail:''),code:'luna_request_failed'},upstream.status,origin,request);
        }
        const headers=new Headers(corsHeaders(origin,request));
        headers.set('Content-Type',upstream.headers.get('Content-Type')||'text/event-stream; charset=utf-8');
        headers.set('Cache-Control','no-cache, no-transform');
        headers.set('X-Accel-Buffering','no');
        return new Response(upstream.body,{status:200,headers});
      }catch(_){return corsJsonResponse({error:'Could not reach GPT-6 Luna',code:'luna_unavailable'},502,origin,request);}
    }

    // /hope/ai — small, non-streaming Luna tasks for page features.
    if (url.pathname === '/hope/ai'){
      if(request.method!=='POST')return corsJsonResponse({error:'Method not allowed'},405,origin,request);
      if(!env.HOPE_STT_TOKEN)return corsJsonResponse({error:'Hope speech access is not configured',code:'no_stt_auth'},503,origin,request);
      const supplied=(request.headers.get('Authorization')||'').replace(/^Bearer\s+/i,'');
      const expected=String(env.HOPE_STT_TOKEN);
      let mismatch=supplied.length^expected.length;
      for(let i=0;i<Math.max(supplied.length,expected.length);i++)mismatch|=(supplied.charCodeAt(i)||0)^(expected.charCodeAt(i)||0);
      if(!supplied||mismatch!==0)return corsJsonResponse({error:'Hope speech access token is missing or invalid',code:'invalid_stt_auth'},401,origin,request);
      if(!env.OPENAI_API_KEY)return corsJsonResponse({error:'GPT-6 Luna is not configured on the AIMM Worker',code:'no_openai_key'},503,origin,request);
      if(!env.HOPE_STT_LIMIT)return corsJsonResponse({error:'Hope speech rate limit is not configured',code:'no_rate_limit'},503,origin,request);
      const {success}=await env.HOPE_STT_LIMIT.limit({key:request.headers.get('CF-Connecting-IP')||'unknown'});
      if(!success)return corsJsonResponse({error:'Hope AI is being used too quickly. Wait a minute and try again.',code:'rate_limited'},429,origin,request);
      let body;
      try{body=await readJson(request);}catch(_){return corsJsonResponse({error:'Expected a JSON Luna request',code:'invalid_luna_request'},400,origin,request);}
      const userIsText=typeof body?.user==='string'&&!!body.user.trim();
      const userIsParts=Array.isArray(body?.user)&&body.user.length>0&&body.user.every(part=>part&&((part.type==='text'&&typeof part.text==='string')||(part.type==='image'&&typeof part.data_url==='string'&&/^data:image\/(png|jpeg|webp);base64,/.test(part.data_url))));
      if(!body||typeof body.system!=='string'||(!userIsText&&!userIsParts)||body.system.length+JSON.stringify(body.user).length>100000)
        return corsJsonResponse({error:'Luna input must be text and no more than 100000 characters',code:'invalid_luna_request'},400,origin,request);
      const requested=Number(body.max_output_tokens);
      const maxOutput=Number.isFinite(requested)?Math.max(64,Math.min(2000,Math.floor(requested))):1000;
      try{
        const input=userIsText?body.user:[{role:'user',content:body.user.map(part=>part.type==='text'?{type:'input_text',text:part.text}:{type:'input_image',image_url:part.data_url})}];
        const payload={model:'gpt-6-luna',reasoning:{effort:'low'},store:false,stream:false,instructions:body.system,input,max_output_tokens:maxOutput};
        if(body.web_search===true){payload.tools=[{type:'web_search'}];payload.tool_choice='required';}
        const upstream=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:'Bearer '+String(env.OPENAI_API_KEY).trim(),'Content-Type':'application/json'},body:JSON.stringify(payload)});
        if(!upstream.ok){const detail=(await upstream.text().catch(()=>'' )).slice(0,300);return corsJsonResponse({error:'Luna request failed (HTTP '+upstream.status+')'+(detail?': '+detail:''),code:'luna_failed'},502,origin,request);}
        const result=await upstream.json();
        const content=(result.output||[]).filter(item=>item.type==='message').flatMap(item=>item.content||[]);
        const text=content.filter(part=>part.type==='output_text').map(part=>part.text||'').join('\n').trim();
        const sources=[...new Set(content.flatMap(part=>part.annotations||[]).filter(annotation=>annotation.type==='url_citation'&&/^https?:\/\//i.test(annotation.url||'')).map(annotation=>annotation.url))].slice(0,10);
        return corsJsonResponse({text,usage:result.usage||{},sources},200,origin,request);
      }catch(_){return corsJsonResponse({error:'Could not reach Luna',code:'luna_unavailable'},502,origin,request);}
    }

    // /hope/web-search — one Luna web-search call for Luna's KB fallback.
    // OpenAI credentials stay in Worker Secrets; callers use the same
    // short-lived Hope usage token and per-IP rate limit as /hope/luna.
    if (url.pathname === '/hope/web-search'){
      if(request.method!=='POST')return corsJsonResponse({error:'Method not allowed'},405,origin,request);
      if(!env.HOPE_STT_TOKEN)return corsJsonResponse({error:'Hope speech access is not configured',code:'no_stt_auth'},503,origin,request);
      const supplied=(request.headers.get('Authorization')||'').replace(/^Bearer\s+/i,'');
      const expected=String(env.HOPE_STT_TOKEN);
      let mismatch=supplied.length^expected.length;
      for(let i=0;i<Math.max(supplied.length,expected.length);i++)mismatch|=(supplied.charCodeAt(i)||0)^(expected.charCodeAt(i)||0);
      if(!supplied||mismatch!==0)return corsJsonResponse({error:'Hope speech access token is missing or invalid',code:'invalid_stt_auth'},401,origin,request);
      if(!env.OPENAI_API_KEY)return corsJsonResponse({error:'GPT-6 Luna is not configured on the AIMM Worker',code:'no_openai_key'},503,origin,request);
      if(!env.HOPE_STT_LIMIT)return corsJsonResponse({error:'Hope web-search rate limit is not configured',code:'no_rate_limit'},503,origin,request);
      const {success}=await env.HOPE_STT_LIMIT.limit({key:request.headers.get('CF-Connecting-IP')||'unknown'});
      if(!success)return corsJsonResponse({error:'Hope web search is being used too quickly. Wait a minute and try again.',code:'rate_limited'},429,origin,request);
      let body;
      try{body=await readJson(request);}catch(_){return corsJsonResponse({error:'Expected a JSON web-search request',code:'invalid_web_search_request'},400,origin,request);}
      const query=String(body&&body.query||'').trim();
      if(!query||query.length>1000)return corsJsonResponse({error:'Query must contain 1–1000 characters',code:'invalid_web_search_query'},400,origin,request);
      try{
        const upstream=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:'Bearer '+String(env.OPENAI_API_KEY).trim(),'Content-Type':'application/json'},body:JSON.stringify({model:'gpt-6-luna',reasoning:{effort:'low'},store:false,stream:false,instructions:'Answer the question briefly using web search. Include relevant current facts and cite source URLs. Do not answer from memory when the search does not provide support.',input:query,max_output_tokens:700,tools:[{type:'web_search'}],tool_choice:'required'})});
        if(!upstream.ok){const detail=(await upstream.text().catch(()=>'' )).replace(/\s+/g,' ').slice(0,300);return corsJsonResponse({error:'Luna web search failed (HTTP '+upstream.status+')'+(detail?': '+detail:''),code:'web_search_failed'},502,origin,request);}
        const result=await upstream.json();
        const content=(result.output||[]).filter(item=>item.type==='message').flatMap(item=>item.content||[]);
        const answer=content.filter(part=>part.type==='output_text').map(part=>String(part.text||'')).join('\n').trim().slice(0,5000);
        const urls=new Set();
        for(const part of content)for(const annotation of part.annotations||[])if(annotation.type==='url_citation'&&/^https?:\/\//i.test(annotation.url||''))urls.add(annotation.url);
        const searches=(result.output||[]).filter(item=>item.type==='web_search_call'&&item.action?.type==='search').length;
        return corsJsonResponse({answer,sources:Array.from(urls).slice(0,10),web_search_requests:searches},200,origin,request);
      }catch(_){return corsJsonResponse({error:'Could not reach Luna web search',code:'web_search_unavailable'},502,origin,request);}
    }

    // /hope/tts — private Flash speech endpoint for the optional Usage route.
    // /hope/read-aloud — one-click typed-chat read-back; allowed origins,
    // per-IP rate limit and a 2,400-character cap bound use of the TTS-only key
    // without requiring the separate microphone/Usage access token.
    if (url.pathname === '/hope/tts' || url.pathname === '/hope/read-aloud'){
      if (request.method !== 'POST') return corsJsonResponse({ error: 'Method not allowed' }, 405, origin, request);
      if (url.pathname === '/hope/tts'){
        if (!env.HOPE_STT_TOKEN) return corsJsonResponse({ error: 'Hope speech access is not configured', code: 'no_stt_auth' }, 503, origin, request);
        const supplied = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
        const expected = String(env.HOPE_STT_TOKEN);
        let mismatch = supplied.length ^ expected.length;
        const compareLength = Math.max(supplied.length, expected.length);
        for (let i = 0; i < compareLength; i++) mismatch |= (supplied.charCodeAt(i) || 0) ^ (expected.charCodeAt(i) || 0);
        if (!supplied || mismatch !== 0) return corsJsonResponse({ error: 'Hope speech access token is missing or invalid', code: 'invalid_stt_auth' }, 401, origin, request);
      }
      if (!env.HOPE_USAGE_TTS_API_KEY) return corsJsonResponse({ error: 'Hope usage speech is not configured', code: 'no_tts_key' }, 503, origin, request);
      if (!env.HOPE_STT_LIMIT) return corsJsonResponse({ error: 'Hope speech rate limit is not configured', code: 'no_rate_limit' }, 503, origin, request);
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const { success } = await env.HOPE_STT_LIMIT.limit({ key: ip });
      if (!success) return corsJsonResponse({ error: 'Hope voice is being used too quickly. Wait a minute and try again.', code: 'rate_limited' }, 429, origin, request);
      const declaredBytes = Number(request.headers.get('Content-Length'));
      if (Number.isFinite(declaredBytes) && declaredBytes > 15000) return corsJsonResponse({ error: 'Speech text is too large', code: 'text_too_large' }, 413, origin, request);
      let body;
      try { body = await readJson(request); }
      catch(_){ return corsJsonResponse({ error: 'Expected JSON speech text', code: 'invalid_tts_request' }, 400, origin, request); }
      const text = typeof body.text === 'string' ? body.text.trim() : '';
      if (!text) return corsJsonResponse({ error: 'Speech text is required', code: 'empty_tts_text' }, 400, origin, request);
      if (text.length > 2400) return corsJsonResponse({ error: 'Speech text exceeds the 2400-character limit', code: 'text_too_large' }, 413, origin, request);
      try {
        const upstream = await fetch('https://api.elevenlabs.io/v1/text-to-speech/qFJ4KX1Kat5K6ywU2Rnm?output_format=mp3_44100_128', {
          method: 'POST',
          headers: { 'xi-api-key': String(env.HOPE_USAGE_TTS_API_KEY), 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, model_id: 'eleven_flash_v2_5', voice_settings: { stability: 0.5, similarity_boost: 0.8, speed: 1 } }),
        });
        if (!upstream.ok) {
          const detail = await upstream.text().catch(()=> '');
          return corsJsonResponse({ error: 'ElevenLabs speech failed (HTTP ' + upstream.status + ')' + (detail ? ': ' + detail.slice(0, 180) : ''), code: 'tts_failed' }, upstream.status, origin, request);
        }
        const headers = new Headers(corsHeaders(origin, request));
        headers.set('Content-Type', upstream.headers.get('Content-Type') || 'audio/mpeg');
        for (const name of ['character-cost', 'x-character-count', 'request-id', 'xi-request-id']) {
          const value = upstream.headers.get(name);
          if (value) headers.set(name, value);
        }
        return new Response(upstream.body, { status: 200, headers });
      } catch(_){
        return corsJsonResponse({ error: 'Could not reach ElevenLabs speech service', code: 'tts_unavailable' }, 502, origin, request);
      }
    }

    // /captures — durable cross-device store for Hope's capture_to_roadmap
    // inbox, backed by Workers KV (binding: AIMM_KV). The app and
    // DASHBOARD.html sync the full array here; localStorage stays as the
    // offline fallback. Single-user, last-write-wins.
    if (url.pathname === '/captures'){
      const cors = corsHeaders(origin, request);
      if (!env.AIMM_KV){
        return new Response(JSON.stringify({ error: 'KV binding AIMM_KV is not configured on this Worker — see worker/README.md "Durable captures"' }),
          { status: 501, headers: { ...cors, 'Content-Type': 'application/json' } });
      }
      if (request.method === 'GET'){
        const raw = await env.AIMM_KV.get('captures');
        return new Response(raw || '[]', { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
      }
      if (request.method === 'PUT'){
        const body = await request.text();
        try {
          const v = JSON.parse(body);
          if (!Array.isArray(v)) throw new Error('not an array');
        } catch(_){
          return new Response('Expected a JSON array of capture entries', { status: 400, headers: cors });
        }
        await env.AIMM_KV.put('captures', body);
        return new Response('{"ok":true}', { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
      }
      return new Response('Method not allowed', { status: 405, headers: cors });
    }

    if (url.pathname === '/kb/user-videos'){
      if (request.method !== 'GET') return corsJsonResponse({ error:'Method not allowed' },405,origin,request);
      if (!env.AIMM_KV) return corsJsonResponse({ error:'Library storage is unavailable' },503,origin,request);
      const videos = await env.AIMM_KV.get('yt-user:index', 'json') || [];
      return corsJsonResponse({ videos },200,origin,request);
    }
    if (url.pathname.startsWith('/kb/user-videos/')){
      if (request.method !== 'DELETE') return corsJsonResponse({ error:'Method not allowed' },405,origin,request);
      const id = url.pathname.slice('/kb/user-videos/'.length);
      if (!/^[A-Za-z0-9_-]{11}$/.test(id) || !env.AIMM_KV || !env.VEC_YT_KB) return corsJsonResponse({ error:'Video is unavailable' },400,origin,request);
      const index = await env.AIMM_KV.get('yt-user:index','json') || [];
      if (!index.some(v=>v.video_id===id)) return corsJsonResponse({ error:'Video is not in the dashboard library' },404,origin,request);
      const chunks = await env.AIMM_KV.get(`kb-vec-manifest:${id}`,'json') || [];
      if (chunks.length) await env.VEC_YT_KB.deleteByIds(chunks.map(n=>vectorIdFor(id,n)));
      await env.AIMM_KV.put('yt-user:index',JSON.stringify(index.filter(v=>v.video_id!==id)));
      await env.AIMM_KV.delete(`yt-user:${id}`);
      await env.AIMM_KV.delete(`kb-vec-manifest:${id}`);
      return corsJsonResponse({ ok:true,video_id:id },200,origin,request);
    }
    if (url.pathname === '/kb/search-youtube'){
      if (request.method !== 'POST') return corsJsonResponse({ error:'Method not allowed' },405,origin,request);
      if (!env.APIFY_TOKEN || !env.AIMM_KV) return corsJsonResponse({ error:'Video search is unavailable right now.' },503,origin,request);
      if (Number(request.headers.get('content-length') || 0) > 2048) return corsJsonResponse({ error:'Request is too long' },413,origin,request);
      let body;
      try { body = await request.text(); if (body.length > 2048) throw new Error(); body = JSON.parse(body); }
      catch (_) { return corsJsonResponse({ error:'Invalid request' },400,origin,request); }
      const query = typeof body?.query === 'string' ? body.query.trim().slice(0,200) : '';
      if (!query) return corsJsonResponse({ error:'Enter a video topic.' },400,origin,request);
      let items;
      const innertubeController = new AbortController();
      const innertubeTimer = setTimeout(()=>innertubeController.abort(),6000);
      try {
        const upstream = await fetch('https://www.youtube.com/youtubei/v1/search?prettyPrint=false',{
          method:'POST',headers:{'Content-Type':'application/json'},signal:innertubeController.signal,
          body:JSON.stringify({context:{client:{clientName:'WEB',clientVersion:'2.20250101.00.00',hl:'en',gl:'GB'}},query})
        });
        if (!upstream.ok) throw new Error('Innertube search failed');
        const payload = await upstream.json();
        const sections = payload?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
        items = sections.flatMap(section=>section?.itemSectionRenderer?.contents || [])
          .map(entry=>entry?.videoRenderer).filter(video=>video && /^[A-Za-z0-9_-]{11}$/.test(video.videoId)).map(video=>({
            id:video.videoId,
            title:video.title?.runs?.map(run=>run.text).join('') || video.title?.simpleText,
            channel:video.ownerText?.runs?.map(run=>run.text).join('') || video.ownerText?.simpleText,
            duration:video.lengthText?.simpleText || video.lengthText?.runs?.map(run=>run.text).join('') || null,
            views:Number((video.viewCountText?.simpleText || video.viewCountText?.runs?.map(run=>run.text).join('') || '').match(/[\d,]+/)?.[0].replace(/,/g,'')) || 0,
            description:video.descriptionSnippet?.runs?.map(run=>run.text).join('') || video.descriptionSnippet?.simpleText || ''
          }));
      } catch (_) { items = []; }
      finally { clearTimeout(innertubeTimer); }
      if (!items.length){
        const apifyController = new AbortController();
        const apifyTimer = setTimeout(()=>apifyController.abort(),25000);
        try {
          const upstream = await fetch(`https://api.apify.com/v2/acts/streamers~youtube-scraper/run-sync-get-dataset-items?token=${encodeURIComponent(env.APIFY_TOKEN)}`,{
            method:'POST',headers:{'Content-Type':'application/json'},signal:apifyController.signal,
            body:JSON.stringify({searchQueries:[query],maxResults:8,maxResultsShorts:0,maxResultStreams:0})
          });
          if (!upstream.ok) throw new Error('Apify search failed');
          try { items = await upstream.json(); } catch (_) { items = []; }
        } catch (_) { return corsJsonResponse({ error:'Search failed. Try again.' },502,origin,request); }
        finally { clearTimeout(apifyTimer); }
      }
      const userVideos = await env.AIMM_KV.get('yt-user:index','json') || [];
      const known = new Set([...REPO_YT_VIDEOS.keys(),...userVideos.map(v=>v.video_id)]);
      const seen = new Set();
      let excluded = 0;
      const videos = [];
      for (const item of Array.isArray(items) ? items : []){
        const id = youtubeVideoId(item.url || item.videoUrl || '') || (typeof item.id === 'string' && /^[A-Za-z0-9_-]{11}$/.test(item.id) ? item.id : '');
        if (!id || seen.has(id)) continue;
        seen.add(id);
        if (known.has(id)){ excluded++; continue; }
        const description = String(item.description || '').replace(/\s+/g,' ').trim();
        videos.push({id,video_id:id,title:String(item.title || item.videoTitle || id).slice(0,300),channel:String(item.channelName || item.channel || 'YouTube').slice(0,200),duration:item.duration || null,views:item.viewCount || item.views || 0,url:`https://www.youtube.com/watch?v=${id}`,reason:description ? description.slice(0,180) : `Matches your search for ${query}.`});
        if (videos.length >= 20) break;
      }
      return corsJsonResponse({query,videos,excluded},200,origin,request);
    }
    if (url.pathname === '/kb/transcript'){
      if (request.method !== 'GET') return corsJsonResponse({ error:'Method not allowed' },405,origin,request);
      const id = url.searchParams.get('id') || '';
      if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return corsJsonResponse({ error:'Invalid video id' },400,origin,request);
      if (!env.AIMM_KV) return corsJsonResponse({ error:'Library storage is unavailable' },503,origin,request);
      const video = await env.AIMM_KV.get(`yt-user:${id}`, 'json');
      return video ? corsJsonResponse(video,200,origin,request) : corsJsonResponse({ error:'Transcript not found' },404,origin,request);
    }
    if (url.pathname === '/kb/add-youtube' || url.pathname === '/kb/peek-youtube'){
      const peeking = url.pathname === '/kb/peek-youtube';
      if (request.method !== 'POST') return corsJsonResponse({ error:'Method not allowed' },405,origin,request);
      if (!env.HOPE_STT_LIMIT) return corsJsonResponse({ error:YOUTUBE_TRANSCRIPT_ERROR,code:'service_unavailable' },503,origin,request);
      const { success } = await env.HOPE_STT_LIMIT.limit({ key:request.headers.get('CF-Connecting-IP') || 'unknown' });
      if (!success) return corsJsonResponse({ error:YOUTUBE_QUOTA_ERROR,code:'quota' },429,origin,request);
      if (Number(request.headers.get('content-length') || 0) > 2048) return corsJsonResponse({ error:'Link is too long' },413,origin,request);
      let body;
      try { body = await request.text(); if (body.length > 2048) throw new Error(); body = JSON.parse(body); }
      catch (_) { return corsJsonResponse({ error:'Invalid request' },400,origin,request); }
      const id = youtubeVideoId(body?.url);
      if (!id) return corsJsonResponse({ error:'That is not a YouTube link. Paste a link from the Share button.',code:'invalid_url' },400,origin,request);
      if (!env.AIMM_KV || !env.APIFY_TOKEN || (!peeking && (!env.VEC_YT_KB || !env.VOYAGE_API_KEY))) return corsJsonResponse({ error:YOUTUBE_TRANSCRIPT_ERROR,code:'service_unavailable' },503,origin,request);
      const index = await env.AIMM_KV.get('yt-user:index','json') || [];
      const existing = index.find(v => v.video_id === id);
      if (existing || REPO_YT_VIDEOS.has(id)) {
        const video = existing || REPO_YT_VIDEOS.get(id);
        if (peeking) {
          let chunks = [];
          if (existing) {
            const stored = await env.AIMM_KV.get(`yt-user:${id}`,'json');
            chunks = storedYoutubeChunks(stored?.transcript);
          } else {
            try {
              const source = await fetch(`https://begb0037admin.github.io/aimm/docs/knowledge/${id}.md`);
              if (!source.ok) throw new Error('Library transcript unavailable');
              chunks = storedYoutubeChunks(await source.text());
            } catch (_) { return corsJsonResponse({error:YOUTUBE_TRANSCRIPT_ERROR,code:'service_unavailable'},502,origin,request); }
          }
          if (!chunks.length) return corsJsonResponse({error:'This video has no captions, so there is no transcript to add.',code:'no_captions'},422,origin,request);
          return corsJsonResponse({ok:true,video_id:id,title:video.title,channel:video.channel,chunks,already:true},200,origin,request);
        }
        return corsJsonResponse({ ok:true,already:true,video_id:id,title:video.title,channel:video.channel,chunks:video.chunks },200,origin,request);
      }
      const parsed = await env.AIMM_KV.get(`yt-peek:${id}`,'json') || await fetchYoutubeTranscript(id,env);
      if (!parsed.ok) return corsJsonResponse({error:parsed.error,code:parsed.code},parsed.status,origin,request);
      const {chunks,title,channel} = parsed;
      if (peeking) {
        await env.AIMM_KV.put(`yt-peek:${id}`,JSON.stringify(parsed),{expirationTtl:3600});
        return corsJsonResponse({...parsed,already:false},200,origin,request);
      }
      try {
        await upsertVideo({ video_id:id,chunks:chunks.map((text,i)=>({chunk:i+1,title,channel,text})) },env);
        const entry = { video_id:id,title,channel,url:`https://www.youtube.com/watch?v=${id}`,added:new Date().toISOString(),chunks:chunks.length };
        const transcript = chunks.map((text,i)=>`## Chunk ${i+1}\n\n${text}`).join('\n\n');
        await env.AIMM_KV.put(`yt-user:${id}`,JSON.stringify({ ...entry,transcript }));
        await env.AIMM_KV.put('yt-user:index',JSON.stringify([...index,entry]));
        return corsJsonResponse({ok:true,video_id:id,title,channel,chunks:chunks.length,words:chunks.join(' ').split(/\s+/).length,already:false,transcript_for_summary:transcript.slice(0,12000)},200,origin,request);
      } catch (_) { return corsJsonResponse({ error:'The transcript service is not available right now. Try again in a minute.',code:'service_unavailable' },502,origin,request); }
    }

    if (url.pathname === '/kb/vector-search'){
      const cors = corsHeaders(origin, request);
      try {
        if (!env.VOYAGE_API_KEY) return corsJsonResponse({ error: 'VOYAGE_API_KEY not set', code: 'no_key' }, 501, origin, request);
        if (!env.VEC_YT_KB) return corsJsonResponse({ error: 'VEC_YT_KB not bound', code: 'no_index' }, 501, origin, request);
        const body = await readJson(request);
        const query = typeof body.query === 'string' ? body.query.trim() : '';
        if (!query) return corsJsonResponse({ error: 'query is required' }, 400, origin, request);
        const requested = Number(body.n);
        const n = Number.isFinite(requested) ? Math.max(1, Math.min(requested, 30)) : 20;
        const voyage = await voyageEmbeddings([[query]], 'query', env.VOYAGE_API_KEY);
        const vector = extractContextualEmbedding(voyage, 0);
        const result = await env.VEC_YT_KB.query(vector, { topK: n, returnMetadata: 'all' });
        const matches = Array.isArray(result && result.matches) ? result.matches : [];
        return corsJsonResponse({ results: matches.map(match => {
          const metadata = match.metadata || {};
          return {
            video_id: metadata.video_id,
            chunk: Number(metadata.chunk),
            title: metadata.title,
            channel: metadata.channel,
            text: metadata.text,
            score: match.score,
          };
        }) }, 200, origin, request);
      } catch(e){
        return corsJsonResponse({ error: e.message || String(e), code: 'vector_search_failed' }, 502, origin, request);
      }
    }

    if (url.pathname === '/kb/rerank'){
      const cors = corsHeaders(origin, request);
      try {
        if (!env.COHERE_API_KEY) return corsJsonResponse({ error: 'COHERE_API_KEY not set', code: 'no_key' }, 501, origin, request);
        const body = await readJson(request);
        const query = typeof body.query === 'string' ? body.query.trim() : '';
        const documents = Array.isArray(body.documents) ? body.documents : [];
        if (!query || documents.some(d => !d || typeof d.id !== 'string' || typeof d.text !== 'string')) {
          return corsJsonResponse({ error: 'query and documents[{id,text}] are required' }, 400, origin, request);
        }
        const requestedTopN = Number(body.top_n);
        const topN = requestedTopN || documents.length;
        const upstream = await fetch('https://api.cohere.com/v2/rerank', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.COHERE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'rerank-v3.5',
            query,
            documents: documents.map(d => d.text),
            top_n: topN,
          }),
        });
        if (!upstream.ok) {
          const detail = await upstream.text();
          throw new Error(`Cohere HTTP ${upstream.status}${detail ? `: ${detail.slice(0, 300)}` : ''}`);
        }
        const payload = await upstream.json();
        if (!Array.isArray(payload.results)) throw new Error('Cohere response missing results array');
        const results = payload.results;
        // Require BOTH a valid index and a finite relevance_score on every
        // kept item — an item missing relevance_score would otherwise sort
        // as NaN (unstable ordering) while still looking like a successful
        // rerank to the caller.
        const valid = results.filter(item =>
          item && Number.isInteger(item.index) && documents[item.index] &&
          Number.isFinite(item.relevance_score));
        if (results.length && !valid.length) {
          throw new Error('Cohere response contained no valid {index, relevance_score} results');
        }
        return corsJsonResponse({ results: valid
          .map(item => ({ id: documents[item.index].id, relevance_score: item.relevance_score }))
          .sort((a, b) => b.relevance_score - a.relevance_score) }, 200, origin, request);
      } catch(e){
        return corsJsonResponse({ error: e.message || String(e), code: 'rerank_failed' }, 502, origin, request);
      }
    }

    const m = url.pathname.match(/^\/(elevenlabs)(\/.*)$/);
    if (!m){
      return new Response('Not found', { status: 404, headers: corsHeaders(origin, request) });
    }

    const up = UPSTREAMS[m[1]];
    const key = env[up.secret];
    if (!key){
      return new Response('Worker secret ' + up.secret + ' is not set — run: npx wrangler secret put ' + up.secret,
        { status: 500, headers: corsHeaders(origin, request) });
    }

    // Forward the request as-is, minus browser/identity headers, plus the
    // real key. Body streams through untouched (JSON and multipart alike).
    const headers = new Headers(request.headers);
    headers.delete('Origin');
    headers.delete('Host');
    headers.delete('Cookie');
    headers.delete('x-api-key');
    headers.delete('xi-api-key');
    headers.set(up.header, key);

    const upstream = await fetch(up.base + m[2] + url.search, {
      method: request.method,
      headers,
      body: (request.method === 'GET' || request.method === 'HEAD') ? undefined : request.body,
    });

    const respHeaders = new Headers(upstream.headers);
    for (const [k, v] of Object.entries(corsHeaders(origin, request))) respHeaders.set(k, v);
    return new Response(upstream.body, { status: upstream.status, headers: respHeaders });
  },
};
