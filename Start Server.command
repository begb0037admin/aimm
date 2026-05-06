#!/bin/bash
cd ~/Documents/Claude/Artifacts/trap-master-reference
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000
wait
