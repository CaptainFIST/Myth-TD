import MainMenu from './scenes/MainMenu.js';
import SettingsMenu from './scenes/SettingsMenu.js';
<<<<<<< HEAD
import Level1 from './scenes/Level1.js';
import Tutorial from './scenes/Tutorial.js';
=======
import Tutorial from './scenes/Tutorial.js';
import MapManager from './managers/MapManager.js';
import PlayerManager from './managers/PlayerManager.js';
import Level1 from './scenes/Level1.js';
import Level2 from './scenes/Level2.js';
import LevelSelect from './scenes/LevelSelect.js';
import TimeManager from './managers/TimeManager.js';
import UIManager from './managers/UIManager.js';
>>>>>>> 4e25e2fc37588c7ab2d247af757f5a90534c52a3

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
        TimeManager,
        UIManager,
        Level1,
<<<<<<< HEAD
        Tutorial
=======
        Level2
>>>>>>> 4e25e2fc37588c7ab2d247af757f5a90534c52a3
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);