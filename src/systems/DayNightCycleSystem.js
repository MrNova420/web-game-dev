/**
 * DayNightCycleSystem.js - Phase 4
 * 24-hour day/night cycle with dynamic lighting.
 */

export class DayNightCycleSystem {
  constructor() {
    this.skyboxes = {
      dawn: '/assets/skyboxes/dawn.hdr',                            // Poly Haven
      day: '/assets/skyboxes/day.hdr',                              // Poly Haven
      dusk: '/assets/skyboxes/dusk.hdr',                            // Poly Haven
      night: '/assets/skyboxes/night.hdr'                           // Poly Haven
    };
    this.currentTime = 12.0; // noon
  }

  update(deltaTime) {
    this.currentTime = (this.currentTime + deltaTime / 3600) % 24;
    const timeOfDay = this.getTimeOfDay();
    console.log(`Time: ${this.currentTime.toFixed(2)}:00 (${timeOfDay})`);
  }

  getTimeOfDay() {
    if (this.currentTime < 6) return 'night';
    if (this.currentTime < 12) return 'dawn';
    if (this.currentTime < 18) return 'day';
    return 'dusk';
  }
  
  setTime(hour) {
    this.currentTime = hour % 24;
    console.log(`⏰ Time set to ${this.currentTime}:00`);
  }
}
