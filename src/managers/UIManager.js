import TimeManager from './TimeManager.js';
import TowerManager from './TowerManager.js';
import EnemyManager from './EnemyManager.js';
import WaveManager from './WaveManager.js';
import InventoryManager from './InventoryManager.js';
import AudioManager from './AudioManager.js';
import { AssetConfig } from '../config/AssetConfig.js';
import { UIConfig } from '../config/UIConfig.js';

export default class UIManager extends Phaser.Scene {
    constructor() {
        super({ key: 'UIManager' });
    }

    preload() {
        // Delegate asset loading to respective managers
        const tempTowerManager = new TowerManager(this);
        tempTowerManager.preloadAssets();
        
        const tempEnemyManager = new EnemyManager(this);
        tempEnemyManager.preloadAssets();

        // Load UI assets from config
        AssetConfig.uiAssets.forEach(asset => {
            if (asset.type === 'spritesheet') {
                this.load.spritesheet(asset.name, asset.path, { frameWidth: asset.frameWidth, frameHeight: asset.frameHeight });
            } else {
                this.load.image(asset.name, asset.path);
            }
        });

        // Load audio assets and create AudioManager (only once)
        if (!this.audioManager) {
            this.audioManager = new AudioManager(this);
            this.audioManager.preloadAudio();
        }
    }

    create(data) {
        // Validate data
        if (!data.player || !data.sceneL) {
            console.error("UIManager: Missing player or sceneL in data");
            return;
        }

        this.events.once('shutdown', this.cleanup, this);
        this.events.once('destroy', this.cleanup, this);
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
        this.towerManager.createProjectileAnimations();
        
        this.enemyManager = new EnemyManager(this);
        this.enemyManager.createAnimations();
        
        this.mapManager = this.scene.get('MapManager');
        this.waveManager = new WaveManager(this, this.enemyManager);
        this.player = data.player;
        this.sceneL = data.sceneL;
        this.timeManager = new TimeManager();

        // Pass audioManager to player for health loss sounds
        this.player.audioManager = this.audioManager;
        console.log("✓ AudioManager initialized for UIManager");
        
        // Play level music
        this.audioManager.playLevelMusic();
        
        this.grid = this.mapManager.drawGrid(this.scale.width, this.scale.height);
        this.highlighter = this.add.graphics().setDepth(1);

        // Setup UI
        this.setupUI();
        this.waitForMapReady();
    }

    waitForMapReady() {
        const pathReady = this.mapManager?.worldPath?.length;
        const waveDataReady = this.sceneL?.constructor?.waveData?.length;

        if (pathReady && waveDataReady) {
            this.path = this.mapManager.worldPath;
            this.waveManager.setWaveData(
                this.sceneL.constructor.waveData,
                this.sceneL.constructor.waveData.length
            );

            this.waveManager.setPath(this.path);
            this.waveManager.initialize(this.waveText, this.path);

            console.log("✓ Path + WaveData initialized");

            this.time.paused = false;
            this.timeManager.resume();
            this.waveManager.reset();

            if (!this.waveManager.cycleRunning) {
                this.waveManager.startWaveCycle(this, 10000, 20000, 8);
            }            
            } 
            else {
                this.time.delayedCall(50, () => this.waitForMapReady());
        }
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
    }

    setupHealthDisplay(x, y) {
        this.add.image(x, y, 'UIHP').setDepth(2);
        this.player.setupHealthDisplay(UIConfig, this, x, y);
    }

    setupStatusTexts(centerX, y) {
        this.goldText = this.add.text(centerX - 250, y, '', UIConfig.fonts.goldText).setDepth(3);
        this.timerText = this.add.text(centerX, y, '', UIConfig.fonts.timerText).setOrigin(0.5).setDepth(3);
        this.waveText = this.add.text(centerX + 150, y, '', UIConfig.fonts.waveText).setDepth(3);
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
        this.createControlButton(rightStart + 200, controlY, 'pausebutton', () => this.toggleSimplePause(), true);
        this.createSpeedButton(rightStart + 100, controlY);
        this.createControlButton(rightStart + 300, controlY, 'sidebar', () => this.toggleSidebarMenu());

        this.setupSidebarMenu(width, height);
    }

