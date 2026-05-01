export default class Tutorial extends Phaser.Scene {
    constructor() {
        super('Tutorial');
    }

    // Build the tutorial UI with scrollable content
    create() {
        const { width, height } = this.scale;
        this.add.rectangle(width / 2, height / 2, width, height, 0x0d1128);
        const container = this.add.container(0, 0);
        
        // Array of tutorial cards with title and description
        const tutorialData = [
            ['🎯 PLACEMENT', 'Click on grass tiles to place towers on the battlefield. You can only build on grass, not on the enemy path or decorations.'],
            ['🔀 MERGING', 'Drag towers together to merge them and create stronger units. The more merges, the more powerful your tower becomes with increased stats.'],
            ['🌊 WAVES', 'Enemies spawn in waves. Defeat all enemies in a wave to progress to the next. Keep your defense strong throughout all waves to survive.'],
            ['❤️ HEALTH', 'Each level have a set of health. When enemies reach the end of the path, they deal damage to your base. Protect your base at all costs!'],
            ['⚡ SPEED', 'Use the speed controls during battles to slow down, play at normal speed, or fast forward. Pause to plan your strategy.'],
            ['💰 GOLD', 'Earn gold by defeating enemies in combat. Use this gold wisely to purchase new towers and build your defense strategically.'],
            ['🗡️ TOWERS', 'Deploy mythological towers with unique attack patterns and abilities. See the Catalog for detailed stats on each tower type.'],
            ['👹 ENEMIES', 'Face diverse enemy types with different speeds, health, and behaviors. Learn their patterns - view the Catalog for complete enemy details.'],
            ['📋 PROGRESSION', 'Complete Level 1 to unlock Level 2, then Level 3. Progress sequentially by beating each level to face new challenges.'],
            ['🎮 CONTROLS', 'Left Click to place towers | Drag to merge | ESC to cancel placement and return tower to inventory. Use these controls to build efficiently!'],
            ['💡 TIPS', 'Spread towers along the path for coverage, merge them to boost power, and anticipate enemy movement. Plan ahead for success!'],
            ['🏆 VICTORY', 'Defeat all enemies in each wave without losing your base. Complete all waves to win the level and progress to the next challenge.']
        ];

        // Create cards in a 2-column grid
        const cardW = 480, cardH = 143, gap = 40;        
        const startX = width / 2 - cardW - gap / 2;
        const startY = 200;
        
        tutorialData.forEach(([titleText, descText], i) => {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const x = startX + col * (cardW + gap) + cardW / 2;
            const y = startY + row * (cardH + gap);

            const card = this.add.rectangle(x, y, cardW, cardH, 0x0f1534, 0.7)
                .setStrokeStyle(2, 0x64d5ff);
            const title = this.add.text(x - cardW / 2 + 20, y - cardH / 2 + 20, titleText, {
                fontSize: '24px',
                color: '#64d5ff',
                fontStyle: 'bold'
            });

            const desc = this.add.text(x - cardW / 2 + 15, y - cardH / 2 + 50, descText, {
                fontSize: '20px',
                color: '#a8daff',
                wordWrap: { width: cardW - 30 }
            });
            container.add([card, title, desc]);
        });

        const mainTitle = this.add.text(width / 2, 50, 'HOW TO PLAY', {
            fontSize: '72px',
            color: '#64d5ff',
            fontStyle: 'bold',
            stroke: '#0a3f5c',
            strokeThickness: 5,
            fontFamily: 'Arial'
        }).setOrigin(0.5).setDepth(1); 
        container.add(mainTitle);
        
        // Enable mouse wheel and arrow key scrolling
        let scroll = 0;
        const maxScroll = container.height ? container.height - height + 100 : 400;
        
        const updateScroll = (v) => {
            scroll = Phaser.Math.Clamp(v, 0, maxScroll);
            container.y = -scroll;  // Move container up/down
        };

        this.input.on('wheel', (_, __, ___, dy) => updateScroll(scroll + dy * 0.5));
        
        this.input.keyboard.on('keydown-UP', () => updateScroll(scroll - 40));
        this.input.keyboard.on('keydown-DOWN', () => updateScroll(scroll + 40));

        const btnY = startY + Math.ceil(tutorialData.length / 2) * (cardH + gap) + 60;
        const btn = this.add.rectangle(width / 2, btnY, 260, 50, 0x1a5f3e)
            .setStrokeStyle(2, 0x64d5ff)
            .setInteractive({ useHandCursor: true });
        
        const txt = this.add.text(width / 2, btnY, 'START GAME', {
            fontSize: '24px',
            color: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        container.add([btn, txt]);
        
        btn.on('pointerover', () => { btn.setFillStyle(0x2d7f5e); txt.setScale(1.1); });
        btn.on('pointerout', () => { btn.setFillStyle(0x1a5f3e); txt.setScale(1); });
        
        btn.on('pointerdown', () => {
            localStorage.setItem('mythological_defense_tutorial_seen', 'true');
            this.scene.start('Level1'); 
        });
        
        txt.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => btn.emit('pointerdown'));
    }
}