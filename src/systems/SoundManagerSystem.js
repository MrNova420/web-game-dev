/**
 * SoundManagerSystem - 3D Spatial Audio Management
 * 
 * Manages audio from FREE external sources:
 * - Freesound (sound effects)
 * - Incompetech (background music)
 * - OpenGameArt (game audio)
 * 
 * Supports 3D positional audio, music layers, and dynamic mixing.
 */

import * as THREE from 'three';

export class SoundManagerSystem {
    constructor(camera) {
        // Audio setup
        this.listener = new THREE.AudioListener();
        if (camera) {
            camera.add(this.listener);
        }
        
        // Audio loaders
        this.audioLoader = new THREE.AudioLoader();
        
        // Sound categories
        this.music = new Map();
        this.sfx = new Map();
        this.ambient = new Map();
        this.voice = new Map();
        
        // Active sounds
        this.activeSounds = new Map();
        
        // Settings
        this.settings = {
            masterVolume: 1.0,
            musicVolume: 0.7,
            sfxVolume: 0.8,
            ambientVolume: 0.5,
            voiceVolume: 1.0,
            muted: false
        };
        
        // Statistics
        this.stats = {
            soundsLoaded: 0,
            soundsPlaying: 0,
            cacheHits: 0,
            cacheMisses: 0
        };
        
        // Audio manifest (external sources)
        this.manifest = {
            music: {
                // Background music (Incompetech)
                main_theme: '/assets/audio/music/main_theme.mp3',
                combat: '/assets/audio/music/combat.mp3',
                exploration: '/assets/audio/music/exploration.mp3',
                boss: '/assets/audio/music/boss.mp3',
                town: '/assets/audio/music/town.mp3',
                dungeon: '/assets/audio/music/dungeon.mp3'
            },
            sfx: {
                // Combat sounds (Freesound)
                sword_swing: '/assets/audio/sfx/sword_swing.ogg',
                sword_hit: '/assets/audio/sfx/sword_hit.ogg',
                arrow_shoot: '/assets/audio/sfx/arrow_shoot.ogg',
                spell_cast: '/assets/audio/sfx/spell_cast.ogg',
                explosion: '/assets/audio/sfx/explosion.ogg',
                fireball: '/assets/audio/sfx/fireball.ogg',
                ice_cast: '/assets/audio/sfx/ice_cast.ogg',
                lightning: '/assets/audio/sfx/lightning.ogg',
                heal: '/assets/audio/sfx/heal.ogg',
                
                // UI sounds
                click: '/assets/audio/sfx/ui_click.ogg',
                hover: '/assets/audio/sfx/ui_hover.ogg',
                error: '/assets/audio/sfx/ui_error.ogg',
                success: '/assets/audio/sfx/ui_success.ogg',
                
                // Player sounds
                footstep: '/assets/audio/sfx/footstep.ogg',
                jump: '/assets/audio/sfx/jump.ogg',
                land: '/assets/audio/sfx/land.ogg',
                hurt: '/assets/audio/sfx/hurt.ogg',
                death: '/assets/audio/sfx/death.ogg',
                
                // Item sounds
                pickup: '/assets/audio/sfx/pickup.ogg',
                equip: '/assets/audio/sfx/equip.ogg',
                potion_drink: '/assets/audio/sfx/potion_drink.ogg',
                coin: '/assets/audio/sfx/coin.ogg',
                
                // Monster sounds
                monster_growl: '/assets/audio/sfx/monster_growl.ogg',
                monster_hit: '/assets/audio/sfx/monster_hit.ogg',
                monster_death: '/assets/audio/sfx/monster_death.ogg'
            },
            ambient: {
                // Ambient loops (Freesound)
                forest: '/assets/audio/ambient/forest.ogg',
                cave: '/assets/audio/ambient/cave.ogg',
                rain: '/assets/audio/ambient/rain.ogg',
                wind: '/assets/audio/ambient/wind.ogg',
                fire: '/assets/audio/ambient/fire.ogg',
                water: '/assets/audio/ambient/water.ogg'
            },
            voice: {
                // Placeholder for voice acting
                narrator_intro: '/assets/audio/voice/narrator_intro.ogg'
            }
        };
        
        // Current music track
        this.currentMusic = null;
        this.musicFadeTime = 2000; // ms
    }
    