    // Create a control button (like pause, sidebar, etc.)
    createControlButton(x, y, assetKey, onClick, isImage = false) {
        const btn = isImage
            ? this.add.image(x, y, assetKey).setOrigin(0.5, 0).setScale(0.1)
            : this.add.image(x, y, assetKey).setOrigin(0.5, 0).setScale(0.2);
        
        btn.setInteractive({ useHandCursor: true }).setDepth(UIConfig.depths.ui).on('pointerdown', onClick);
        return btn;
    }

    // Create speed button with text display
    createSpeedButton(x, y) {
        this.speedButtonBg = this.add.rectangle(x, y, UIConfig.buttons.speedButton.width, UIConfig.buttons.speedButton.height, UIConfig.colors.buttonBg)
            .setOrigin(0.5, 0).setStrokeStyle(2, UIConfig.colors.white).setInteractive({ useHandCursor: true }).setDepth(UIConfig.depths.ui);
        
        this.speedButtonText = this.add.text(x, y + 20, '1x', UIConfig.fonts.statusText)
            .setOrigin(0.5).setDepth(UIConfig.depths.uiText);

        this.speedButtonBg.on('pointerover', () => this.speedButtonBg.setFillStyle(UIConfig.colors.buttonHover));
        this.speedButtonBg.on('pointerout', () => this.speedButtonBg.setFillStyle(UIConfig.colors.buttonBg));
        this.speedButtonBg.on('pointerdown', () => this.cycleGameSpeed());

        return { bg: this.speedButtonBg, text: this.speedButtonText };
    }

    setupPauseSystem() {
        const { width, height } = this.scale;
        this.pauseOverlay = this.add.rectangle(width / 2, height / 2, width, height, UIConfig.colors.black, 0.7)
            .setOrigin(0.5).setDepth(UIConfig.depths.modal).setVisible(false);

        this.pauseText = this.add.text(width / 2, height / 2 - 100, 'PAUSE', UIConfig.fonts.title)
            .setOrigin(0.5).setDepth(UIConfig.depths.modalBg).setVisible(false);

        const centerX = width / 2;
        const baseY = height / 2 + 50;
        
        this.pauseButtons = [
            this.createPauseButton(centerX, baseY, 'Resume', () => this.togglePauseMenu()),
            this.createPauseButton(centerX, baseY + 80, 'Main Menu', () => this.endLevel('return'))
        ];
    }

    setupSidebarMenu(width, height) {
        const centerX = width / 2;
        const centerY = height / 2;

        // Overlay and background
        this.sidebarOverlay = this.add.rectangle(centerX, centerY, width, height, UIConfig.colors.black, 0.7)
            .setOrigin(0.5).setDepth(UIConfig.depths.modal).setVisible(false);
        this.sidebarMenuBg = this.add.rectangle(centerX, centerY, 300, 400, UIConfig.colors.darkBg, 0.95)
            .setOrigin(0.5).setStrokeStyle(2, UIConfig.colors.primary).setDepth(UIConfig.depths.modalBg).setVisible(false);

        // Audio label
        const audioLabel = this.add.text(centerX, centerY - 160, 'AUDIO', UIConfig.fonts.label)
            .setOrigin(0.5).setDepth(UIConfig.depths.modalContent).setVisible(false);

        // Mute button
        this.sidebarMuteBtn = this.add.text(centerX + 110, centerY - 70, this.audioManager.isMuted ? '🔇' : '🔊', UIConfig.fonts.emojiButton)
            .setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(UIConfig.depths.modalContent).setVisible(false);
        
        this.sidebarMuteBtn.on('pointerdown', () => {
            this.audioManager.toggleMute();
            this.sidebarMuteBtn.setText(this.audioManager.isMuted ? '🔇' : '🔊');
        });
        this.sidebarMuteBtn.on('pointerover', () => this.sidebarMuteBtn.setStyle({ fill: UIConfig.colors.primaryLight }));
        this.sidebarMuteBtn.on('pointerout', () => this.sidebarMuteBtn.setStyle({ fill: UIConfig.colors.primary }));

        // Volume slider
        const { sliderBg, sliderHandle } = this.setupVolumeSlider(centerX, centerY);

        // Divider
        const divider = this.add.graphics().setDepth(UIConfig.depths.modalContent).setVisible(false);
        divider.lineStyle(1, UIConfig.colors.primary, 0.5);
        divider.lineBetween(centerX - 120, centerY + 10, centerX + 120, centerY + 10);

        // Buttons
        const { btn: resumeBtn, txt: resumeText } = this.createSidebarButton(centerX, centerY + 50, 'Resume', () => this.toggleSidebarMenu());
        const { btn: menuBtn, txt: menuText } = this.createSidebarButton(centerX, centerY + 130, 'Main Menu', () => this.endLevel('return'));

        this.sidebarMenuElements = [
            this.sidebarOverlay, this.sidebarMenuBg, audioLabel, this.sidebarMuteBtn,
            sliderBg, sliderHandle, divider, resumeBtn, resumeText, menuBtn, menuText
        ];
    }

