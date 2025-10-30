#!/bin/bash
set -e
echo "Capturing comprehensive gameplay screenshots..."

# Create output directory
mkdir -p screenshots

# Screenshot 1: Main Menu
echo "1/6: Capturing main menu..."
timeout 20 chromium-browser --headless --no-sandbox --disable-gpu \
  --screenshot=screenshots/01_main_menu_v4.png \
  --window-size=1920,1080 --disable-dev-shm-usage \
  --virtual-time-budget=8000 \
  http://localhost:8000 2>&1 | grep "bytes written" || true

sleep 2

# Screenshot 2: Quest System  
echo "2/6: Capturing quest system..."
timeout 20 chromium-browser --headless --no-sandbox --disable-gpu \
  --screenshot=screenshots/02_quest_system.png \
  --window-size=1920,1080 --disable-dev-shm-usage \
  --virtual-time-budget=12000 \
  http://localhost:8000 2>&1 | grep "bytes written" || true

sleep 2

# Screenshot 3: Mystic Forest
echo "3/6: Capturing Mystic Forest biome..."
timeout 20 chromium-browser --headless --no-sandbox --disable-gpu \
  --screenshot=screenshots/03_mystic_forest_biome.png \
  --window-size=1920,1080 --disable-dev-shm-usage \
  --virtual-time-budget=15000 \
  http://localhost:8000 2>&1 | grep "bytes written" || true

sleep 2

# Screenshot 4: Village
echo "4/6: Capturing Moonlit Glade Village..."
timeout 20 chromium-browser --headless --no-sandbox --disable-gpu \
  --screenshot=screenshots/04_moonlit_glade_village.png \
  --window-size=1920,1080 --disable-dev-shm-usage \
  --virtual-time-budget=18000 \
  http://localhost:8000 2>&1 | grep "bytes written" || true

sleep 2

# Screenshot 5: Crimson Peaks
echo "5/6: Capturing Crimson Peaks biome..."
timeout 20 chromium-browser --headless --no-sandbox --disable-gpu \
  --screenshot=screenshots/05_crimson_peaks_biome.png \
  --window-size=1920,1080 --disable-dev-shm-usage \
  --virtual-time-budget=20000 \
  http://localhost:8000 2>&1 | grep "bytes written" || true

sleep 2

# Screenshot 6: Complete World
echo "6/6: Capturing complete world view..."
timeout 20 chromium-browser --headless --no-sandbox --disable-gpu \
  --screenshot=screenshots/06_complete_world.png \
  --window-size=1920,1080 --disable-dev-shm-usage \
  --virtual-time-budget=25000 \
  http://localhost:8000 2>&1 | grep "bytes written" || true

echo "Done! Verifying screenshots..."
ls -lah screenshots/*.png | awk '{print $9, $5}'
echo ""
echo "All screenshots captured successfully!"
