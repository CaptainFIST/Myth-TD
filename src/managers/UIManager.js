import TimeManager from './TimeManager.js';
import TowerManager from './TowerManager.js';
import EnemyManager from './EnemyManager.js';
import WaveManager from './WaveManager.js';
import InventoryManager from './InventoryManager.js';

export default class UIManager extends Phaser.Scene {
    constructor() {
        super({ key: 'UIManager' });
    }

    preload() {
        // Load tower assets
        TowerManager.physicalData.forEach(([name]) => {
            this.load.spritesheet(name, `assets/tower/${name}.png`, { frameWidth: 64, frameHeight: 64 });
            this.load.image(`${name}_Icon`, `assets/tower/TowerIcon/${name}_Icon.png`);
        });

        // Load enemy assets
        EnemyManager.testData.forEach(([name]) => {
            this.load.spritesheet(name, `assets/Enemies/${name}.png`, { frameWidth: 64, frameHeight: 64 });
        });

        // Load UI assets
        const uiAssets = ['UI', 'UIHP', 'Inventory', 'pausebutton', 'sidebar', 'Susanoo_Stripe', 'Pedestal'];
        uiAssets.forEach(asset => {
            if (asset === 'Susanoo_Stripe') {
                this.load.spritesheet(asset, 'assets/Abilities/susanoo_water.png', { frameWidth: 64, frameHeight: 64 });
            } else if (asset === 'Pedestal') {
                this.load.image(asset, 'assets/Tower Placement/tower_placement.png');
            } else {
                this.load.image(asset, `assets/UI/${asset}.png`);
            }
        });
    }

    create(data) {
        // Validate data
        if (!data.player || !data.sceneL) {
            console.error("UIManager: Missing player or sceneL in data");
            return;
        }

        // Initialize properties
        this.input.mouse.disableContextMenu();
        this.escKey = this.input.keyboard.addKey('ESC');
        this.canPlace = true;
        this.levelClosed = false;
        this.lastPointerDown = false;
        this.rangeCircle = this.add.graphics();

        // Initialize managers
        this.towerManager = new TowerManager(this);
        this.towerManager.createAnimations();
        this.createProjectileAnimations();
        
        this.enemyManager = new EnemyManager(this);
        this.enemyManager.createAnimations();
        
        this.mapManager = this.scene.get('MapManager');
        this.waveManager = new WaveManager(this, this.enemyManager);
        this.player = data.player;
        this.sceneL = data.sceneL;
        this.timeManager = new TimeManager();

        // Setup path after mapManager is ready
        this.time.delayedCall(500, () => {
            if (this.mapManager?.worldPath) {
                this.path = this.mapManager.worldPath;
                this.waveManager.setPath(this.path);
                this.waveManager.initialize(this.waveText, this.path);
            }
        });

        this.grid = this.mapManager.drawGrid(this.scale.width, this.scale.height);
        this.highlighter = this.add.graphics().setDepth(1);

        // Setup UI
        this.setupUI();
    }

    setupUI() {
        const { width, height } = this.scale;
        const uiY = height - 49;

        this.add.image(width / 2, uiY, 'UI').setScale(1.7);
        this.setupHealthDisplay(250, uiY + 10);
        this.setupStatusTexts(width / 2, uiY + 10);
        this.setupInventory(width, height);
        this.setupButtons(width, height);
        this.setupPauseSystem();

        this.updateUI();
        this.time.addEvent({
            delay: this.player.incInterval,
            loop: true,
            callback: () => this.player?.income?.()
        });
        this.waveManager.startWaveCycle(this, 10, 10000, 30000, 8);
    }