    updateSidebarMenuDisplay() {
        if (this.audioManager.isMuted) {
            this.sidebarSliderInfo.handle.setFillStyle(UIConfig.colors.mutedGray);
            this.sidebarSliderInfo.bg.setStrokeStyle(2, UIConfig.colors.mutedGray);
        } else {
            this.sidebarSliderInfo.handle.setFillStyle(UIConfig.colors.primary);
            this.sidebarSliderInfo.bg.setStrokeStyle(2, UIConfig.colors.primary);
        }
    }

    // Helper: Create a sidebar button
    createSidebarButton(centerX, y, label, onDown, bgColor = UIConfig.colors.buttonBg) {
        const btn = this.add.rectangle(centerX, y, UIConfig.buttons.sidebarButton.width, UIConfig.buttons.sidebarButton.height, bgColor)
            .setOrigin(0.5).setStrokeStyle(2, UIConfig.colors.white).setInteractive({ useHandCursor: true }).setDepth(UIConfig.depths.modalContent).setVisible(false);
        const txt = this.add.text(centerX, y, label, UIConfig.fonts.buttonLarge)
            .setOrigin(0.5).setDepth(UIConfig.depths.modalHandle).setVisible(false);
        btn.on('pointerover', () => btn.setFillStyle(UIConfig.colors.buttonHover));
        btn.on('pointerout', () => btn.setFillStyle(bgColor));
        btn.on('pointerdown', onDown);
        return { btn, txt };
    }

