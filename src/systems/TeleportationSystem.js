/**
import { logger } from '../core/Logger.js';
 * TeleportationSystem - Fast travel between hubs, safe zones, and waypoints
 * Enables quick navigation across the game world
 */

import * as THREE from 'three';

export class TeleportationSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.scene = gameEngine.scene;
        
        this.waypoints = new Map();
        this.discoveredWaypoints = new Set();
        
        this.teleportCooldown = 0;
        this.cooldownDuration = 5; // 5 seconds between teleports
        
        this.init();
    }
    
    init() {
        this.createDefaultWaypoints();
        this.setupTeleportUI();
        
        logger.info('🌀 Teleportation System initialized');
    }
    
    createDefaultWaypoints() {
        // Starting Area
        this.addWaypoint('starting_zone', {
            name: 'Starting Zone',
            description: 'Where your adventure begins',
            position: new THREE.Vector3(0, 0, 0),
            type: 'safe_zone',
            icon: '🏁',
            alwaysDiscovered: true
        });
        
        // Main Safe Zone / Hub
        this.addWaypoint('main_hub', {
            name: 'Main Hub',
            description: 'Central gathering point for adventurers',
            position: new THREE.Vector3(100, 0, 100),
            type: 'hub',
            icon: '🏰',
            alwaysDiscovered: true
        });
        
        // Trading Post
        this.addWaypoint('trading_post', {
            name: 'Trading Post',
            description: 'Buy and sell items',
            position: new THREE.Vector3(-50, 0, 50),
            type: 'hub',
            icon: '🏪',
            alwaysDiscovered: false
        });
        
        // Training Grounds
        this.addWaypoint('training_grounds', {
            name: 'Training Grounds',
            description: 'Practice your skills',
            position: new THREE.Vector3(50, 0, -50),
            type: 'safe_zone',
            icon: '⚔️',
            alwaysDiscovered: false
        });
        
        // Dungeon Entrance 1
        this.addWaypoint('dungeon_1', {
            name: 'Crystal Caverns',
            description: 'First dungeon entrance',
            position: new THREE.Vector3(150, 0, -100),
            type: 'dungeon',
            icon: '⛰️',
            alwaysDiscovered: false
        });
        
        // Boss Arena
        this.addWaypoint('boss_arena', {
            name: 'Boss Arena',
            description: 'Challenge powerful foes',
            position: new THREE.Vector3(-150, 0, -150),
            type: 'arena',
            icon: '👹',
            alwaysDiscovered: false
        });
        
        logger.info(`Created ${this.waypoints.size} waypoints`);
    }
    
    addWaypoint(id, waypointData) {
        const waypoint = {
            id: id,
            ...waypointData,
            discovered: waypointData.alwaysDiscovered || false
        };
        
        this.waypoints.set(id, waypoint);
        
        if (waypoint.alwaysDiscovered) {
            this.discoveredWaypoints.add(id);
        }
        
        // Create visual marker in world
        this.createWaypointMarker(waypoint);
        
        return waypoint;
    }
    
    createWaypointMarker(waypoint) {
        // Create glowing pillar for waypoint
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
        const material = new THREE.MeshStandardMaterial({
            color: this.getWaypointColor(waypoint.type),
            emissive: this.getWaypointColor(waypoint.type),
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        const pillar = new THREE.Mesh(geometry, material);
        pillar.position.copy(waypoint.position);
        pillar.position.y = 1.5;
        pillar.castShadow = true;
        
        this.scene.add(pillar);
        waypoint.marker = pillar;
        
        // Add icon sprite above
        const iconSprite = this.createIconSprite(waypoint.icon);
        iconSprite.position.y = 4;
        pillar.add(iconSprite);
    }
    
    createIconSprite(icon) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon, 32, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(2, 2, 1);
        
        return sprite;
    }
    
    getWaypointColor(type) {
        const colors = {
            safe_zone: 0x4CAF50,
            hub: 0x2196F3,
            dungeon: 0x9C27B0,
            arena: 0xF44336,
            special: 0xFFEB3B
        };
        
        return colors[type] || 0xFFFFFF;
    }
    
    setupTeleportUI() {
        // Create teleport menu button - positioned to avoid conflict with companion panel
        const button = document.createElement('button');
        button.id = 'teleport-button';
        button.innerHTML = '🌀 Fast Travel';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 200px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            transition: transform 0.2s;
            pointer-events: auto;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', () => {
            this.showTeleportMenu();
        });
        
        document.body.appendChild(button);
        this.teleportButton = button;
    }
    
    showTeleportMenu() {
        // Create modal for waypoint selection
        const modal = document.createElement('div');
        modal.id = 'teleport-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            border: 3px solid #667eea;
            border-radius: 15px;
            padding: 30px;
            z-index: 2000;
            max-width: 600px;
            max-height: 70vh;
            overflow-y: auto;
        `;
        
        const title = document.createElement('h2');
        title.textContent = '🌀 Fast Travel Menu';
        title.style.cssText = 'color: white; text-align: center; margin-bottom: 20px;';
        modal.appendChild(title);
        
        // List discovered waypoints
        const discovered = Array.from(this.discoveredWaypoints)
            .map(id => this.waypoints.get(id))
            .filter(w => w);
        
        if (discovered.length === 0) {
            const noWaypoints = document.createElement('p');
            noWaypoints.textContent = 'No waypoints discovered yet. Explore to find them!';
            noWaypoints.style.cssText = 'color: #ccc; text-align: center;';
            modal.appendChild(noWaypoints);
        } else {
            discovered.forEach(waypoint => {
                const waypointElement = document.createElement('div');
                waypointElement.style.cssText = `
                    background: rgba(255, 255, 255, 0.1);
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: background 0.2s;
                `;
                
                waypointElement.addEventListener('mouseenter', () => {
                    waypointElement.style.background = 'rgba(255, 255, 255, 0.2)';
                });
                
                waypointElement.addEventListener('mouseleave', () => {
                    waypointElement.style.background = 'rgba(255, 255, 255, 0.1)';
                });
                
                waypointElement.addEventListener('click', () => {
                    this.teleportTo(waypoint.id);
                    document.body.removeChild(modal);
                    document.body.removeChild(overlay);
                });
                
                waypointElement.innerHTML = `
                    <div style="color: white;">
                        <span style="font-size: 24px;">${waypoint.icon}</span>
                        <strong style="font-size: 18px; margin-left: 10px;">${waypoint.name}</strong>
                        <p style="color: #ccc; margin: 5px 0 0 34px;">${waypoint.description}</p>
                    </div>
                `;
                
                modal.appendChild(waypointElement);
            });
        }
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            width: 100%;
            padding: 10px;
            margin-top: 20px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        `;
        
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
        });
        
        modal.appendChild(closeButton);
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 1999;
        `;
        
        overlay.addEventListener('click', () => {
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
        });
        
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }
    
    teleportTo(waypointId) {
        if (this.teleportCooldown > 0) {
            if (this.gameEngine.modernUISystem) {
                this.gameEngine.modernUISystem.showNotification(
                    `Teleport on cooldown: ${Math.ceil(this.teleportCooldown)}s`,
                    'warning',
                    2000
                );
            }
            return false;
        }
        
        const waypoint = this.waypoints.get(waypointId);
        if (!waypoint) return false;
        
        if (!this.discoveredWaypoints.has(waypointId)) {
            logger.info('Waypoint not discovered yet');
            return false;
        }
        
        // Teleport player
        if (this.gameEngine.player && this.gameEngine.player.mesh) {
            this.gameEngine.player.mesh.position.copy(waypoint.position);
            this.gameEngine.player.mesh.position.y = 1;
        }
        
        // Teleport effect
        if (this.gameEngine.advancedParticleSystem) {
            this.gameEngine.advancedParticleSystem.createEffect(
                waypoint.position,
                'magic',
                0x9C27B0,
                2.0
            );
        }
        
        // Set cooldown
        this.teleportCooldown = this.cooldownDuration;
        
        // Notification
        if (this.gameEngine.modernUISystem) {
            this.gameEngine.modernUISystem.showNotification(
                `Teleported to ${waypoint.icon} ${waypoint.name}`,
                'success',
                3000
            );
        }
        
        logger.info(`🌀 Teleported to: ${waypoint.name}`);
        
        return true;
    }
    
    discoverWaypoint(waypointId) {
        const waypoint = this.waypoints.get(waypointId);
        if (!waypoint) return false;
        
        if (this.discoveredWaypoints.has(waypointId)) {
            return false; // Already discovered
        }
        
        this.discoveredWaypoints.add(waypointId);
        waypoint.discovered = true;
        
        if (this.gameEngine.modernUISystem) {
            this.gameEngine.modernUISystem.showNotification(
                `🌀 Waypoint Discovered: ${waypoint.name}`,
                'achievement',
                4000
            );
        }
        
        logger.info(`Discovered waypoint: ${waypoint.name}`);
        
        return true;
    }
    
    checkNearbyWaypoints(position, discoveryRadius = 5) {
        this.waypoints.forEach((waypoint, id) => {
            if (!this.discoveredWaypoints.has(id) && !waypoint.alwaysDiscovered) {
                const distance = position.distanceTo(waypoint.position);
                if (distance <= discoveryRadius) {
                    this.discoverWaypoint(id);
                }
            }
        });
    }
    
    update(deltaTime) {
        // Update cooldown
        if (this.teleportCooldown > 0) {
            this.teleportCooldown -= deltaTime;
        }
        
        // Check for nearby waypoints to discover
        if (this.gameEngine.player && this.gameEngine.player.mesh) {
            this.checkNearbyWaypoints(this.gameEngine.player.mesh.position);
        }
        
        // Animate waypoint markers
        this.waypoints.forEach(waypoint => {
            if (waypoint.marker) {
                waypoint.marker.rotation.y += deltaTime;
            }
        });
    }
    
    dispose() {
        this.waypoints.forEach(waypoint => {
            if (waypoint.marker) {
                this.scene.remove(waypoint.marker);
                if (waypoint.marker.geometry) waypoint.marker.geometry.dispose();
                if (waypoint.marker.material) waypoint.marker.material.dispose();
            }
        });
        
        if (this.teleportButton && this.teleportButton.parentElement) {
            this.teleportButton.parentElement.removeChild(this.teleportButton);
        }
        
        logger.info('🌀 Teleportation System disposed');
    }
}
