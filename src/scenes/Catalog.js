import AudioManager from '../managers/AudioManager.js';
import SaveManager from '../managers/SaveManager.js';
import TowerManager from '../managers/TowerManager.js';
import EnemyManager from '../managers/EnemyManager.js';

export default class Catalog extends Phaser.Scene {
    constructor() {
        super('Catalog');
    }

    static AFFINITY_BY_ID = ['Neutral', 'Physical', 'Air', 'Water', 'Fire', 'Dark'];

    static TOWER_AFFINITIES = Object.fromEntries(
        TowerManager.allTowerData
            .filter(([name]) => name !== 'Shrine')
            .map(([name, , , , , , affinityID]) => [name, Catalog.AFFINITY_BY_ID[affinityID]])
    );

    static ENEMY_AFFINITIES = Object.fromEntries(
        EnemyManager.enemyAffinity.map(([name, affinityID]) => [name, Catalog.AFFINITY_BY_ID[affinityID]])
    );

    // Damage coefficient table [Tower Affinity][Enemy Defense Type]
    static DAMAGE_COEFFICIENTS = {
        'Neutral': { 'Neutral': 1.0, 'Physical': 1.0, 'Air': 1.0, 'Water': 1.0, 'Fire': 1.0, 'Dark': 1.0 },
        'Physical': { 'Neutral': 0.75, 'Physical': 1.5, 'Air': 0.3, 'Water': 0.3, 'Fire': 0.3, 'Dark': 0.3 },
        'Air': { 'Neutral': 0.75, 'Physical': 0.3, 'Air': 1.5, 'Water': 0.3, 'Fire': 0.3, 'Dark': 0.3 },
        'Water': { 'Neutral': 0.75, 'Physical': 0.3, 'Air': 0.3, 'Water': 1.5, 'Fire': 0.3, 'Dark': 0.3 },
        'Fire': { 'Neutral': 0.75, 'Physical': 0.3, 'Air': 0.3, 'Water': 0.3, 'Fire': 1.5, 'Dark': 0.3 },
        'Dark': { 'Neutral': 0.75, 'Physical': 0.75, 'Air': 0.75, 'Water': 0.75, 'Fire': 0.75, 'Dark': 2.0 }
    };

    // Logical elemental weaknesses
    static ELEMENTAL_WEAKNESSES = {
        'Neutral': [], // No specific weaknesses
        'Physical': ['Dark'], // Physical weak to Dark (corruption)
        'Air': ['Physical'], // Air weak to Physical (grounding)
        'Water': ['Physical'], // Water weak to Physical (earth)
        'Fire': ['Water'], // Fire weak to Water
        'Dark': ['Neutral'] // Dark weak to Neutral (light)
    };

    preload() {
        if (!this.audioManager) {
            this.audioManager = new AudioManager(this);
            this.audioManager.preloadAudio();
            const volume = SaveManager.getVolumeForSlot();
            const isMuted = SaveManager.getMuteForSlot();
            this.audioManager.setVolume(volume);
            this.audioManager.setMute(isMuted);
        }

        // Load tower sprites and icons
        const towerNames = Object.keys(Catalog.TOWER_AFFINITIES);
        towerNames.forEach(name => {
            this.load.spritesheet(name, `assets/tower/${name}.png`, { frameWidth: 64, frameHeight: 64 });
            this.load.image(`${name}_Icon`, `assets/tower/TowerIcon/${name}_Icon.png`);
        });

        // Load enemy sprites
        const enemyNames = Object.keys(Catalog.ENEMY_AFFINITIES);
        enemyNames.forEach(name => {
            this.load.spritesheet(name, `assets/Enemies/${name}.png`, { frameWidth: 64, frameHeight: 64 });
        });
    }

