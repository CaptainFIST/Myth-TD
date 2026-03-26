import MainMenu from './scenes/MainMenu.js';
import Level1 from './scenes/Level1.js';

const config = {
    type: Phaser.AUTO,
    title: 'Mythological Tower Defense Game',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    parent: 'game-container',
    scene: [
        MainMenu,
        Level1
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);