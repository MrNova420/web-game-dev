/**
 * WeatherSystem.js - Phase 4
 * Dynamic weather with rain, snow, storms.
 */

export class WeatherSystem {
  constructor() {
    this.weatherEffects = {
      rain: { particles: '/assets/particles/rain.png', sound: '/assets/audio/rain.ogg' },                // Kenney + Freesound
      snow: { particles: '/assets/particles/snow.png', sound: '/assets/audio/wind.ogg' },                // Kenney + Freesound
      storm: { particles: '/assets/particles/lightning.png', sound: '/assets/audio/thunder.ogg' }        // Kenney + Freesound
    };
  }

  setWeather(regionId, weatherType) {
    const weather = this.weatherEffects[weatherType];
    console.log(`${regionId} weather: ${weatherType}`);
    console.log(`  Particles: ${weather.particles}`);
    console.log(`  Sound: ${weather.sound}`);
  }
}