    /**
     * Load audio file
     */
    async loadAudio(category, name) {
        const cacheKey = `${category}_${name}`;
        const cache = this[category];
        
        if (cache.has(cacheKey)) {
            this.stats.cacheHits++;
            return cache.get(cacheKey);
        }
        
        this.stats.cacheMisses++;
        
        const path = this.manifest[category]?.[name];
        if (!path) {
            console.warn(`Audio ${category}/${name} not found in manifest`);
            return null;
        }
        
        try {
            const buffer = await new Promise((resolve, reject) => {
                this.audioLoader.load(
                    path,
                    (buf) => resolve(buf),
                    undefined,
                    (error) => reject(error)
                );
            });
            
            cache.set(cacheKey, buffer);
            this.stats.soundsLoaded++;
            
            return buffer;
        } catch (error) {
            console.warn(`Failed to load audio ${category}/${name}:`, error);
            return null;
        }
    }
    
    /**
     * Play background music
     */
    async playMusic(name, loop = true, fadeIn = true) {
        // Fade out current music
        if (this.currentMusic && this.currentMusic.isPlaying) {
            await this.fadeOut(this.currentMusic, this.musicFadeTime);
            this.currentMusic.stop();
        }
        
        // Load and play new music
        const buffer = await this.loadAudio('music', name);
        if (!buffer) return null;
        
        const music = new THREE.Audio(this.listener);
        music.setBuffer(buffer);
        music.setLoop(loop);
        music.setVolume(fadeIn ? 0 : this.settings.musicVolume * this.settings.masterVolume);
        music.play();
        
        // Fade in
        if (fadeIn) {
            await this.fadeIn(music, this.settings.musicVolume * this.settings.masterVolume, this.musicFadeTime);
        }
        
        this.currentMusic = music;
        this.activeSounds.set(`music_${name}`, music);
        this.stats.soundsPlaying++;
        
        return music;
    }
    
    /**
     * Play sound effect
     */
    async playSFX(name, volume = 1.0) {
        const buffer = await this.loadAudio('sfx', name);
        if (!buffer) return null;
        
        const sound = new THREE.Audio(this.listener);
        sound.setBuffer(buffer);
        sound.setVolume(volume * this.settings.sfxVolume * this.settings.masterVolume);
        sound.play();
        
        const soundId = `sfx_${name}_${Date.now()}`;
        this.activeSounds.set(soundId, sound);
        this.stats.soundsPlaying++;
        
        // Remove from active sounds when done
        sound.onEnded = () => {
            this.activeSounds.delete(soundId);
            this.stats.soundsPlaying--;
        };
        
        return sound;
    }
    
    /**
     * Play 3D positional sound
     */
    async playPositionalSFX(name, position, volume = 1.0, maxDistance = 50) {
        const buffer = await this.loadAudio('sfx', name);
        if (!buffer) return null;
        
        const sound = new THREE.PositionalAudio(this.listener);
        sound.setBuffer(buffer);
        sound.setRefDistance(10);
        sound.setMaxDistance(maxDistance);
        sound.setVolume(volume * this.settings.sfxVolume * this.settings.masterVolume);
        
        // Create temporary object at position
        const soundObj = new THREE.Object3D();
        soundObj.position.set(position.x, position.y, position.z);
        soundObj.add(sound);
        
        sound.play();
        
        const soundId = `pos_sfx_${name}_${Date.now()}`;
        this.activeSounds.set(soundId, { sound, object: soundObj });
        this.stats.soundsPlaying++;
        
        sound.onEnded = () => {
            this.activeSounds.delete(soundId);
            this.stats.soundsPlaying--;
        };
        
        return { sound, object: soundObj };
    }
    
