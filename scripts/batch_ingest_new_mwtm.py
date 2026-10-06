#!/usr/bin/env python3
"""Batch-ingest the 16 newly-cut MWTM sets (found missing from Hope's KB,
cut 2026-10-06) via the existing ingest_mwtm.py pipeline, then collect the
resulting video_ids for the follow-up rechunk pass."""
import json
import os
import subprocess
import sys

SCRIPT_DIR = os.path.dirname(__file__)
INGEST = os.path.join(SCRIPT_DIR, "ingest_mwtm.py")
KNOWLEDGE_DIR = os.path.join(SCRIPT_DIR, "..", "docs", "knowledge")

FOLDERS = [
    "Andrew_Scheps_Kaleo_Way_Down_We_Go_Mixing",
    "Anthony_Kilhoffer_Jay_Z_Kanye_West_In_Paris_Mixing",
    "BOI_1DA_Travis_Scott_MAFIA_Production",
    "Bainz_Young_Thug_Money_On_Money_Mixing",
    "Ben_Baptie_Little_Simz_Gorilla_Mixing",
    "Finneas_Billie_Eilish_Birds_Of_A_Feather_Production",
    "Finneas_Billie_Eilish_Therefore_I_Am_Production",
    "Finneas_benny_blanco_Selena_Gomez_Eastside_Younger_And_Hotter_Than_Me_Production",
    "Jaycen_Joshua_Critical_Listening_Workshop_2026-09-17",
    "Jaycen_Joshua_Ed_Sheeran_Take_Me_Back_To_London_Mixing",
    "Jaycen_Joshua_Tessa_B_Si_Seulement_Mixing",
    "Jimmy_Douglass_Justin_Timberlake_Not_A_Bad_Thing_Mixing",
    "Leslie_Brathwaite_Jack_Harlow_Drake_Churchill_Downs_Mixing",
    "Leslie_Brathwaite_Lil_Uzi_Vert_Days_Come_And_Go_Mixing",
    "Tchad_Blake_Arctic_Monkeys_Do_I_Wanna_Know_Mixing",
    "Tchad_Blake_Various_Mixing",
]


def main():
    results = []
    for name in FOLDERS:
        print(f"\n=== {name} ===", flush=True)
        proc = subprocess.run([sys.executable, INGEST, name, "--go"],
                               capture_output=True, text=True)
        print(proc.stdout[-4000:], flush=True)
        if proc.returncode != 0:
            print(f"STOP: ingest failed for {name}:\n{proc.stderr[-2000:]}", flush=True)
            results.append((name, "failed"))
            break
        results.append((name, "done"))

    print("\n=== SUMMARY ===", flush=True)
    for name, status in results:
        print(f"{status:10s} {name}", flush=True)

    # Write out the list of new mwtm- video_ids for the rechunk pass
    idx = json.load(open(os.path.join(KNOWLEDGE_DIR, "index.json")))
    slugs = set()
    for name in FOLDERS:
        slug = name.lower().replace("_mixing", "").replace("_mastering", "").replace(
            "_interview", "").replace("_production", "").replace("_workshop", "").replace("_", "-")
        slugs.add(slug)
    new_ids = [v["video_id"] for v in idx["videos"]
               if v["video_id"].startswith("mwtm-") and
               any(v["video_id"].startswith(f"mwtm-{s}-p") for s in slugs)]
    out_path = os.path.join(SCRIPT_DIR, "new_mwtm_video_ids.txt")
    with open(out_path, "w") as f:
        f.write("\n".join(new_ids) + "\n")
    print(f"\nWrote {len(new_ids)} new video_ids to {out_path}", flush=True)


if __name__ == "__main__":
    main()
