export default class InventoryManager {
    constructor(scene, towerManager, initialItems = []) {
        this.scene = scene;
        this.towerManager = towerManager;

        // Inventory stores items as objects: { type: towerIndex }
        this.items = [...initialItems];

        this.inventoryImage = null;
        this.towerIcons = null;
        this.onTowerSelected = null;
    }

    initialize(inventoryImage, towerIcons) {
        // Link UI components created elsewhere
        this.inventoryImage = inventoryImage;
        this.towerIcons = towerIcons;
    }

    addTower(type) {
        // Add a tower to inventory
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
        // Toggle UI visibility and refresh icons
        if (!this.inventoryImage) return;

        const visible = !this.inventoryImage.visible;
        this.inventoryImage.setVisible(visible);
        this.updateInventoryUI();
    }

    updateInventoryUI() {
        // Rebuild inventory UI each time it is opened
        if (!this.towerIcons || !this.inventoryImage) return;

        this.towerIcons.clear(true, true);
        if (!this.inventoryImage.visible) return;

        const baseX = this.inventoryImage.x + 20;
        const baseY = this.inventoryImage.y + 20;
        const size = 50, gap = 10, cols = 9;

        this.items.forEach(({ type }, i) => {
            // Calculate grid position for each icon
            const x = baseX + (i % cols) * (size + gap);
            const y = baseY + Math.floor(i / cols) * (size + gap);

            // Determine correct icon from tower stats
            const stats = this.towerManager?.getStatsByIndex(type);
            const key = stats ? `${stats[0]}_Icon` : 'DefaultIcon';

            const icon = this.scene.add.image(x, y, key)
                .setDisplaySize(size, size).setDepth(51).setInteractive({ useHandCursor: true });

            this.towerIcons.add(icon);

            // Select tower and close inventory on click
            icon.once('pointerdown', () => {
                this.towerManager?.selectTower(type);
                this.toggleInventory();
                this.onTowerSelected?.();
            });
        });
    }

    setTowerSelectedCallback(cb) {
        // Set external callback (e.g., UI updates, sound effects)
        this.onTowerSelected = cb;
    }
}