    // Helper: Setup volume slider
    setupVolumeSlider(centerX, centerY) {
        const sliderX = centerX - 30;
        const sliderY = centerY - 70;
        const sliderWidth = UIConfig.slider.width;
        const sliderHeight = UIConfig.slider.height;

        const sliderBg = this.add.rectangle(sliderX, sliderY, sliderWidth, sliderHeight, UIConfig.slider.bgColor)
            .setOrigin(0.5).setStrokeStyle(2, UIConfig.colors.primary).setDepth(UIConfig.depths.modalContent).setVisible(false);

        const handleX = sliderX - (sliderWidth / 2) + (this.audioManager.getVolume() * sliderWidth);
        const sliderHandle = this.add.circle(handleX, sliderY, UIConfig.slider.handleRadius, UIConfig.slider.primaryColor)
            .setInteractive({ useHandCursor: true }).setDepth(UIConfig.depths.modalHandle).setVisible(false);

        this.sidebarSliderInfo = { bg: sliderBg, handle: sliderHandle, sliderX, sliderY, sliderWidth, sliderHeight };

        // Volume update handler
        const updateVolume = (newX) => {
            const clampedX = Phaser.Math.Clamp(newX, sliderX - sliderWidth / 2, sliderX + sliderWidth / 2);
            sliderHandle.setX(clampedX);
            const newVolume = (clampedX - (sliderX - sliderWidth / 2)) / sliderWidth;
            this.audioManager.setVolume(newVolume);
            this.updateSidebarMenuDisplay();
        };

        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown && sliderHandle.active && sliderHandle.visible) {
                updateVolume(pointer.x);
            }
        });

        sliderBg.setInteractive({ useHandCursor: true });
        sliderBg.on('pointerdown', (pointer) => updateVolume(pointer.x));

        return { sliderBg, sliderHandle };
    }

    toggleSidebarMenu() {
        this.togglePause();
        const isVisible = this.sidebarMenuBg?.visible ?? false;
        this.sidebarMenuElements?.forEach(element => element?.setVisible?.(!isVisible));
        this.updateSidebarMenuDisplay();
    }

    createButton(x, y, label, onClick, width = 160, height = 80) {
        const bg = this.add.rectangle(x, y, width, height, UIConfig.colors.black)
            .setOrigin(0).setStrokeStyle(2, UIConfig.colors.white).setInteractive({ useHandCursor: true }).setDepth(UIConfig.depths.ui);
        
        this.add.text(x + width / 2, y + height / 2, label, UIConfig.fonts.buttonSmall)
            .setOrigin(0.5).setDepth(UIConfig.depths.uiText);

        bg.on('pointerover', () => bg.setFillStyle(0x222222));
        bg.on('pointerout', () => bg.setFillStyle(UIConfig.colors.black));
        bg.on('pointerdown', onClick);
    }

    createPauseButton(x, y, label, onClick, width = 200, height = 60) {
        const bg = this.add.rectangle(x, y, width, height, UIConfig.colors.buttonBg)
            .setOrigin(0.5).setStrokeStyle(2, UIConfig.colors.white).setInteractive({ useHandCursor: true }).setDepth(UIConfig.depths.modalContent).setVisible(false);
        
        const text = this.add.text(x, y, label, UIConfig.fonts.buttonLarge)
            .setOrigin(0.5).setDepth(UIConfig.depths.modalContent).setVisible(false);

        bg.on('pointerover', () => bg.setFillStyle(UIConfig.colors.buttonHover));
        bg.on('pointerout', () => bg.setFillStyle(UIConfig.colors.buttonBg));
        bg.on('pointerdown', onClick);

        return {
            bg, text,
            setVisible: (v) => { bg.setVisible(v); text.setVisible(v); }
        };
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

    cycleGameSpeed() {
        const newSpeed = this.timeManager.cycleSpeed();
        this.speedButtonText.setText(`${newSpeed}x`);
    }

    endLevel(result) {
        if (this.levelClosed) return;
        this.levelClosed = true;

        this.waveManager?.stop?.(); 
        this.cleanup();

        this.sceneL?.closeLevel?.(
            result,
            this.timeManager.getTime().toFixed(2),
            this.player.gainGold,
            this.player.spentGold,
            this.player.playerHealth
        );
    }

    update(time, delta) {
        if (this.levelClosed) return;
        this.timeManager?.update?.(delta);
        const scaledDelta = this.timeManager.getScaledDelta(delta);
        this.updateUI();

        // Check if player lost
        if (this.player?.isHealthZero?.() && !this.levelClosed) {
            this.time.delayedCall(10, () => this.endLevel('lose'));
            return;
        }
        if (this.timeManager?.isPaused?.()) return;
        
        // Update wave manager with scaled delta
        this.waveManager?.update?.(scaledDelta);
        
        this.handleTowerPlacement();
        this.updateGameEntities(scaledDelta);
    }

    handleTowerPlacement() {
        this.highlighter.clear();
        this.rangeCircle.clear();

        const pointer = this.input.activePointer;
        if (pointer.y >= this.scale.height - 96) return;

        const gridX = Math.floor(pointer.x / 64) * 64;
        const gridY = Math.floor(pointer.y / 64) * 64;

        if (this.towerManager?.hasSelectedTower?.()) {
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

    updateGameEntities(scaledDelta) {
        // Convert TimeManager's internal time to milliseconds for tower compatibility
        const scaledTime = this.timeManager.getTime() * 1000;
        
        this.towerManager?.activeTowers?.children?.iterate?.(tower => 
            tower?.update?.(scaledTime, scaledDelta)
        );

        this.enemyManager?.activeEnemies?.children?.iterate?.(enemy => 
            enemy?.update?.(scaledTime, scaledDelta)
        );

        this.lastPointerDown = this.input.activePointer.isDown;
    }

    isPlacementValid(gridX, gridY) {
        const col = Math.floor(gridX / 64);
        const row = Math.floor(gridY / 64);

        // Validate map data exists
        if (!this.mapManager?.levelData) return false;

        const { mapData, decoData } = this.mapManager.levelData;
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
        this.player?.updateHealthDisplay?.();
    }



    cleanup() {
        this.waveManager?.stop?.();   
        this.time.removeAllEvents();

        this.enemyManager?.activeEnemies?.clear?.(true, true);
        this.towerManager?.activeTowers?.clear?.(true, true);

        this.highlighter?.clear?.();
        this.rangeCircle?.clear?.();

        this.inventoryManager?.destroy?.();
        this.sidebarMenuElements = null;
        this.sidebarSliderInfo = null;

        this.waveManager = null;
        this.enemyManager = null;
        this.towerManager = null;
    }
}