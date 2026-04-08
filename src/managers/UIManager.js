import PlayerManager from '../managers/PlayerManager.js';

export default class UIManager extends Phaser.Scene {
    constructor() {
        super({ key: 'UIManager' });
    }

    preload() {
        this.load.image('UI', 'assets/UI/UI.png');
        this.load.image('UIHP', 'assets/UI/UIHP.png');
        this.load.image('Inventory', 'assets/UI/Inventory.png');
        this.load.image('TowerIcon', 'assets/UI/tower_icon.png');
    }

    create(data) {
        this.player = data.player;
        this.inventory = data.inventory;
        this.timeManager = data.timeManager;

        const width = this.scale.width;
        const height = this.scale.height;
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
            .setOrigin(0)
            .setDepth(50)
            .setVisible(false);

        this.towerIcons = this.add.group();

        this.updateUI();
    }

    update() {
        this.updateUI();
    }

    updateUI() {
        if (!this.player) return;

        this.goldText.setText(`Gold: ${this.player.gold}`);

        if (this.timeManager) {
            const time = this.timeManager.getTime().toFixed(1);
            this.timerText.setText(`Time: ${time}s`);
        }

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

        this.inventory.forEach((tower, i) => {
            const row = Math.floor(i / 9);
            const col = i % 9;
            const x = startX + col * (size + gap);
            const y = startY + row * (size + gap);

            const icon = this.add.image(x, y, 'TowerIcon').setScale(0.7) .setDepth(51);
            this.towerIcons.add(icon);
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