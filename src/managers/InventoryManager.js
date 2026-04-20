export default class InventoryManager {
    constructor(scene, towerManager, initialItems = []) {
        this.scene = scene;
        this.towerManager = towerManager;

        // Store inventory items as { type: towerIndex }
        this.items = [...initialItems];

        // UI references (set later)
        this.inventoryImage = null;
        this.towerIcons = null;
        this.onTowerSelected = null;
    }

    initialize(inventoryImage, towerIcons) {
        this.inventoryImage = inventoryImage;
        this.towerIcons = towerIcons;
    }

    addTower(type) {
        // Add a new tower entry to inventory
        this.items.push({ type });
    }

    removeTower(type) {
        // Remove first matching tower from inventory
        const i = this.items.findIndex(item => item.type === type);
        if (i !== -1) this.items.splice(i, 1);
    }

    getItems() {
        return this.items;
    }

    toggleInventory() {
        // Toggle visibility and refresh UI
        const visible = !this.inventoryImage.visible;
        this.inventoryImage.setVisible(visible);
        this.updateInventoryUI();
    }

    updateInventoryUI() {
        // Clear old icons before re-rendering
        this.towerIcons.clear(true, true);
        if (!this.inventoryImage.visible) return;

        const baseX = this.inventoryImage.x + 20;
        const baseY = this.inventoryImage.y + 20;
        const size = 50, gap = 10, cols = 9;

        this.items.forEach(({ type }, i) => {
            // Calculate grid position (row/column layout)
            const x = baseX + (i % cols) * (size + gap);
            const y = baseY + Math.floor(i / cols) * (size + gap);

            // Get icon based on tower stats
            const stats = this.towerManager.getStatsByIndex(type);
            const key = stats ? `${stats[0]}_Icon` : 'DefaultIcon';

            const icon = this.scene.add.image(x, y, key)
                .setDisplaySize(size, size)
                .setDepth(51)
                .setInteractive({ useHandCursor: true });

            this.towerIcons.add(icon);

            icon.on('pointerdown', () => {
                // Select tower and close inventory
                this.towerManager.selectTower(type);
                this.toggleInventory();
                this.onTowerSelected?.();
            });
        });
    }

    setTowerSelectedCallback(cb) {
        this.onTowerSelected = cb;
    }
}