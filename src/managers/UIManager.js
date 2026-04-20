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
        TowerManager.physicalData.forEach(tower => {
            this.load.spritesheet(tower[0], `assets/tower/${tower[0]}.png`, {
                frameWidth: 64,
                frameHeight: 64
            });
            this.load.image(`${tower[0]}_Icon`, `assets/tower/TowerIcon/${tower[0]}_Icon.png`);
        });

        EnemyManager.testData.forEach(enemy => {
            this.load.spritesheet(enemy[0], `assets/Enemies/${enemy[0]}.png`, {
                frameWidth: 64,
                frameHeight: 64
            });
        });

        // Load ability stripes as spritesheets for projectiles
        this.load.spritesheet('Susanoo_Stripe', 'assets/Abilities/susanoo_water.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.image('UI', 'assets/UI/UI.png');
        this.load.image('UIHP', 'assets/UI/UIHP.png');
        this.load.image('Inventory', 'assets/UI/Inventory.png');
        this.load.image('pausebutton', 'assets/UI/pausebutton.png');
        this.load.image('sidebar', 'assets/UI/sidebar.png');
        this.load.image('Pedestal', 'assets/Tower Placement/tower_placement.png');
    }

    create(data) {
        this.input.mouse.disableContextMenu();
        this.escKey = this.input.keyboard.addKey('ESC');
        this.canPlace = true;
        this.levelClosed = false;
        this.time.paused = false;
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

        // Setup grid and graphics
        this.time.delayedCall(500, () => {
            this.path = this.mapManager.worldPath;
            this.waveManager.setPath(this.path);
        });

        this.grid = this.mapManager.drawGrid(this.scale.width, this.scale.height);
        this.highlighter = this.add.graphics().setDepth(1);

        // Setup all UI systems
        this.setupUIElements();
        this.setupBottomButtons();
        this.setupPauseSystem();
        this.setupGameEvents();
    }

    setupUIElements() {
        const width = this.scale.width;
        const height = this.scale.height;
        const uiX = width / 2;
        const uiY = height - 49;

        this.add.image(uiX, uiY, 'UI').setScale(1.7);
        this.setupHealthDisplay(uiX, uiY);
        this.setupStatusTexts(uiX, uiY);
        this.setupInventory(width, height);
    }

    setupHealthDisplay(uiX, uiY) {
        this.hpMax = 20;
        this.hpFrameX = 250;
        this.hpFrameY = uiY + 10;
        
        this.add.image(this.hpFrameX, this.hpFrameY, 'UIHP').setDepth(2);
        this.hpRadius = 78 / 2;
        this.hpContainer = this.add.container(0, 0).setDepth(1);
        this.hpFill = this.add.graphics();
        this.hpContainer.add(this.hpFill);

        this.hpMaskShape = this.add.graphics();
        this.hpMaskShape.fillStyle(0xffffff);
        this.hpMaskShape.fillCircle(this.hpFrameX, this.hpFrameY, this.hpRadius);
        this.hpMaskShape.setVisible(false);

        const mask = this.hpMaskShape.createGeometryMask();
        this.hpContainer.setMask(mask);
        
        this.healthText = this.add.text(this.hpFrameX, this.hpFrameY, '', {
            fontSize: '16px', color: '#000', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(3);
    }

    setupStatusTexts(uiX, uiY) {
        this.goldText = this.add.text(uiX - 250, uiY + 10, '', {
            fontSize: '20px', color: '#ffd700', fontStyle: 'bold'
        }).setDepth(3);

        this.timerText = this.add.text(uiX, uiY + 10, '', {
            fontSize: '20px', color: '#ffffff'
        }).setOrigin(0.5).setDepth(3);

        this.waveText = this.add.text(uiX + 150, uiY + 10, '', {
            fontSize: '20px', color: '#64d5ff'
        }).setDepth(3);

        this.waveManager.initialize(this.waveText, this.path);
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

        this.waveManager.setOnGameCompleteCallback(() => {
            if (!this.levelClosed) {
                this.levelClosed = true;
                this.time.delayedCall(50, () => {
                    this.towerManager.activeTowers.clear(true, true);
                    this.sceneL.closeLevel('win', this.timeManager.getTime().toFixed(2));
                });
            }
        });
    }

    createProjectileAnimations() {
        // Create animation for Susanoo water ball projectile
        this.anims.create({
            key: 'Susanoo_Stripe_projectile',
            frames: this.anims.generateFrameNumbers('Susanoo_Stripe', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
    }

    setupBottomButtons() {
        const width = this.scale.width;
        const height = this.scale.height;
        const startY = height - 80;
        const rightStartX = width - 340;

        this.createButton(20, startY, 'Purchase Tower\n50 g', () => {
            if (this.player.gold >= 50) {
                this.player.updateGold(-50);
                const rolledTower = this.towerManager.getRandomTowerIndex();
                this.inventoryManager.addTower(rolledTower);
                this.inventoryManager.updateInventoryUI();
            }
        });

        this.createButton(rightStartX, startY, 'Merge', () => {
            if(!this.levelClosed){
                this.levelClosed = true;
                this.towerManager.activeTowers.clear(true, true);
                this.sceneL.closeLevel('win', this.timeManager.getTime().toFixed(2));
            }
        });

        this.createButton(rightStartX + 170, startY, 'Inventory', () => {
            this.inventoryManager.toggleInventory();
        });

        this.setupControlButtons(rightStartX);
    }

    setupControlButtons(rightStartX) {
        const pauseBtn = this.add.image(rightStartX + 200, 10, 'pausebutton')
            .setOrigin(0.5, 0).setScale(0.1).setInteractive({ useHandCursor: true }).setDepth(60);
        pauseBtn.on('pointerdown', () => this.toggleSimplePause());

        const sidebarBtn = this.add.image(rightStartX + 300, 10, 'sidebar')
            .setOrigin(0.5, 0).setScale(0.2).setInteractive({ useHandCursor: true }).setDepth(60);
        sidebarBtn.on('pointerdown', () => this.togglePauseMenu());
    }

    setupPauseSystem() {
        this.pauseOverlay = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0.7)
            .setOrigin(0.5).setDepth(200).setVisible(false);

        this.pauseText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'PAUSE', {
            fontSize: '120px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(201).setVisible(false);

        const centerX = this.scale.width / 2;
        const baseY = this.scale.height / 2 + 50;
        this.pauseButtons = [];
        
        this.pauseButtons.push(this.createPauseButton(centerX, baseY, 'Resume', () => this.togglePauseMenu()));
        this.pauseButtons.push(this.createPauseButton(centerX, baseY + 80, 'Main Menu', () => {
            if (!this.levelClosed) {
                this.levelClosed = true;
                this.towerManager.activeTowers.clear(true, true);
                this.sceneL.closeLevel('return', 0);
            }
        }));
    }

    setupGameEvents() {
        this.updateUI();
        this.time.addEvent({
            delay: this.player.incInterval, 
            loop: true,
            callback: () => this.player.income()
        });
        this.waveManager.startWaveCycle(this, 5, 2000, 10000, 3);
    }

    createButton(x, y, label, onClick, width = 160, height = 80) {
        const bg = this.add.rectangle(x, y, width, height, 0x000000)
            .setOrigin(0).setStrokeStyle(2, 0xffffff).setInteractive({ useHandCursor: true }).setDepth(60);
        const text = this.add.text(x + width / 2, y + height / 2, label, {
            fontSize: '16px', color: '#ffffff', fontStyle: 'bold', align: 'center'
        }).setOrigin(0.5).setDepth(61);

        bg.on('pointerover', () => bg.setFillStyle(0x222222));
        bg.on('pointerout', () => bg.setFillStyle(0x000000));
        bg.on('pointerdown', onClick);
        return { bg, text };
    }

    createButtonWithText(x, y, label, onClick, width = 160, height = 80) {
        const bg = this.add.rectangle(x, y, width, height, 0x333333)
            .setOrigin(0.5).setStrokeStyle(2, 0xffffff).setInteractive({ useHandCursor: true });
        const text = this.add.text(x, y, label, {
            fontSize: '18px', color: '#ffffff', fontStyle: 'bold', align: 'center'
        }).setOrigin(0.5);

        bg.on('pointerover', () => bg.setFillStyle(0x555555));
        bg.on('pointerout', () => bg.setFillStyle(0x333333));
        bg.on('pointerdown', onClick);
        return { bg, text };
    }

    createPauseButton(x, y, label, onClick, width = 200, height = 60) {
        const btn = this.createButtonWithText(x, y, label, onClick, width, height);
        btn.bg.setDepth(202).setVisible(false);
        btn.text.setDepth(202).setVisible(false);
        btn.setVisible = (v) => {
            btn.bg.setVisible(v);
            btn.text.setVisible(v);
        };
        return btn;
    }

    togglePause() {
        this.timeManager.togglePause();
        const isPaused = this.timeManager.isPaused();
        this.time.paused = isPaused;
        
        if (isPaused) {
            this.enemyManager.pause();
            this.towerManager.pause();
        } else {
            this.enemyManager.resume();
            this.towerManager.resume();
        }
    }

    toggleSimplePause() {
        this.togglePause();
        const isPaused = this.timeManager.isPaused();
        this.pauseOverlay.setVisible(isPaused);
        this.pauseText.setVisible(isPaused);
    }

    togglePauseMenu() {
        this.togglePause();
        const isPaused = this.timeManager.isPaused();
        this.pauseOverlay.setVisible(isPaused);
        this.pauseButtons.forEach(btn => btn.setVisible(isPaused));
    }

    update(time, delta) {
        if (this.levelClosed) return;
        this.timeManager.update(delta);
        this.updateUI();

        if (this.player.isHealthZero() && !this.levelClosed) {
            this.levelClosed = true;
            this.time.delayedCall(10, () => {
                this.towerManager.activeTowers.clear(true, true);
                this.sceneL.closeLevel('lose', this.timeManager.getTime().toFixed(2));
            });
        }

        if (this.timeManager.isPaused()) return;
        this.handleTowerPlacement();
        this.updateGameEntities(time, delta);
    }

    handleTowerPlacement() {
        this.highlighter.clear();
        this.rangeCircle.clear();

        const pointer = this.input.activePointer;
        if (pointer.y < this.scale.height - 96) {
            const gridX = Math.floor(pointer.x / 64) * 64;
            const gridY = Math.floor(pointer.y / 64) * 64;

            if (this.towerManager.hasSelectedTower()) {
                this.drawTowerPlacementUI(gridX, gridY, pointer);
            } else {
                this.highlighter.fillStyle(0xffffff, 0.3);
            }
            this.highlighter.fillRect(gridX, gridY, 64, 64);
        }
    }

    drawTowerPlacementUI(gridX, gridY, pointer) {
        this.highlighter.fillStyle(0x00ff00, 0.4);

        const towerStats = this.towerManager.getSelectedTowerStats();
        if (towerStats) {
            const range = towerStats[2];
            const rangePixels = range * 64;
            const centerX = gridX + 32;
            const centerY = gridY + 32;
            
            this.rangeCircle.lineStyle(2, 0x00ffff, 0.6);
            this.rangeCircle.strokeCircle(centerX, centerY, rangePixels);
            this.rangeCircle.setDepth(5);
        }

        if (pointer.rightButtonDown() || Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.towerManager.deselectTower();
            this.rangeCircle.clear();
            return;
        }

        if (pointer.isDown && !this.lastPointerDown && this.canPlace) {
            this.towerManager.createTower(this.towerManager.getSelectedTower(), gridX, gridY);
            this.inventoryManager.removeTower(this.towerManager.getSelectedTower());
            this.towerManager.deselectTower();
            this.rangeCircle.clear();
            this.canPlace = false;
            this.inventoryManager.updateInventoryUI();
        }
    }

    updateGameEntities(time, delta) {
        this.towerManager.activeTowers.children.iterate(tower => {
            if (tower && tower.update) tower.update(time, delta);
        });

        this.enemyManager.activeEnemies.children.iterate(enemy => {
            if (enemy && enemy.update) enemy.update(time, delta);
        });

        this.lastPointerDown = this.input.activePointer.isDown;
    }

    updateUI() {
        if (!this.player) return;
        this.goldText.setText(`Gold: ${this.player.gold}`);
        this.timerText.setText(`Time: ${this.timeManager.getTime().toFixed(2)}s`);
        this.waveManager.updateWaveText();
        this.updateHealthCircle(this.player.playerHealth);
    }

    updateHealthCircle(currentHP) {
        const centerX = this.hpFrameX;
        const centerY = this.hpFrameY;
        const radius = this.hpRadius;

        let healthPercent = Phaser.Math.Clamp(currentHP / this.hpMax, 0, 1);
        this.hpFill.clear();
        const totalHeight = radius * 2;
        const fillHeight = totalHeight * healthPercent;

        this.hpFill.fillStyle(0xCD1C18, 1);
        this.hpFill.fillRect(
            centerX - radius,
            (centerY + radius) - fillHeight,
            radius * 2,
            fillHeight
        );
        this.healthText.setText(`${currentHP} / ${this.hpMax}`);
    }
}