    /**
     * Play ambient sound
     */
    async playAmbient(name, loop = true) {
        const buffer = await this.loadAudio('ambient', name);
        if (!buffer) return null;
        
        const ambient = new THREE.Audio(this.listener);
        ambient.setBuffer(buffer);
        ambient.setLoop(loop);
        ambient.setVolume(this.settings.ambientVolume * this.settings.masterVolume);
        ambient.play();
        
        this.activeSounds.set(`ambient_${name}`, ambient);
        this.stats.soundsPlaying++;
        
        return ambient;
    }
    
    /**
     * Stop all sounds of a category
     */
    stopCategory(category) {
        for (const [key, sound] of this.activeSounds.entries()) {
            if (key.startsWith(category)) {
                if (sound.isAudio) {
                    sound.stop();
                } else if (sound.sound) {
                    sound.sound.stop();
                }
                this.activeSounds.delete(key);
                this.stats.soundsPlaying--;
            }
        }
    }
    
    /**
     * Stop all sounds
     */
    stopAll() {
        for (const sound of this.activeSounds.values()) {
            if (sound.isAudio) {
                sound.stop();
            } else if (sound.sound) {
                sound.sound.stop();
            }
        }
        this.activeSounds.clear();
        this.stats.soundsPlaying = 0;
    }
    
    /**
     * Fade in sound
     */
    fadeIn(sound, targetVolume, duration) {
        return new Promise((resolve) => {
            const startVolume = 0;
            const startTime = Date.now();
            
            const fade = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const volume = startVolume + (targetVolume - startVolume) * progress;
                
                sound.setVolume(volume);
                
                if (progress < 1) {
                    requestAnimationFrame(fade);
                } else {
                    resolve();
                }
            };
            
            fade();
        });
    }
    
    /**
     * Fade out sound
     */
    fadeOut(sound, duration) {
        return new Promise((resolve) => {
            const startVolume = sound.getVolume();
            const startTime = Date.now();
            
            const fade = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const volume = startVolume * (1 - progress);
                
                sound.setVolume(volume);
                
                if (progress < 1) {
                    requestAnimationFrame(fade);
                } else {
                    resolve();
                }
            };
            
            fade();
        });
    }
    
    /**
     * Set master volume
     */
    setMasterVolume(volume) {
        this.settings.masterVolume = Math.max(0, Math.min(1, volume));
        this.updateAllVolumes();
    }
    
    /**
     * Set category volume
     */
    setMusicVolume(volume) {
        this.settings.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) {
            this.currentMusic.setVolume(this.settings.musicVolume * this.settings.masterVolume);
        }
    }
    
    setSFXVolume(volume) {
        this.settings.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    setAmbientVolume(volume) {
        this.settings.ambientVolume = Math.max(0, Math.min(1, volume));
    }
    
    /**
     * Mute/unmute
     */
    setMuted(muted) {
        this.settings.muted = muted;
        this.listener.setMasterVolume(muted ? 0 : this.settings.masterVolume);
    }
    
    /**
     * Update all active sound volumes
     */
    updateAllVolumes() {
        for (const [key, sound] of this.activeSounds.entries()) {
            const audio = sound.isAudio ? sound : sound.sound;
            
            if (key.startsWith('music_')) {
                audio.setVolume(this.settings.musicVolume * this.settings.masterVolume);
            } else if (key.startsWith('sfx_') || key.startsWith('pos_sfx_')) {
                audio.setVolume(this.settings.sfxVolume * this.settings.masterVolume);
            } else if (key.startsWith('ambient_')) {
                audio.setVolume(this.settings.ambientVolume * this.settings.masterVolume);
            }
        }
    }
    
    /**
     * Preload common sounds
     */
    async preloadCommon() {
        const commonSounds = [
            { category: 'sfx', name: 'click' },
            { category: 'sfx', name: 'sword_swing' },
            { category: 'sfx', name: 'footstep' },
            { category: 'sfx', name: 'pickup' },
            { category: 'music', name: 'main_theme' }
        ];
        
        const promises = commonSounds.map(s => this.loadAudio(s.category, s.name));
        return Promise.all(promises);
    }
    
    /**
     * Get statistics
     */
    getStats() {
        return {
            ...this.stats,
            activeSounds: this.activeSounds.size,
            cacheHitRate: this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses)
        };
    }
}
