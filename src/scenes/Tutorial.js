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
            ['💰 FARMING', 'Earn 2-3 gold per second passively'],
            ['🎯 PLACEMENT', 'Click anywhere off the path to place towers'],
            ['⬆️ UPGRADE', 'Click existing towers to upgrade'],
            ['🌊 WAVES', 'Defeat all enemies in each wave to progress'],
            ['❤️ HEALTH', 'Protect your base! 0 health = game over'],
            ['⚡ SPEED', 'Use speed buttons to control game pace'],
            ['🎯 TYPES', 'Basic | Power | Sniper'],
            ['🔄 RANGE', 'Overlapping ranges are more effective against groups'],
            ['📊 STRATEGY', 'Upgrade range first, then damage as you earn gold'],
            ['🏆 TIPS', 'Build towers ahead of the path for better coverage']
        ];

        // Create cards in a 2-column grid
        const cardW = 480, cardH = 180, gap = 40;        
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