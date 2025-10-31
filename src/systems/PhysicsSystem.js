/**
import { logger } from '../core/Logger.js';
 * PhysicsSystem - Physics-based interactions for realistic gameplay
 * Provides collision detection, rigid body dynamics, and physical interactions
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class PhysicsSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.scene = gameEngine.scene;
        
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0); // Earth gravity
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;
        this.world.solver.tolerance = 0.1;
        
        // Collision groups
        this.collisionGroups = {
            PLAYER: 1,
            ENEMY: 2,
            TERRAIN: 4,
            PROJECTILE: 8,
            INTERACTIVE: 16,
            TRIGGER: 32
        };
        
        // Physics bodies mapped to Three.js meshes
        this.bodies = new Map();
        this.meshes = new Map();
        
        // Materials
        this.materials = {
            default: new CANNON.Material('default'),
            player: new CANNON.Material('player'),
            terrain: new CANNON.Material('terrain'),
            bouncy: new CANNON.Material('bouncy'),
            slippery: new CANNON.Material('slippery')
        };
        
        this.setupMaterialInteractions();
        this.init();
    }
    
    init() {
        // Add ground plane
        this.createGroundPlane();
        
        logger.info('⚛️ Physics System initialized');
    }
    
    setupMaterialInteractions() {
        // Player-terrain contact
        const playerTerrain = new CANNON.ContactMaterial(
            this.materials.player,
            this.materials.terrain,
            {
                friction: 0.4,
                restitution: 0.0
            }
        );
        this.world.addContactMaterial(playerTerrain);
        
        // Bouncy material
        const bouncyContact = new CANNON.ContactMaterial(
            this.materials.bouncy,
            this.materials.default,
            {
                friction: 0.1,
                restitution: 0.9
            }
        );
        this.world.addContactMaterial(bouncyContact);
        
        // Slippery material
        const slipperyContact = new CANNON.ContactMaterial(
            this.materials.slippery,
            this.materials.default,
            {
                friction: 0.01,
                restitution: 0.3
            }
        );
        this.world.addContactMaterial(slipperyContact);
    }
    
    createGroundPlane() {
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({
            mass: 0,
            shape: groundShape,
            material: this.materials.terrain
        });
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.world.addBody(groundBody);
    }
    
    addRigidBody(mesh, options = {}) {
        const {
            mass = 1,
            shape = 'box',
            material = this.materials.default,
            collisionGroup = this.collisionGroups.INTERACTIVE,
            collisionMask = -1,
            fixed = false
        } = options;
        
        let cannonShape;
        
        // Create appropriate shape
        switch (shape) {
            case 'box':
                const box = new THREE.Box3().setFromObject(mesh);
                const size = new THREE.Vector3();
                box.getSize(size);
                cannonShape = new CANNON.Box(new CANNON.Vec3(
                    size.x / 2,
                    size.y / 2,
                    size.z / 2
                ));
                break;
                
            case 'sphere':
                const sphere = new THREE.Sphere();
                new THREE.Box3().setFromObject(mesh).getBoundingSphere(sphere);
                cannonShape = new CANNON.Sphere(sphere.radius);
                break;
                
            case 'cylinder':
                const cyl = new THREE.Box3().setFromObject(mesh);
                const cylSize = new THREE.Vector3();
                cyl.getSize(cylSize);
                cannonShape = new CANNON.Cylinder(
                    cylSize.x / 2,
                    cylSize.x / 2,
                    cylSize.y,
                    8
                );
                break;
                
            case 'plane':
                cannonShape = new CANNON.Plane();
                break;
                
            default:
                cannonShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
        }
        
        const body = new CANNON.Body({
            mass: fixed ? 0 : mass,
            shape: cannonShape,
            material: material,
            collisionFilterGroup: collisionGroup,
            collisionFilterMask: collisionMask
        });
        
        // Set initial position and rotation
        body.position.copy(mesh.position);
        body.quaternion.copy(mesh.quaternion);
        
        this.world.addBody(body);
        this.bodies.set(mesh, body);
        this.meshes.set(body, mesh);
        
        return body;
    }
    
    removeRigidBody(mesh) {
        const body = this.bodies.get(mesh);
        if (body) {
            this.world.removeBody(body);
            this.bodies.delete(mesh);
            this.meshes.delete(body);
        }
    }
    
    applyForce(mesh, force, worldPoint = null) {
        const body = this.bodies.get(mesh);
        if (body) {
            const cannonForce = new CANNON.Vec3(force.x, force.y, force.z);
            if (worldPoint) {
                const cannonPoint = new CANNON.Vec3(
                    worldPoint.x,
                    worldPoint.y,
                    worldPoint.z
                );
                body.applyForce(cannonForce, cannonPoint);
            } else {
                body.applyForce(cannonForce);
            }
        }
    }
    
    applyImpulse(mesh, impulse, worldPoint = null) {
        const body = this.bodies.get(mesh);
        if (body) {
            const cannonImpulse = new CANNON.Vec3(impulse.x, impulse.y, impulse.z);
            if (worldPoint) {
                const cannonPoint = new CANNON.Vec3(
                    worldPoint.x,
                    worldPoint.y,
                    worldPoint.z
                );
                body.applyImpulse(cannonImpulse, cannonPoint);
            } else {
                body.applyImpulse(cannonImpulse);
            }
        }
    }
    
    setVelocity(mesh, velocity) {
        const body = this.bodies.get(mesh);
        if (body) {
            body.velocity.set(velocity.x, velocity.y, velocity.z);
        }
    }
    
    getVelocity(mesh) {
        const body = this.bodies.get(mesh);
        if (body) {
            return new THREE.Vector3(
                body.velocity.x,
                body.velocity.y,
                body.velocity.z
            );
        }
        return new THREE.Vector3();
    }
    
    raycast(from, to, options = {}) {
        const {
            collisionGroup = -1,
            skipBackfaces = true,
            checkCollisionResponse = true
        } = options;
        
        const cannonFrom = new CANNON.Vec3(from.x, from.y, from.z);
        const cannonTo = new CANNON.Vec3(to.x, to.y, to.z);
        
        const result = new CANNON.RaycastResult();
        
        this.world.raycastClosest(
            cannonFrom,
            cannonTo,
            {
                collisionFilterGroup: collisionGroup,
                skipBackfaces: skipBackfaces,
                checkCollisionResponse: checkCollisionResponse
            },
            result
        );
        
        if (result.hasHit) {
            return {
                hit: true,
                point: new THREE.Vector3(
                    result.hitPointWorld.x,
                    result.hitPointWorld.y,
                    result.hitPointWorld.z
                ),
                normal: new THREE.Vector3(
                    result.hitNormalWorld.x,
                    result.hitNormalWorld.y,
                    result.hitNormalWorld.z
                ),
                distance: result.distance,
                body: result.body,
                mesh: this.meshes.get(result.body)
            };
        }
        
        return { hit: false };
    }
    
    sphereCast(position, radius, options = {}) {
        // Check for bodies within sphere
        const hits = [];
        const cannonPos = new CANNON.Vec3(position.x, position.y, position.z);
        
        this.world.bodies.forEach(body => {
            const distance = body.position.distanceTo(cannonPos);
            if (distance <= radius) {
                hits.push({
                    body: body,
                    mesh: this.meshes.get(body),
                    distance: distance
                });
            }
        });
        
        return hits;
    }
    
    createTrigger(position, size, callback) {
        const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
        const body = new CANNON.Body({
            mass: 0,
            shape: shape,
            isTrigger: true,
            collisionResponse: false,
            collisionFilterGroup: this.collisionGroups.TRIGGER
        });
        
        body.position.set(position.x, position.y, position.z);
        
        // Add collision event
        body.addEventListener('collide', (event) => {
            const otherMesh = this.meshes.get(event.body);
            if (otherMesh && callback) {
                callback(otherMesh, event);
            }
        });
        
        this.world.addBody(body);
        return body;
    }
    
    createExplosion(position, force, radius) {
        const hits = this.sphereCast(position, radius);
        
        hits.forEach(hit => {
            if (hit.body && hit.body.mass > 0) {
                const direction = new THREE.Vector3()
                    .subVectors(
                        new THREE.Vector3(
                            hit.body.position.x,
                            hit.body.position.y,
                            hit.body.position.z
                        ),
                        position
                    )
                    .normalize();
                
                const distanceFactor = 1 - (hit.distance / radius);
                const explosionForce = direction.multiplyScalar(force * distanceFactor);
                
                this.applyImpulse(hit.mesh, explosionForce);
            }
        });
        
        // Create visual effect
        if (this.gameEngine.advancedParticleSystem) {
            this.gameEngine.advancedParticleSystem.createExplosionEffect(
                position,
                0xff6600,
                radius
            );
        }
    }
    
    enableDebugRenderer(enabled = true) {
        if (enabled && !this.debugRenderer) {
            // Simple debug visualization
            this.debugMeshes = [];
            
            this.world.bodies.forEach(body => {
                let debugGeometry;
                
                if (body.shapes[0] instanceof CANNON.Box) {
                    const shape = body.shapes[0];
                    debugGeometry = new THREE.BoxGeometry(
                        shape.halfExtents.x * 2,
                        shape.halfExtents.y * 2,
                        shape.halfExtents.z * 2
                    );
                } else if (body.shapes[0] instanceof CANNON.Sphere) {
                    const shape = body.shapes[0];
                    debugGeometry = new THREE.SphereGeometry(shape.radius, 8, 8);
                }
                
                if (debugGeometry) {
                    const debugMaterial = new THREE.MeshBasicMaterial({
                        color: 0x00ff00,
                        wireframe: true
                    });
                    const debugMesh = new THREE.Mesh(debugGeometry, debugMaterial);
                    this.scene.add(debugMesh);
                    this.debugMeshes.push({ mesh: debugMesh, body: body });
                }
            });
        } else if (!enabled && this.debugMeshes) {
            this.debugMeshes.forEach(({ mesh }) => {
                this.scene.remove(mesh);
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) mesh.material.dispose();
            });
            this.debugMeshes = [];
        }
    }
    
    update(deltaTime) {
        // Step physics simulation
        this.world.step(1 / 60, deltaTime, 3);
        
        // Update Three.js meshes from physics bodies
        this.bodies.forEach((body, mesh) => {
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
        });
        
        // Update debug renderer
        if (this.debugMeshes) {
            this.debugMeshes.forEach(({ mesh, body }) => {
                mesh.position.copy(body.position);
                mesh.quaternion.copy(body.quaternion);
            });
        }
    }
    
    dispose() {
        // Remove all bodies
        this.bodies.forEach((body) => {
            this.world.removeBody(body);
        });
        
        this.bodies.clear();
        this.meshes.clear();
        
        // Clean up debug renderer
        if (this.debugMeshes) {
            this.debugMeshes.forEach(({ mesh }) => {
                this.scene.remove(mesh);
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) mesh.material.dispose();
            });
        }
        
        logger.info('⚛️ Physics System disposed');
    }
}
