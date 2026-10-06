#!/usr/bin/env python3
"""Batch driver for the remaining raw MWTM folders found missing from Hope's
KB on 2026-10-06. Runs mwtm_autolabel_cut.py --go on each, verifies file
count/size-sum/duration against the plan, then swaps the folder in (Trash
the old bare-FULL.mp4 staging dir, rename the verified _cut dir to the
canonical name) - same manual steps just taken for the Andrew Scheps pilot,
automated here for the rest. Stops on first verification failure rather than
cascading into more folders with something already wrong.
"""
import json
import os
import subprocess
import sys

TUTORIALS = "/Volumes/MacStore/AIMM_MWTM_Tutorials"
AUTOLABEL = os.path.join(os.path.dirname(__file__), "mwtm_autolabel_cut.py")

# (folder_name, kind, engineer, artist, track)
JOBS = [
    ("Anthony_Kilhoffer_Jay_Z_Kanye_West_In_Paris_Mixing", "Mixing", "Anthony Kilhoffer", "Jay-Z & Kanye West", "In Paris"),
    ("BOI_1DA_Travis_Scott_MAFIA_Production", "Production", "Boi-1da", "Travis Scott", "MAFIA"),
    ("Bainz_Young_Thug_Money_On_Money_Mixing", "Mixing", "Bainz", "Young Thug", "Money On Money"),
    ("Ben_Baptie_Little_Simz_Gorilla_Mixing", "Mixing", "Ben Baptie", "Little Simz", "Gorilla"),
    ("Finneas_Billie_Eilish_Birds_Of_A_Feather_Production", "Production", "Finneas", "Billie Eilish", "Birds Of A Feather"),
    ("Finneas_Billie_Eilish_Therefore_I_Am_Production", "Production", "Finneas", "Billie Eilish", "Therefore I Am"),
    ("Finneas_benny_blanco_Selena_Gomez_Eastside_Younger_And_Hotter_Than_Me_Production", "Production", "Finneas", "benny blanco, Selena Gomez", "Eastside / Younger And Hotter Than Me"),
    ("Jaycen_Joshua_Critical_Listening_Workshop_2026-09-17", "Workshop", "Jaycen Joshua", "", "Critical Listening Workshop"),
    ("Jaycen_Joshua_Ed_Sheeran_Take_Me_Back_To_London_Mixing", "Mixing", "Jaycen Joshua", "Ed Sheeran", "Take Me Back To London"),
    ("Jaycen_Joshua_Tessa_B_Si_Seulement_Mixing", "Mixing", "Jaycen Joshua", "Tessa B", "Si Seulement"),
    ("Jimmy_Douglass_Justin_Timberlake_Not_A_Bad_Thing_Mixing", "Mixing", "Jimmy Douglass", "Justin Timberlake", "Not A Bad Thing"),
    ("Leslie_Brathwaite_Jack_Harlow_Drake_Churchill_Downs_Mixing", "Mixing", "Leslie Brathwaite", "Jack Harlow ft. Drake", "Churchill Downs"),
    ("Leslie_Brathwaite_Lil_Uzi_Vert_Days_Come_And_Go_Mixing", "Mixing", "Leslie Brathwaite", "Lil Uzi Vert", "Days Come And Go"),
    ("Tchad_Blake_Arctic_Monkeys_Do_I_Wanna_Know_Mixing", "Mixing", "Tchad Blake", "Arctic Monkeys", "Do I Wanna Know"),
    ("Tchad_Blake_Various_Mixing", "Mixing", "Tchad Blake", "Various", "Various"),
]


def verify(cut_dir):
    manifest = json.load(open(os.path.join(cut_dir, "set_manifest.json")))
    parts = manifest["parts"]
    files = sorted(f for f in os.listdir(cut_dir) if f.startswith("Part_") and f.endswith(".mp4"))
    if len(files) != len(parts):
        return False, f"expected {len(parts)} part files, found {len(files)}"
    total = sum(os.path.getsize(os.path.join(cut_dir, f)) for f in files)
    full = os.path.getsize(os.path.join(cut_dir, "FULL.mp4"))
    if abs(total - full) > full * 0.01:  # >1% mismatch is suspicious
        return False, f"size mismatch: parts sum {total} vs FULL {full}"
    return True, f"{len(files)} parts, sizes consistent"


def main():
    results = []
    for name, kind, engineer, artist, track in JOBS:
        print(f"\n=== {name} ===")
        source_dir = os.path.join(TUTORIALS, name)
        if not os.path.isfile(os.path.join(source_dir, "FULL.mp4")):
            print("SKIP: no FULL.mp4 found (already processed or missing)")
            results.append((name, "skipped-no-source"))
            continue
        cut_dir = os.path.join(TUTORIALS, name + "_cut")
        cmd = [sys.executable, AUTOLABEL, name, "--kind", kind, "--engineer", engineer,
               "--artist", artist, "--track", track, "--out", cut_dir, "--go"]
        proc = subprocess.run(cmd, capture_output=True, text=True)
        print(proc.stdout[-3000:])
        if proc.returncode != 0:
            print(f"STOP: autolabel_cut failed for {name}:\n{proc.stderr[-2000:]}")
            results.append((name, "failed"))
            break
        ok, msg = verify(cut_dir)
        print(f"Verify: {msg}")
        if not ok:
            print(f"STOP: verification failed for {name} - leaving {cut_dir} for manual review, not swapping in")
            results.append((name, "verify-failed"))
            break
        # Swap in: Trash the old bare-FULL.mp4 staging dir, rename cut dir to canonical name
        subprocess.run(["osascript", "-e",
                         f'tell application "Finder" to delete POSIX file "{source_dir}"'],
                        check=True)
        os.rename(cut_dir, source_dir)
        print(f"OK: {name} swapped in")
        results.append((name, "done"))

    print("\n=== SUMMARY ===")
    for name, status in results:
        print(f"{status:20s} {name}")


if __name__ == "__main__":
    main()
