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
            },
            save: null
        };
    }

    static defaultData() {
        return {
            activeSlot: 'Slot_1',
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
}