    setupHealthDisplay(x, y) {
        this.hpMax = 20;
        this.hpFrameX = x;
        this.hpFrameY = y;
        
        this.add.image(x, y, 'UIHP').setDepth(2);
        
        this.hpRadius = 39; // 78 / 2
        this.hpContainer = this.add.container(0, 0).setDepth(1);
        this.hpFill = this.add.graphics();
        this.hpContainer.add(this.hpFill);

        // Create circular mask for HP display
        const maskShape = this.add.graphics();
        maskShape.fillStyle(0xffffff);
        maskShape.fillCircle(x, y, this.hpRadius);
        maskShape.setVisible(false);
        this.hpContainer.setMask(maskShape.createGeometryMask());
        
        this.healthText = this.add.text(x, y, '', {
            fontSize: '16px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(3);
    }

    setupStatusTexts(centerX, y) {
        this.goldText = this.add.text(centerX - 250, y, '', {
            fontSize: '20px', color: '#ffd700', fontStyle: 'bold'
        }).setDepth(3);

        this.timerText = this.add.text(centerX, y, '', {
            fontSize: '20px', color: '#ffffff'
        }).setOrigin(0.5).setDepth(3);

        this.waveText = this.add.text(centerX + 150, y, '', {
            fontSize: '20px', color: '#64d5ff'
        }).setDepth(3);
    }

    setupInventory(width, height) {
        this.inventoryImage = this.add.image(width - 430, height - 340, 'Inventory')
            .setOrigin(0).setDepth(50).setVisible(false);
        this.towerIcons = this.add.group();

        this.inventoryManager = new InventoryManager(this, this.towerManager, this.sceneL.player.inventory);
        this.inventoryManager.initialize(this.inventoryImage, this.towerIcons);
        this.inventoryManager.setTowerSelectedCallback(() => {
            this.canPlace = false;
            this.time.delayedCall(100, () => this.canPlace = true);
        });

        this.waveManager.setOnGameCompleteCallback(() => this.endLevel('win'));
    }

    setupButtons(width, height) {
        const startY = height - 80;
        const rightStart = width - 340;

        // Purchase button
        this.createButton(20, startY, 'Purchase Tower\n50 g', () => {
            if (this.player?.gold >= 50) {
                this.player.updateGold(-50);
                const tower = this.towerManager.getRandomTowerIndex();
                this.inventoryManager.addTower(tower);
                this.inventoryManager.updateInventoryUI();
            }
        });

        // Merge/Win button
        this.createButton(rightStart, startY, 'Merge', () => this.endLevel('win'));

        // Inventory button
        this.createButton(rightStart + 170, startY, 'Inventory', () => {
            this.inventoryManager?.toggleInventory?.();
        });

        // Control buttons
        const controlY = 10;
        this.add.image(rightStart + 200, controlY, 'pausebutton')
            .setOrigin(0.5, 0).setScale(0.1).setInteractive({ useHandCursor: true }).setDepth(60)
            .on('pointerdown', () => this.toggleSimplePause());

        this.add.image(rightStart + 300, controlY, 'sidebar')
            .setOrigin(0.5, 0).setScale(0.2).setInteractive({ useHandCursor: true }).setDepth(60)
            .on('pointerdown', () => this.togglePauseMenu());
    }

    setupPauseSystem() {
        const { width, height } = this.scale;
        this.pauseOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
            .setOrigin(0.5).setDepth(200).setVisible(false);

        this.pauseText = this.add.text(width / 2, height / 2 - 100, 'PAUSE', {
            fontSize: '120px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(201).setVisible(false);

        const centerX = width / 2;
        const baseY = height / 2 + 50;
        
        this.pauseButtons = [
            this.createPauseButton(centerX, baseY, 'Resume', () => this.togglePauseMenu()),
            this.createPauseButton(centerX, baseY + 80, 'Main Menu', () => this.endLevel('return'))
        ];
    }

    createButton(x, y, label, onClick, width = 160, height = 80) {
        const bg = this.add.rectangle(x, y, width, height, 0x000000)
            .setOrigin(0).setStrokeStyle(2, 0xffffff).setInteractive({ useHandCursor: true }).setDepth(60);
        
        this.add.text(x + width / 2, y + height / 2, label, {
            fontSize: '16px', color: '#ffffff', fontStyle: 'bold', align: 'center'
        }).setOrigin(0.5).setDepth(61);

        bg.on('pointerover', () => bg.setFillStyle(0x222222));
        bg.on('pointerout', () => bg.setFillStyle(0x000000));
        bg.on('pointerdown', onClick);
    }

    createPauseButton(x, y, label, onClick, width = 200, height = 60) {
        const bg = this.add.rectangle(x, y, width, height, 0x333333)
            .setOrigin(0.5).setStrokeStyle(2, 0xffffff).setInteractive({ useHandCursor: true }).setDepth(202).setVisible(false);
        
        const text = this.add.text(x, y, label, {
            fontSize: '18px', color: '#ffffff', fontStyle: 'bold', align: 'center'
        }).setOrigin(0.5).setDepth(202).setVisible(false);

        bg.on('pointerover', () => bg.setFillStyle(0x555555));
        bg.on('pointerout', () => bg.setFillStyle(0x333333));
        bg.on('pointerdown', onClick);

        return {
            bg, text,
            setVisible: (v) => { bg.setVisible(v); text.setVisible(v); }
        };
    }

    createProjectileAnimations() {
        this.anims.create({
            key: 'Susanoo_Stripe_projectile',
            frames: this.anims.generateFrameNumbers('Susanoo_Stripe', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
    }

    togglePause() {
        this.timeManager.togglePause();
        const isPaused = this.timeManager.isPaused();
        this.time.paused = isPaused;
        
        if (isPaused) {
            this.enemyManager?.pause?.();
            this.towerManager?.pause?.();
        } else {
            this.enemyManager?.resume?.();
            this.towerManager?.resume?.();
        }
    }

    toggleSimplePause() {
        this.togglePause();
        const isPaused = this.timeManager.isPaused();
        this.pauseOverlay?.setVisible(isPaused);
        this.pauseText?.setVisible(isPaused);
    }

    togglePauseMenu() {
        this.togglePause();
        const isPaused = this.timeManager.isPaused();
        this.pauseOverlay?.setVisible(isPaused);
        this.pauseButtons?.forEach(btn => btn.setVisible(isPaused));
    }

    endLevel(result) {
        if (this.levelClosed) return;
        this.levelClosed = true;
        this.towerManager?.activeTowers?.clear?.(true, true);
        this.sceneL?.closeLevel?.(result, this.timeManager.getTime().toFixed(2));
    }

    update(time, delta) {
        if (this.levelClosed) return;
        
        this.timeManager?.update?.(delta);
        this.updateUI();

        // Check if player lost
        if (this.player?.isHealthZero?.() && !this.levelClosed) {
            this.time.delayedCall(10, () => this.endLevel('lose'));
            return;
        }

        if (this.timeManager?.isPaused?.()) return;
        
        this.handleTowerPlacement();
        this.updateGameEntities(time, delta);
    }

    handleTowerPlacement() {
        this.highlighter.clear();
        this.rangeCircle.clear();

        const pointer = this.input.activePointer;
        if (pointer.y >= this.scale.height - 96) return;

        const gridX = Math.floor(pointer.x / 64) * 64;
        const gridY = Math.floor(pointer.y / 64) * 64;

        if (this.towerManager.hasSelectedTower()) {
            this.drawTowerPlacementUI(gridX, gridY, pointer);
        } else {
            this.highlighter.fillStyle(0xffffff, 0.3);
            this.highlighter.fillRect(gridX, gridY, 64, 64);
        }
    }

    drawTowerPlacementUI(gridX, gridY, pointer) {
        const stats = this.towerManager.getSelectedTowerStats();
        if (!stats) return;

        const canPlace = this.isPlacementValid(gridX, gridY);
        const color = canPlace ? 0x00ff00 : 0xff0000;

        this.highlighter.fillStyle(color, 0.4);
        this.highlighter.fillRect(gridX, gridY, 64, 64);

        const centerX = gridX + 32;
        const centerY = gridY + 32;
        const rangePixels = stats[2] * 64;

        this.rangeCircle.lineStyle(2, canPlace ? 0x00ffff : 0xff0000, 0.6);
        this.rangeCircle.strokeCircle(centerX, centerY, rangePixels);
        this.rangeCircle.setDepth(5);

        // Cancel placement
        if (pointer.rightButtonDown() || Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.towerManager.deselectTower();
            this.rangeCircle.clear();
            return;
        }

        // Place tower
        if (pointer.isDown && !this.lastPointerDown && this.canPlace && canPlace) {
            const selected = this.towerManager.getSelectedTower();
            this.towerManager.createTower(selected, gridX, gridY);
            this.inventoryManager.removeTower(selected);
            this.towerManager.deselectTower();
            this.rangeCircle.clear();
            this.canPlace = false;
            this.inventoryManager.updateInventoryUI();
        }
    }

    updateGameEntities(time, delta) {
        this.towerManager?.activeTowers?.children?.iterate?.(tower => 
            tower?.update?.(time, delta)
        );

        this.enemyManager?.activeEnemies?.children?.iterate?.(enemy => 
            enemy?.update?.(time, delta)
        );

        this.lastPointerDown = this.input.activePointer.isDown;
    }

    isPlacementValid(gridX, gridY) {
        const col = Math.floor(gridX / 64);
        const row = Math.floor(gridY / 64);

        // Validate map data exists
        if (!this.mapManager?.levelData) return false;

        const { mapData, decoData } = this.mapManager.levelData;

        // Bounds check - properly check for undefined without treating 0 as falsy
        if (mapData[row] === undefined || mapData[row][col] === undefined) return false;

        // Only allow placement on grass (0)
        if (mapData[row][col] !== 0) return false;

        // No decorations
        if (decoData[row][col] !== 0) return false;

        // Check tower collision
        return !this.towerManager.activeTowers.getChildren().some(t => {
            const tCol = Math.floor(t.x / 64);
            const tRow = Math.floor((t.y + 20) / 64);
            return tCol === col && tRow === row;
        });
    }

    updateUI() {
        if (!this.player) return;
        this.goldText?.setText?.(`Gold: ${this.player.gold}`);
        this.timerText?.setText?.(`Time: ${this.timeManager.getTime().toFixed(2)}s`);
        this.waveManager?.updateWaveText?.();
        this.updateHealthCircle(this.player.playerHealth);
    }

    updateHealthCircle(hp) {
        const percent = Phaser.Math.Clamp(hp / this.hpMax, 0, 1);
        const fillHeight = (this.hpRadius * 2) * percent;

        this.hpFill.clear();
        this.hpFill.fillStyle(0xCD1C18, 1);
        this.hpFill.fillRect(
            this.hpFrameX - this.hpRadius,
            (this.hpFrameY + this.hpRadius) - fillHeight,
            this.hpRadius * 2,
            fillHeight
        );
        this.healthText?.setText?.(`${hp} / ${this.hpMax}`);
    }
}