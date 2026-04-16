import TimeManager from '../managers/TimeManager.js';
import TowerManager from '../managers/TowerManager.js';

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

        this.load.image('UI', 'assets/UI/UI.png');
        this.load.image('UIHP', 'assets/UI/UIHP.png');
        this.load.image('Inventory', 'assets/UI/Inventory.png');
        this.load.image('Pedestal', 'assets/Tower Placement/tower_placement.png');
    }

    create(data) {
        // ------------- CONTROLS -------------
        // disable right-click menu
        this.input.mouse.disableContextMenu();
        this.escKey = this.input.keyboard.addKey('ESC');
        this.canPlace = true;
        // ------------------------------------

        this.towerManager = new TowerManager(this);

        this.towerManager.physical.forEach(stats => {
            const name = stats[0];
            const lastIdle = stats[4];
            const lastAttack = stats[5];

            this.anims.create({
                key: `${name}_idle`,
                frames: this.anims.generateFrameNumbers(name, { start: 0, end: lastIdle }),
                frameRate: 6,
                repeat: -1
            });

            this.anims.create({
                key: `${name}_attack`,
                frames: this.anims.generateFrameNumbers(name, { start: lastIdle + 1, end: lastAttack }),
                frameRate: 12,
                repeat: 0
            });
        });

        this.grid = this.add.graphics();
        this.highlighter = this.add.graphics();
        const width = this.scale.width;
        const height = this.scale.height;

        this.highlighter.setDepth(1);
        this.grid.setDepth(0);
        this.drawGrid(width, height);

        this.player = data.player;
        this.inventory = data.inventory;
        this.timeManager = new TimeManager();

        const uiX = width / 2;
        const uiY = height - 49;
        this.add.image(uiX, uiY, 'UI').setScale(1.7);

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
            fontSize: '16px',
            color: '#000',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(3);


        this.goldText = this.add.text(uiX - 250, uiY + 10, '', {
            fontSize: '20px',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setDepth(3);

        this.timerText = this.add.text(uiX, uiY + 10, '', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(3);

        this.wave = 1;
        this.waveText = this.add.text(uiX + 150, uiY + 10, '', {
            fontSize: '20px',
            color: '#64d5ff'
        }).setDepth(3);

        this.inventoryImage = this.add.image(width - 430, height - 340, 'Inventory')
            .setOrigin(0).setDepth(50).setVisible(false);
        this.towerIcons = this.add.group();

        const startY = height - 80;
        this.createButton(20, startY, 'Purchase Tower\n50 g', () => {
            if (this.player.gold >= 50) {
                this.player.updateGold(-50);

                const rolledTower = this.towerManager.getRandomTowerIndex();
                this.inventory.push({ type: rolledTower });
                console.log(`Rolled a new tower: ${rolledTower}`);

                this.updateInventoryUI();
            }
        });

        const rightStartX = width - 340;
        this.createButton(rightStartX, startY, 'Merge', () => {
        });

        this.createButton(rightStartX + 170, startY, 'Inventory', () => {
            this.toggleInventory();
        });

        this.updateUI();
        this.time.addEvent({
            delay: this.player.incInterval, // 1000ms = 1 sec
            loop: true,
            callback: () => {
                this.player.income();
            }
        });
    }

    createButton(x, y, label, onClick) {
        const bg = this.add.rectangle(x, y, 160, 80, 0x000000)
            .setOrigin(0).setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true }).setDepth(60);

        const text = this.add.text(x + 80, y + 40, label, {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5).setDepth(61);

        bg.on('pointerover', () => bg.setFillStyle(0x222222));
        bg.on('pointerout', () => bg.setFillStyle(0x000000));
        bg.on('pointerdown', onClick);
        return { bg, text };
    }

    drawGrid(width, height) {
        // grid transparent (., ., 0), change 0 to up-to 1 for solid grid
        this.grid.lineStyle(1, 0x0000ff, 0.1);

        for(var i = 0; i < ((height - 96) / 64); i++) {
            this.grid.moveTo(0, i * 64);
            this.grid.lineTo(width, i * 64);
        }

        for(var j = 0; j < (width / 64); j++) {
            this.grid.moveTo(j * 64, 0);
            this.grid.lineTo(j * 64, height);
        }

        this.grid.strokePath();
    }

    update(time, delta) {
        this.timeManager.update(delta);
        this.updateUI();

        const pointer = this.input.activePointer;
        this.highlighter.clear();

        if (pointer.y < this.scale.height - 96) {
            const gridX = Math.floor(pointer.x / 64) * 64;
            const gridY = Math.floor(pointer.y / 64) * 64;

            if (this.selectedTower) {
                this.highlighter.fillStyle(0x00ff00, 0.4);

                // --------- CANCEL Selection ----------
                // check for right click of escape key
                if (pointer.rightButtonDown() || Phaser.Input.Keyboard.JustDown(this.escKey)) {
                    this.selectedTower = null;
                    console.log("Placement Cancelled.");
                    return;
                }
                // -------------------------------------

                if (pointer.isDown && !this.lastPointerDown && this.canPlace) {
                    this.towerManager.createTower(this.selectedTower, gridX, gridY);

                    const index = this.inventory.findIndex(item => item.type === this.selectedTower);
                    if (index > -1) this.inventory.splice(index, 1);

                    this.selectedTower = null;
                    this.canPlace = false;
                    this.updateInventoryUI();
                }
            } else {
                this.highlighter.fillStyle(0xffffff, 0.3);
            }
            this.highlighter.fillRect(gridX, gridY, 64, 64);

            /* Grid outline (optional):
                this.highlighter.lineStyle(2, 0xffffff, 0.8);
                this.highlighter.strokeRect(gridX, gridY, 64, 64);
            */

            /* Auto tower placement on click:
                if (pointer.isDown && !this.lastPointerDown) {
                    this.towerManager.createTower('p0', gridX, gridY);
                }
            */
        }

        this.towerManager.activeTowers.children.iterate(tower => {
            if (tower && tower.update) tower.update(time, delta);
        });

        this.lastPointerDown = pointer.isDown;
    }

    updateUI() {
        if (!this.player) return;
        this.goldText.setText(`Gold: ${this.player.gold}`);
        
        const time = this.timeManager.getTime().toFixed(2);
        this.timerText.setText(`Time: ${time}s`);
        this.waveText.setText(`Wave: ${this.wave}`);
        this.updateHealthCircle(this.player.playerHealth);
    }

    toggleInventory() {
        const visible = !this.inventoryImage.visible;
        this.inventoryImage.setVisible(visible);
        this.updateInventoryUI();
    }

    updateInventoryUI() {
        this.towerIcons.clear(true, true);
        if (!this.inventoryImage.visible) return;

        const startX = this.inventoryImage.x + 20;
        const startY = this.inventoryImage.y + 20;
        const size = 50;
        const gap = 10;

        this.inventory.forEach((item, i) => {
            const row = Math.floor(i / 9);
            const col = i % 9;
            const x = startX + col * (size + gap);
            const y = startY + row * (size + gap);

            const stats = this.towerManager.getStatsByIndex(item.type);
            const iconKey = stats ? `${stats[0]}_Icon` : 'DefaultIcon';

            const icon = this.add.image(x, y, iconKey)
                .setDisplaySize(size, size)
                .setDepth(51)
                .setInteractive({ useHandCursor: true });

            this.towerIcons.add(icon);

            icon.on('pointerdown', () => {
                this.selectedTower = item.type;
                this.toggleInventory();

                this.canPlace = false;
                this.time.delayedCall(100, () => {
                    this.canPlace = true;
                });

                console.log(`Selected ${iconKey} from inventory.`);
            });
        });

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