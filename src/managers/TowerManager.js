import Tower from '../entities/Tower.js';

export default class TowerManager {
    // Tower stat tables: [name, damage, range, attackSpeed, idleEnd, attackEnd, affinityID]
    static neutralData = [['Kitsune', 15, 3, 1.25, 4, 6, 0]];
    static physicalData = [['Izanami', 20, 2, 2, 2, 14, 1]];
    static airData = [['Satyr', 15, 3, 2, 5, 8, 2]];
    static waterData = [['Susanoo', 4, 5, 4, 6, 14, 3]];
    static fireData = [['Promachus', 30, 2.5, 1, 3, 7, 4]];
    static darkData = [['Nattvolva', 40, 8, 0.25, 3, 7, 5]];
    static otherData = [['Shrine', 0, 0, 0, 0, 0, 0]];

    static get allTowerData() {
        return [
        ...this.neutralData,
        ...this.physicalData,
        ...this.airData,
        ...this.waterData,
        ...this.fireData,
        ...this.darkData,
        ...this.otherData
        ];
    }

    static towerAffinityCoeff = [
        [1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        [0.75, 1.5, 0.3, 0.3, 0.3, 0.3],
        [0.75, 0.3, 1.5, 0.3, 0.3, 0.3],
        [0.75, 0.3, 0.3, 1.5, 0.3, 0.3],
        [0.75, 0.3, 0.3, 0.3, 1.5, 0.3],
        [0.75, 0.75, 0.75, 0.75, 0.75, 2]
    ];

    static FRAME_DIMENSIONS = {
        Kitsune: { frameWidth: 82, frameHeight: 81 },
        Satyr: { frameWidth: 64, frameHeight: 75 },
        Nattvolva: { frameWidth: 75, frameHeight: 88 }
    };

    static PROJECTILE_ANIMATIONS = {
        Susanoo_Stripe_projectile: { sprite: 'Susanoo_Stripe', start: 0, end: 5, frameRate: 10 },
        Promachus_fire_projectile: { sprite: 'Promachus_fire', start: 0, end: 5, frameRate: 12 },
        Kitsune_charge_projectile: { sprite: 'Kitsune_charge', start: 0, end: 5, frameRate: 10 },
        Satyr_leaf_projectile: { sprite: 'Satyr_leaf', start: 0, end: 5, frameRate: 10 },
        Nattvolva_dark_projectile: { sprite: 'Nattvolva_dark', start: 0, end: 5, frameRate: 9 }
    };

    constructor(scene) {
        this.scene = scene;

        // Local references for quick access
        this.activeTowers = scene.add.group({ runChildUpdate: true });

        // Currently selected tower type (for placement mode)
        this.selectedTower = null;

        // Available tower index list
        this.towerIndex = ['p0', 'a0', 'w0', 'f0', 'd0', 'n0'];
    }

    getStatsByIndex(indexStr) {

        let tier = 1;

        if (indexStr.includes('_')) {
            const parts = indexStr.split('_');
            indexStr = parts[0];
            tier = Number(parts[1]);
        }

        const type = indexStr[0];
        const id = Number(indexStr.slice(1));

        let base;

        switch (type) {
            case 'p': base = this.constructor.physicalData[id]; break;
            case 'a': base = this.constructor.airData[id]; break;
            case 'w': base = this.constructor.waterData[id]; break;
            case 'f': base = this.constructor.fireData[id]; break;
            case 'd': base = this.constructor.darkData[id]; break;
            case 'n': base = this.constructor.neutralData[id]; break;
            case 'o': base = this.constructor.otherData[id]; break;
            default: return null;
        }

        if (!base) return null;

        const [name, dmg, range, atkSpeed, idleEnd, attackEnd, affinityID] = base;

        // Scaling per tier
        const scale = 1 + (tier - 1) * 0.5;

        return [
            name,
            dmg * scale,
            range + (tier - 1),
            atkSpeed * (1 + (tier - 1) * 0.2),
            idleEnd,
            attackEnd,
            affinityID
        ];
    }

    getRandomTowerIndex() {
        return this.towerIndex[
            Math.floor(Math.random() * this.towerIndex.length)
        ];
    }

    createAnimations() {
        this.constructor.allTowerData.forEach(([name, , , , idleEnd, attackEnd]) => {
            if (name === 'Shrine') return;

            const idleKey = `${name}_idle`;
            const attackKey = `${name}_attack`;

            // Check if texture exists before creating animations
            const textureExists = this.scene.textures.exists(name);
            
            // Idle loop animation
            if (textureExists && !this.scene.anims.exists(idleKey)) {
                try {
                    this.scene.anims.create({
                        key: idleKey,
                        frames: this.scene.anims.generateFrameNumbers(name, {
                            start: 0,
                            end: idleEnd
                        }),
                        frameRate: 6,
                        repeat: -1
                    });
                } catch (e) {
                    console.warn(`Failed to create animation ${idleKey}:`, e);
                }
            }

            // Attack animation (plays once)
            if (textureExists && !this.scene.anims.exists(attackKey)) {
                try {
                    this.scene.anims.create({
                        key: attackKey,
                        frames: this.scene.anims.generateFrameNumbers(name, {
                            start: idleEnd + 1,
                            end: attackEnd
                        }),
                        frameRate: 12,
                        repeat: 0
                    });
                } catch (e) {
                    console.warn(`Failed to create animation ${attackKey}:`, e);
                }
            }
        });
    }

    createTower(indexStr, x, y) {
        const stats = this.getStatsByIndex(indexStr);
        if (!stats) return console.error("Invalid tower index:", indexStr);

        const tower = new Tower(this.scene, stats);
        tower.place(x, y);
        this.activeTowers.add(tower);
        return tower;
    }

    selectTower(index) {
        this.selectedTower = index;
    }

    deselectTower() {
        this.selectedTower = null;
    }

    getSelectedTower() {
        return this.selectedTower;
    }

    hasSelectedTower() {
        return this.selectedTower !== null;
    }

    getSelectedTowerStats() {
        return this.selectedTower
            ? this.getStatsByIndex(this.selectedTower)
            : null;
    }

    pause() {
        this.activeTowers.children.each(t => {
            if (t) t.active = false;
        });
    }

    resume() {
        this.activeTowers.children.each(t => {
            if (t) t.active = true;
        });
    }

    preloadAssets() {
        // Load tower sprites and icons
        this.constructor.allTowerData.forEach(([name]) => {
            if (name === 'Shrine') return;

            const dims = this.constructor.FRAME_DIMENSIONS[name] || { frameWidth: 64, frameHeight: 64 };
            this.scene.load.spritesheet(name, `assets/tower/${name}.png`, dims);
            this.scene.load.image(`${name}_Icon`, `assets/tower/TowerIcon/${name}_Icon.png`);
        });
        
        // Load projectile assets
        this.scene.load.spritesheet('Nattvolva_dark', 'assets/Abilities/Nattvolva_dark.png', { frameWidth: 64, frameHeight: 81 });
        this.scene.load.spritesheet('Kitsune_charge', 'assets/Abilities/Kitsune_charge.png', { frameWidth: 64, frameHeight: 64 });
        this.scene.load.spritesheet('Satyr_leaf', 'assets/Abilities/Satyr_leaf.png', { frameWidth: 64, frameHeight: 64 });
    }

    createProjectileAnimations() {
        Object.entries(this.constructor.PROJECTILE_ANIMATIONS).forEach(([key, config]) => {
            if (!this.scene.anims.exists(key)) {
                // Only create if sprite exists (for nattvolva_dark)
                if (!this.scene.textures.exists(config.sprite)) return;
                
                try {
                    this.scene.anims.create({
                        key,
                        frames: this.scene.anims.generateFrameNumbers(config.sprite, { start: config.start, end: config.end }),
                        frameRate: config.frameRate,
                        repeat: -1
                    });
                } catch (e) {
                    console.warn(`Failed to create animation ${key}:`, e);
                }
            }
        });
    }
}