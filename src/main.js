import MainMenu from './scenes/MainMenu.js';
import SettingsMenu from './scenes/SettingsMenu.js';
import Tutorial from './scenes/Tutorial.js';
import WinScreen from './scenes/WinScreen.js';
import LoseScreen from './scenes/LoseScreen.js';
import MapManager from './managers/MapManager.js';
import PlayerManager from './managers/PlayerManager.js';
import Level1 from './scenes/Level1.js';
import Level2 from './scenes/Level2.js';
import LevelSelect from './scenes/LevelSelect.js';
import TimeManager from './managers/TimeManager.js';
import UIManager from './managers/UIManager.js';
import TowerManager from './managers/TowerManager.js';
import Tower from './entities/Tower.js';

const config = {
    type: Phaser.AUTO,
    title: 'Mythological Tower Defense Game',
    description: '',
    parent: 'game-container',
    width: 1856,
    height: 992,
    backgroundColor: '#000000',
    pixelArt: true,
    parent: 'game-container',
    scene: [
        MainMenu,
        LevelSelect,
        SettingsMenu,
        Tutorial,
        WinScreen,
        LoseScreen,
        MapManager,
        //PlayerManager,
        //TimeManager,
        //Tower,
        //TowerManager,
        UIManager,
        Level1,
        Level2
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);