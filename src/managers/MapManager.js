export default class MapManager extends Phaser.Scene {
    constructor() {
        super({ key: 'MapManager' });
    }

    create(data) {
        const level = data.level;
        const { mapData, decoData, tileTypes, decoTypes } = level;
        this.levelData = { mapData, decoData, tileTypes, decoTypes };
        const tileSize = this.tileSize || 64;

        // Build enemy path before rendering map
        this.findOpening(mapData, 'Ex');
        this.mappedPath = this.findPath(mapData);
        this.clearPathDecorations(this.mappedPath, decoData);

        // Convert tile path → world coordinates for movement
        this.worldPath = this.actualWorldPath(this.mappedPath);

        // Draw tiles + decorations
        for (let row = 0; row < mapData.length; row++) {
            for (let col = 0; col < mapData[row].length; col++) {
                const x = col * tileSize;
                const y = row * tileSize;

                const tileKey = tileTypes[mapData[row][col]];
                const decoKey = decoTypes[decoData[row][col]];

                if (tileKey) this.add.image(x, y, tileKey).setOrigin(0);
                if (decoKey) this.add.image(x, y, decoKey).setOrigin(0).setDepth(0.5);
            }
        }
        console.log(this.mappedPath);
        console.log(this.worldPath);
    }

    // Locate entrance (2) or exit (3) in the map grid
    findOpening(map, type) {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                if (map[y][x] === 2 && type === 'Ent') return { x, y };
                if (map[y][x] === 3 && type === 'Ex') return { x, y };
            }
        }
        console.warn(type === 'Ent' ? "Missing Entrance" : "Missing Exit");
        return null;
    }

    // Follow path tiles (1 → 3) from entrance to exit
    findPath(map) {
        const path = [];
        const visited = new Set();
        const tileSize = this.tileSize || 64;

        let cur = this.findOpening(map, 'Ent');
        if (!cur) {
            console.error("No entrance found — cannot build path");
            return [];
        }

        // Debug path drawing
        const graphics = this.add.graphics();
        const drawPath = this.add.path(
            cur.x * tileSize + tileSize / 2,
            cur.y * tileSize + tileSize / 2
        );

        const key = (x, y) => `${x},${y}`;

        // Traverse connected path tiles
        while (cur) {
            path.push(cur);
            visited.add(key(cur.x, cur.y));

            if (map[cur.y][cur.x] === 3) break;

            let next = null;

            // Check 4 directions (up, right, down, left)
            for (const { x: dx, y: dy } of [
                { x: 0, y: -1 },
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: -1, y: 0 }
            ]) {
                const nx = cur.x + dx;
                const ny = cur.y + dy;

                if (
                    map[ny] &&
                    (map[ny][nx] === 1 || map[ny][nx] === 3) &&
                    !visited.has(key(nx, ny))
                ) {
                    next = { x: nx, y: ny };
                    break;
                }
            }

            cur = next;
            if (!cur) break;

            drawPath.lineTo(
                cur.x * tileSize + tileSize / 2,
                cur.y * tileSize + tileSize / 2
            );
        }
        graphics.lineStyle(3, 0xffffff, 1);
        drawPath.draw(graphics);

        return path;
    }

    // Convert tile coordinates → world pixel positions
    actualWorldPath(tilePath) {
        const tileSize = this.tileSize || 64;

        return tilePath.map(t => ({
            x: t.x * tileSize + tileSize / 2,
            y: t.y * tileSize + tileSize / 2
        }));
    }

    // Remove decorations that overlap the enemy path
    clearPathDecorations(path, decoData) {
        path.forEach(({ x, y }) => {
            if (decoData[y]?.[x] !== undefined) {
                decoData[y][x] = 0;
            }
        });

        console.log("✓ Path decorations cleared");
    }

    // Debug grid overlay for visualizing tiles
    drawGrid(width, height) {
        const grid = this.add.graphics();
        const size = 64;

        grid.lineStyle(1, 0x0000ff, 0.1);

        // Horizontal lines
        for (let y = 0; y < (height - 96) / size; y++) {
            grid.moveTo(0, y * size);
            grid.lineTo(width, y * size);
        }

        // Vertical lines
        for (let x = 0; x < width / size; x++) {
            grid.moveTo(x * size, 0);
            grid.lineTo(x * size, height);
        }

        grid.strokePath();
        grid.setDepth(0);
        return grid;
    }
}