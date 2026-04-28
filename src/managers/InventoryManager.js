export default class InventoryManager {
    constructor(scene, towerManager, initialItems = []) {
        this.scene = scene;
        this.towerManager = towerManager;

        // Inventory stores items as objects: { type: towerIndex }
        this.items = [...initialItems];

        this.inventoryImage = null;
        this.towerIcons = null;
        this.onTowerSelected = null;
        this.scrollOffset = 0;
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
        this.scrollOffset = 0; // Reset scroll on toggle
        this.updateInventoryUI();
    }

    updateInventoryUI() {
        // Rebuild inventory UI each time it is opened
        if (!this.towerIcons || !this.inventoryImage) return;

        this.towerIcons.clear(true, true);
        if (!this.inventoryImage.visible) return;

        // Get inventory bounds
        const baseX = this.inventoryImage.x + 12;
        const baseY = this.inventoryImage.y + 8;
        const maxWidth = 395;  
        const maxHeight = 285; // Usable height
        const size = 34;       
        const gap = 10;        // Increased gap for more spacing
        const cols = Math.floor((maxWidth + gap) / (size + gap));  // Calculate columns that fit
        const rowHeight = size + gap;
        const maxRows = Math.floor(maxHeight / rowHeight);

        // Calculate scroll position
        const startRow = Math.floor(this.scrollOffset / rowHeight);
        const endRow = startRow + maxRows + 1;

        this.items.forEach(({ type }, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            
            // Skip if outside visible area due to scroll
            if (row < startRow || row >= endRow) {
                return;
            }

            // Calculate grid position for each icon
            const x = baseX + col * (size + gap) + (size / 2);
            const y = baseY + row * (size + gap) - this.scrollOffset + (size / 2);

            // Check if item is within bounds
            if (y < baseY || y > baseY + maxHeight) {
                return; 
            }

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
        this.setupInventoryScroll(cols, maxRows, rowHeight);
    }

    setupInventoryScroll(cols, maxRows, rowHeight) {
        // Remove old listeners if any
        if (this.scrollListener) {
            this.scene.input.off('wheel', this.scrollListener);
        }

        const totalRows = Math.ceil(this.items.length / cols);
        const maxScroll = Math.max(0, (totalRows - maxRows) * rowHeight);

        this.scrollListener = (pointer, gameObjects, deltaY) => {
            if (!this.inventoryImage?.visible) return;
            const scrollSpeed = 15;
            this.scrollOffset += deltaY > 0 ? scrollSpeed : -scrollSpeed;
            this.scrollOffset = Phaser.Math.Clamp(this.scrollOffset, 0, maxScroll);
            this.updateInventoryUI();
        };
        this.scene.input.on('wheel', this.scrollListener);
    }

    setTowerSelectedCallback(cb) {
        // Set external callback (e.g., UI updates, sound effects)
        this.onTowerSelected = cb;
    }

    mergeTowers() {
        const counts = {};

        // Count how many of each type
        this.items.forEach(item => {
            counts[item.type] = (counts[item.type] || 0) + 1;
        });

        // Find a type with at least 3
        for (let type in counts) {
            if (counts[type] >= 3) {

                let removed = 0;

                // Remove 3 of that type
                this.items = this.items.filter(item => {
                    if (item.type === type && removed < 3) {
                        removed++;
                        return false;
                    }
                    return true;
                });

                // Add upgraded version
                const upgradedType = this.getUpgradedType(type);
                this.items.push({ type: upgradedType });

                console.log(`Merged 3x ${type} → ${upgradedType}`);

                this.updateInventoryUI();
                return;
            }
        }

        console.log("No towers available to merge");
    }

    getUpgradedType(type) {
        if (!type.includes('_')) {
            return `${type}_2`;
        }

        const [base, tier] = type.split('_');
        const newTier = Number(tier) + 1;

        return `${base}_${newTier}`;
    }

    destroy() {
        // Clean up scroll listener
        if (this.scrollListener) {
            this.scene.input.off('wheel', this.scrollListener);
        }
    }
}