    create() {
        const { width, height } = this.scale;
        this.add.rectangle(width / 2, height / 2, width, height, 0x0d1128);
        const container = this.add.container(0, 0);

        const mainTitle = this.add.text(width / 2, 40, 'CATALOG', {
            fontSize: '84px',
            color: '#64d5ff',
            fontStyle: 'bold',
            stroke: '#0a3f5c',
            strokeThickness: 6
        }).setOrigin(0.5);
        container.add(mainTitle);

        // Column layout
        const leftColumnX = width / 4;
        const rightColumnX = 3 * width / 4;
        const towerCardW = 620, towerCardH = 380;
        const enemyCardW = 620, enemyCardH = 380;
        const gap = 35;

        // Left column title - TOWERS
        const towerSectionTitle = this.add.text(leftColumnX, 120, 'TOWERS', {
            fontSize: '40px',
            color: '#64d5ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        container.add(towerSectionTitle);

        // Right column title - ENEMIES
        const enemySectionTitle = this.add.text(rightColumnX, 120, 'ENEMIES', {
            fontSize: '40px',
            color: '#64d5ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        container.add(enemySectionTitle);

        let towerYPos = 280;
        let enemyYPos = 280;
        let maxYPos = 280;

        // Create tower cards on the left
        const towerData = TowerManager.allTowerData.filter(([name]) => name !== 'Shrine');
        towerData.forEach(([towerName, damage, range, attackSpeed, , , affinityID]) => {
            const affinity = Catalog.AFFINITY_BY_ID[affinityID];
            const affinityColor = this.getAffinityColor(affinity);

            const card = this.add.rectangle(leftColumnX, towerYPos, towerCardW, towerCardH, 0x0f1534, 0.7)
                .setStrokeStyle(2, affinityColor);
            container.add(card);

            const iconKey = `${towerName}_Icon`;
            const icon = this.add.image(leftColumnX - towerCardW / 2 + 60, towerYPos - 35, iconKey)
                .setDisplaySize(70, 70);
            container.add(icon);

            const nameText = this.add.text(leftColumnX - towerCardW / 2 + 140, towerYPos - 60, towerName, {
                fontSize: '28px',
                color: '#a8daff',
                fontStyle: 'bold'
            });
            container.add(nameText);

            const affinityText = this.add.text(leftColumnX - towerCardW / 2 + 140, towerYPos - 25, `Affinity: ${affinity}`, {
                fontSize: '20px',
                color: affinityColor,
                fontStyle: 'bold'
            });
            container.add(affinityText);

            const statText = `Damage: ${damage}\nRange: ${range}\nAttack Speed: ${attackSpeed.toFixed(2)}`;
            const statsDisplay = this.add.text(leftColumnX - towerCardW / 2 + 140, towerYPos + 10, statText, {
                fontSize: '22px',
                color: '#a8daff',
                fontStyle: 'bold',
                wordWrap: { width: towerCardW - 160 }
            });
            container.add(statsDisplay);

            const coeffs = Catalog.DAMAGE_COEFFICIENTS[affinity];
            let coeffText = 'Damage vs:\n';
            Object.keys(coeffs).forEach(defType => {
                const coeff = coeffs[defType];
                coeffText += `${defType}: ${coeff.toFixed(2)}x    `;
            });
            const coeffDisplay = this.add.text(leftColumnX - towerCardW / 2 + 140, towerYPos + 90, coeffText, {
                fontSize: '20px',
                color: '#06b6d4',
                fontStyle: 'bold',
                wordWrap: { width: towerCardW - 160 }
            });
            container.add(coeffDisplay);

            towerYPos += towerCardH + gap;
            maxYPos = Math.max(maxYPos, towerYPos);
        });

        // Create enemy cards on the right
        const enemyData = EnemyManager.allEnemyData;
        enemyData.forEach(([enemyName, , health, speed, reward]) => {
            const affinityEntry = EnemyManager.enemyAffinity.find(([name]) => name === enemyName);
            const affinityID = affinityEntry ? affinityEntry[1] : 0;
            const defenseType = Catalog.AFFINITY_BY_ID[affinityID];
            const defenseColor = this.getAffinityColor(defenseType);

            const card = this.add.rectangle(rightColumnX, enemyYPos, enemyCardW, enemyCardH, 0x0f1534, 0.7)
                .setStrokeStyle(2, defenseColor);
            container.add(card);

            const sprite = this.add.sprite(rightColumnX - enemyCardW / 2 + 60, enemyYPos - 35, enemyName, 0)
                .setDisplaySize(70, 70);
            container.add(sprite);

            const nameText = this.add.text(rightColumnX - enemyCardW / 2 + 140, enemyYPos - 60, enemyName, {
                fontSize: '28px',
                color: '#a8daff',
                fontStyle: 'bold'
            });
            container.add(nameText);

            const defenseText = this.add.text(rightColumnX - enemyCardW / 2 + 140, enemyYPos - 25, `Defense: ${defenseType}`, {
                fontSize: '20px',
                color: defenseColor,
                fontStyle: 'bold'
            });
            container.add(defenseText);

            const statText = `Health: ${health}\nSpeed: ${speed.toFixed(2)}\nReward: ${reward}`;
            const statsDisplay = this.add.text(rightColumnX - enemyCardW / 2 + 140, enemyYPos + 5, statText, {
                fontSize: '22px',
                color: '#a8daff',
                fontStyle: 'bold',
                wordWrap: { width: enemyCardW - 160 }
            });
            container.add(statsDisplay);

            let weakTo = 'Weak to: ';
            const weaknesses = Catalog.ELEMENTAL_WEAKNESSES[defenseType] || [];
            weakTo += weaknesses.length > 0 ? weaknesses.join(', ') : 'None';

            const weakDisplay = this.add.text(rightColumnX - enemyCardW / 2 + 140, enemyYPos + 75, weakTo, {
                fontSize: '16px',
                color: '#22C55E',
                wordWrap: { width: enemyCardW - 160 }
            });
            container.add(weakDisplay);

            enemyYPos += enemyCardH + gap;
            maxYPos = Math.max(maxYPos, enemyYPos);
        });

        // Affinity table at the bottom
        const tableTitle = this.add.text(width / 2, maxYPos + 50, 'DAMAGE COEFFICIENT TABLE', {
            fontSize: '40px',
            color: '#64d5ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        container.add(tableTitle);

        const tableScale = 0.65;
        const table = this.createAffinityTable(width / 2, maxYPos + 100, tableScale);
        container.add(table);

        // Back button
        const btnY = maxYPos + 350;
        const btn = this.add.rectangle(width / 2, btnY, 260, 50, 0x1a5f3e)
            .setStrokeStyle(2, 0x64d5ff)
            .setInteractive({ useHandCursor: true });
        container.add(btn);

        const txt = this.add.text(width / 2, btnY, 'BACK TO MENU', {
            fontSize: '24px',
            color: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        container.add(txt);

        btn.on('pointerover', () => { btn.setFillStyle(0x2d7f5e); txt.setScale(1.1); });
        btn.on('pointerout', () => { btn.setFillStyle(0x1a5f3e); txt.setScale(1); });

        btn.on('pointerdown', () => {
            this.audioManager.playButtonPress();
            this.scene.start('MainMenu');
        });

        txt.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => btn.emit('pointerdown'));

        // Scrolling
        let scroll = 0;
        const maxScroll = Math.max(0, btnY + 100 - height);

        const updateScroll = (v) => {
            scroll = Phaser.Math.Clamp(v, 0, maxScroll);
            container.y = -scroll;
        };

        this.input.on('wheel', (_, __, ___, dy) => updateScroll(scroll + dy * 0.5));
        this.input.keyboard.on('keydown-UP', () => updateScroll(scroll - 40));
        this.input.keyboard.on('keydown-DOWN', () => updateScroll(scroll + 40));
    }

    createAffinityTable(x, y, scale) {
        const container = this.add.container(x, y);
        const affinities = Object.keys(Catalog.DAMAGE_COEFFICIENTS);
        const cellWidth = 100;
        const cellHeight = 50;
        const fontSize = 16;

        // Header row
        const headerX = x - (affinities.length * cellWidth) / 2;
        this.add.text(headerX - cellWidth, y, 'Tower \\ Enemy', {
            fontSize: `${fontSize}px`,
            color: '#64d5ff',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        affinities.forEach((aff, i) => {
            this.add.text(headerX + i * cellWidth + cellWidth / 2, y, aff, {
                fontSize: `${fontSize}px`,
                color: this.getAffinityColor(aff),
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5);
        });

        // Data rows
        affinities.forEach((towerAff, row) => {
            this.add.text(headerX - cellWidth + cellWidth / 2, y + (row + 1) * cellHeight + cellHeight / 2, towerAff, {
                fontSize: `${fontSize}px`,
                color: this.getAffinityColor(towerAff),
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5);

            affinities.forEach((enemyAff, col) => {
                const coeff = Catalog.DAMAGE_COEFFICIENTS[towerAff][enemyAff];
                const color = coeff > 1 ? '#22C55E' : coeff < 1 ? '#FF6B6B' : '#a8daff';
                this.add.text(headerX + col * cellWidth + cellWidth / 2, y + (row + 1) * cellHeight + cellHeight / 2, coeff.toFixed(2) + 'x', {
                    fontSize: `${fontSize}px`,
                    color: color
                }).setOrigin(0.5, 0.5);
            });
        });

        return container;
    }

    getAffinityColor(affinity) {
        const colors = {
            'Neutral': '#64d5ff',
            'Physical': '#FF9500',
            'Air': '#9D4EDD',
            'Water': '#00B4D8',
            'Fire': '#FF6B6B',
            'Dark': '#3C096C'
        };
        return colors[affinity] || '#a8daff';
    }
}