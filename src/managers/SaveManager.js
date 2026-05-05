export default class SaveManager {
    static KEY = 'mythos_td_data'; 

    static defaultSlot() {
        return {
            progress: {
                levelsCompleted: []
            },
            achievements: {},
            stats: {
                totalGold: 0,
                goldSpent: 0,
                perfectClears: 0,
                levelClears: 0,
                levelFails: 0,
                enemiesKilled: 0,
                towersPlaced: 0,
                mergesDone: 0,
            }
            //save: null
        };
    }

    static defaultData() {
        return {
            activeSlot: 'Slot_1',
            settings: {
                volume: 0.5,
                isMuted: false
            },
            slots: {
                Slot_1: this.defaultSlot(),
                Slot_2: this.defaultSlot(),
                Slot_3: this.defaultSlot(),
            }
        };
    }


    static load() {
        const raw = localStorage.getItem(this.KEY);
        try {
            return raw ? JSON.parse(raw) : this.defaultData();
        } 
        catch {
            return this.defaultData();
        }
    }


    static get() {
        if(!this._cache) {
            this._cache = this.load();

        }
        return this._cache;
    }

    static commit() {
        localStorage.setItem(this.KEY, JSON.stringify(this._cache));
    }

    static getSlot() {
        const data = this.get();
        return data.slots[data.activeSlot];
    }

    static setActiveSlot(slotName) {
        const data = this.get();

        if(!data.slots[slotName]) {
            data.slots[slotName] = this.defaultSlot();
        }

        data.activeSlot = slotName;
        this.commit();
    }

    static resetSlot(slotName) {
        const data = this.get();
        data.slots[slotName] = this.defaultSlot();
        this.commit();
    }

    static deleteSlot(slotName) {
        const data = this.get();
        delete data.slots[slotName];
        this.commit();
    }

    static setVolumeForSlot(volume) {
        const data = this.get();
        if (data && data.settings) {
            // Validate volume - ensure it's a valid number between 0 and 1
            if (typeof volume === 'number' && volume >= 0 && volume <= 1) {
                data.settings.volume = volume;
                this.commit();
            }
        }
    }

    static setMuteForSlot(isMuted) {
        const data = this.get();
        if (data && data.settings) {
            data.settings.isMuted = isMuted;
            this.commit();
        }
    }

    static getVolumeForSlot() {
        const data = this.get();
        const volume = data?.settings?.volume;
        // Validate volume is a number between 0-1, use default 0.5 if not
        if (typeof volume === 'number' && volume >= 0 && volume <= 1) {
            return volume;
        }
        return 0.5;
    }

    static getMuteForSlot() {
        const data = this.get();
        const isMuted = data?.settings?.isMuted;
        return typeof isMuted === 'boolean' ? isMuted : false;
    }
}