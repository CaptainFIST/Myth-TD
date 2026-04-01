import MainMenu from './scenes/MainMenu.js';
import SettingsMenu from './scenes/SettingsMenu.js';
import Tutorial from './scenes/Tutorial.js';
import MapManager from './managers/MapManager.js';
import PlayerManager from './managers/PlayerManager.js';
import PlayerManager2 from './managers/PlayerManager2.js';
import Level1 from './scenes/Level1.js';
import Level2 from './scenes/Level2.js';
import LevelSelect from './scenes/LevelSelect.js';

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
        LevelSelect,
        SettingsMenu,
        Tutorial,
        MapManager,
        PlayerManager,
        PlayerManager2,
        Level1,
        Level2
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);