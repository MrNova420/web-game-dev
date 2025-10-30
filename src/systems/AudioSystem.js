/**
 * AudioSystem - Manages background music and sound effects
 * Uses Web Audio API for dynamic audio control
 */

export class AudioSystem {
    constructor(engine) {
        this.engine = engine;
        this.audioContext = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        
        // Audio settings
        this.settings = {
            masterVolume: 0.7,
            musicVolume: 0.5,
            sfxVolume: 0.8,
            muted: false
        };
        
        // Track current music
        this.currentMusic = null;
        this.currentMusicId = null;
        
        // Audio buffers cache
        this.buffers = {};
        this.activeSounds = new Set();
        
        // Procedural sound generators
        this.oscillators = {};
        
        this.init();
        console.log('🎵 Audio System initialized');
    }
    
    init() {
        // Initialize Web Audio API
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // Create gain nodes for volume control
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.settings.masterVolume;
            this.masterGain.connect(this.audioContext.destination);
            
            this.musicGain = this.audioContext.createGain();
            this.musicGain.gain.value = this.settings.musicVolume;
            this.musicGain.connect(this.masterGain);
            
            this.sfxGain = this.audioContext.createGain();
            this.sfxGain.gain.value = this.settings.sfxVolume;
            this.sfxGain.connect(this.masterGain);
            
            // Create audio controls UI
            this.createAudioUI();
            
            // Resume audio context on user interaction (browsers require this)
            document.addEventListener('click', () => {
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
            }, { once: true });
            
        } catch (error) {
            console.warn('Audio not supported:', error);
        }
    }
    
    createAudioUI() {
        const controlsPanel = document.createElement('div');
        controlsPanel.id = 'audio-controls';
        controlsPanel.style.cssText = `
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #9d4edd;
            border-radius: 10px;
            padding: 10px 20px;
            color: #fff;
            pointer-events: auto;
            z-index: 100;
            display: flex;
            gap: 15px;
            align-items: center;
        `;
        
        // Mute button
        const muteBtn = document.createElement('button');
        muteBtn.innerHTML = this.settings.muted ? '🔇' : '🔊';
        muteBtn.style.cssText = `
            background: transparent;
            border: none;
            color: #c77dff;
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
        `;
        muteBtn.addEventListener('click', () => this.toggleMute());
        controlsPanel.appendChild(muteBtn);
        
        this.muteBtn = muteBtn;
        
        // Music volume label
        const musicLabel = document.createElement('span');
        musicLabel.textContent = '🎵';
        musicLabel.style.color = '#e0aaff';
        controlsPanel.appendChild(musicLabel);
        
        // Music volume slider
        const musicSlider = document.createElement('input');
        musicSlider.type = 'range';
        musicSlider.min = '0';
        musicSlider.max = '100';
        musicSlider.value = this.settings.musicVolume * 100;
        musicSlider.style.cssText = `
            width: 80px;
            cursor: pointer;
        `;
        musicSlider.addEventListener('input', (e) => {
            this.setMusicVolume(e.target.value / 100);
        });
        controlsPanel.appendChild(musicSlider);
        
        // SFX volume label
        const sfxLabel = document.createElement('span');
        sfxLabel.textContent = '🔔';
        sfxLabel.style.color = '#e0aaff';
        controlsPanel.appendChild(sfxLabel);
        
        // SFX volume slider
        const sfxSlider = document.createElement('input');
        sfxSlider.type = 'range';
        sfxSlider.min = '0';
        sfxSlider.max = '100';
        sfxSlider.value = this.settings.sfxVolume * 100;
        sfxSlider.style.cssText = `
            width: 80px;
            cursor: pointer;
        `;
        sfxSlider.addEventListener('input', (e) => {
            this.setSFXVolume(e.target.value / 100);
            // Play test sound
            this.playSoundEffect('hit');
        });
        controlsPanel.appendChild(sfxSlider);
        
        document.getElementById('ui-overlay').appendChild(controlsPanel);
    }
    
    toggleMute() {
        this.settings.muted = !this.settings.muted;
        this.masterGain.gain.value = this.settings.muted ? 0 : this.settings.masterVolume;
        this.muteBtn.innerHTML = this.settings.muted ? '🔇' : '🔊';
    }
    
    setMusicVolume(volume) {
        this.settings.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGain) {
            this.musicGain.gain.value = this.settings.musicVolume;
        }
    }
    
    setSFXVolume(volume) {
        this.settings.sfxVolume = Math.max(0, Math.min(1, volume));
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.settings.sfxVolume;
        }
    }
    
    setMasterVolume(volume) {
        this.settings.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain && !this.settings.muted) {
            this.masterGain.gain.value = this.settings.masterVolume;
        }
    }
    
    // Procedural music generation (simple ambient tones)
    playMusic(biome) {
        if (!this.audioContext || this.settings.muted) return;
        
        // Stop current music
        this.stopMusic();
        
        // Resume context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        // Create procedural ambient music based on biome
        const musicData = this.getBiomeMusic(biome);
        this.currentMusicId = biome;
        
        // Play ambient drone
        this.playAmbientDrone(musicData.baseFreq, musicData.harmonic);
        
        console.log(`🎵 Playing music for ${biome}`);
    }
    
    getBiomeMusic(biome) {
        const musicMap = {
            'crystal_cavern': { baseFreq: 220, harmonic: 1.5, name: 'Crystal Resonance' },
            'fungal_city': { baseFreq: 110, harmonic: 1.33, name: 'Spore Dreams' },
            'vine_cathedral': { baseFreq: 165, harmonic: 1.618, name: 'Sacred Growth' },
            'broken_starship': { baseFreq: 440, harmonic: 2, name: 'Void Echo' },
            'twilight_throne': { baseFreq: 138.59, harmonic: 1.414, name: 'Eternal Dusk' }
        };
        
        return musicMap[biome] || musicMap['crystal_cavern'];
    }
    
    playAmbientDrone(baseFreq, harmonic) {
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        // Create oscillators for ambient drone
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const osc3 = this.audioContext.createOscillator();
        
        const gain1 = this.audioContext.createGain();
        const gain2 = this.audioContext.createGain();
        const gain3 = this.audioContext.createGain();
        
        // Set frequencies
        osc1.frequency.value = baseFreq;
        osc2.frequency.value = baseFreq * harmonic;
        osc3.frequency.value = baseFreq * harmonic * harmonic;
        
        // Set waveforms
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc3.type = 'triangle';
        
        // Set gains
        gain1.gain.value = 0.15;
        gain2.gain.value = 0.10;
        gain3.gain.value = 0.05;
        
        // Connect nodes
        osc1.connect(gain1).connect(this.musicGain);
        osc2.connect(gain2).connect(this.musicGain);
        osc3.connect(gain3).connect(this.musicGain);
        
        // Fade in
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.15, now + 2);
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(0.10, now + 2);
        gain3.gain.setValueAtTime(0, now);
        gain3.gain.linearRampToValueAtTime(0.05, now + 2);
        
        // Start oscillators
        osc1.start(now);
        osc2.start(now);
        osc3.start(now);
        
        // Store references
        this.oscillators = {
            osc1, osc2, osc3,
            gain1, gain2, gain3
        };
    }
    
    stopMusic() {
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        // Fade out and stop oscillators
        if (this.oscillators.osc1) {
            this.oscillators.gain1.gain.linearRampToValueAtTime(0, now + 1);
            this.oscillators.gain2.gain.linearRampToValueAtTime(0, now + 1);
            this.oscillators.gain3.gain.linearRampToValueAtTime(0, now + 1);
            
            setTimeout(() => {
                try {
                    this.oscillators.osc1?.stop();
                    this.oscillators.osc2?.stop();
                    this.oscillators.osc3?.stop();
                } catch (e) {
                    // Oscillators already stopped
                }
            }, 1100);
        }
        
        this.oscillators = {};
        this.currentMusicId = null;
    }
    
    // Sound effects using procedural synthesis
    playSoundEffect(type, options = {}) {
        if (!this.audioContext || this.settings.muted) return;
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        switch(type) {
            case 'hit':
                this.playHitSound();
                break;
            case 'ability':
                this.playAbilitySound(options.frequency || 440);
                break;
            case 'level_up':
                this.playLevelUpSound();
                break;
            case 'pickup':
                this.playPickupSound();
                break;
            case 'death':
                this.playDeathSound();
                break;
            case 'boss_appear':
                this.playBossAppearSound();
                break;
            case 'achievement':
                this.playAchievementSound();
                break;
            case 'teleport':
                this.playTeleportSound();
                break;
            default:
                this.playHitSound();
        }
    }
    
    playHitSound() {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.connect(gain).connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.1);
    }
    
    playAbilitySound(frequency) {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, now);
        osc.frequency.exponentialRampToValueAtTime(frequency * 2, now + 0.3);
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        osc.connect(gain).connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.3);
    }
    
    playLevelUpSound() {
        const now = this.audioContext.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
        
        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
            
            osc.connect(gain).connect(this.sfxGain);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.3);
        });
    }
    
    playPickupSound() {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.connect(gain).connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.1);
    }
    
    playDeathSound() {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.5);
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        osc.connect(gain).connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.5);
    }
    
    playBossAppearSound() {
        const now = this.audioContext.currentTime;
        
        // Deep rumble
        const osc1 = this.audioContext.createOscillator();
        const gain1 = this.audioContext.createGain();
        
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(55, now);
        osc1.frequency.linearRampToValueAtTime(110, now + 1);
        
        gain1.gain.setValueAtTime(0.4, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
        
        osc1.connect(gain1).connect(this.sfxGain);
        osc1.start(now);
        osc1.stop(now + 1.5);
        
        // High-pitched warning
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1760, now + 0.5);
        
        gain2.gain.setValueAtTime(0, now + 0.5);
        gain2.gain.linearRampToValueAtTime(0.2, now + 0.6);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
        
        osc2.connect(gain2).connect(this.sfxGain);
        osc2.start(now + 0.5);
        osc2.stop(now + 1.5);
    }
    
    playAchievementSound() {
        const now = this.audioContext.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C (octave higher)
        
        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0, now + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.4);
            
            osc.connect(gain).connect(this.sfxGain);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.4);
        });
    }
    
    playTeleportSound() {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + 0.2);
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        osc.connect(gain).connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.2);
    }
    
    // Save/Load
    getSaveData() {
        return {
            settings: this.settings
        };
    }
    
    loadSaveData(data) {
        if (data.settings) {
            this.settings = { ...this.settings, ...data.settings };
            this.setMusicVolume(this.settings.musicVolume);
            this.setSFXVolume(this.settings.sfxVolume);
            this.setMasterVolume(this.settings.masterVolume);
            
            if (this.settings.muted) {
                this.toggleMute();
            }
        }
    }

  update(delta) {
    // Updated for v3.0.0 - modernized system
  }
}
