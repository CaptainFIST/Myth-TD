export default class MapManager extends Phaser.Scene {
    constructor() {
        super({ key: 'MapManager' });
        this.spawnPoints = {}; // Maps spawn point ID to path
    }

    create(data) {
        const level = data.level;
        const { mapData, decoData, tileTypes, decoTypes } = level;
        this.spawnPoints = {};
        this.mappedPath = [];
        this.worldPath = [];
        this.levelData = { mapData, decoData, tileTypes, decoTypes };
        this.level = level.level; // Store level number
        this.showDebugGrid = level.showDebugGrid !== undefined ? level.showDebugGrid : true;
        this.showDebugPaths = level.showDebugPaths !== undefined ? level.showDebugPaths : true;
        const tileSize = this.tileSize || 64;

        const spawnPointIds = this.findAllSpawnPoints(mapData);
        
        if (spawnPointIds.length > 1) {
            // Multiple spawn points - build paths for each
            this.buildAllPaths(mapData, decoData);
        } else {
            // Single spawn point - use legacy system
            this.findOpening(mapData, 'Ex');
            this.mappedPath = this.findPath(mapData);
            this.clearPathDecorations(this.mappedPath, decoData);
            this.worldPath = this.actualWorldPath(this.mappedPath);
        }

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
        console.log("Spawn Points:", this.spawnPoints);
        console.log(this.mappedPath);
        console.log(this.worldPath);
    }

    // Build paths for all spawn points
    buildAllPaths(mapData, decoData) {
        const spawnPointIds = this.findAllSpawnPoints(mapData);
        console.log("Found spawn points:", spawnPointIds);

        spawnPointIds.forEach(spawnId => {
            const mappedPath = this.findPathFromSpawnPoint(mapData, spawnId);
            const worldPath = this.actualWorldPath(mappedPath);
            this.clearPathDecorations(mappedPath, decoData);
            this.spawnPoints[spawnId] = {
                mappedPath,
                worldPath
            };
            console.log(`Spawn point ${spawnId} path:`, mappedPath);
        });
    }

    // Find all spawn point values in the map (2, 4, 5, etc. - all non-1, non-3, non-0)
    findAllSpawnPoints(map) {
        const spawnIds = new Set();
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                const val = map[y][x];
                // Values 2+ are potential spawn points (0=grass, 1=path, 3=exit)
                if (val >= 2 && val !== 3) {
                    spawnIds.add(val);
                }
            }
        }
        return Array.from(spawnIds).sort();
    }

// Find path from a specific spawn point to exit using BFS
    findPathFromSpawnPoint(map, spawnPointId) {
        const tileSize = this.tileSize || 64;
        const start = this.findSpawnPointLocation(map, spawnPointId);
        if (!start) {
            console.error(`No spawn point ${spawnPointId} found`);
            return [];
        }

        const queue = [start];
        const visited = new Set();
        const parent = new Map();
        visited.add(`${start.x},${start.y}`);

        let found = false;
        let exitPos = null;

        while (queue.length > 0) {
            const cur = queue.shift();
            if (map[cur.y][cur.x] === 3) {
                found = true;
                exitPos = cur;
                break;
            }

            for (const { x: dx, y: dy } of [
                { x: 0, y: -1 }, // up
                { x: 1, y: 0 }, // right
                { x: 0, y: 1 }, // down
                { x: -1, y: 0 } // left
            ]) {
                const nx = cur.x + dx;
                const ny = cur.y + dy;
                const key = `${nx},${ny}`;
                if (
                    map[ny] &&
                    (map[ny][nx] === 1 || map[ny][nx] === 3) &&
                    !visited.has(key)
                ) {
                    visited.add(key);
                    queue.push({ x: nx, y: ny });
                    parent.set(key, cur);
                }
            }
        }

        if (!found) {
            console.error(`No path found from spawn ${spawnPointId} to exit`);
            return [];
        }

        // Reconstruct path from start to exit
        const path = [];
        let cur = exitPos;
        while (cur) {
            path.unshift(cur);
            const key = `${cur.x},${cur.y}`;
            cur = parent.get(key);
        }

        if (this.showDebugPaths) {
            const graphics = this.add.graphics();
            graphics.setDepth(1);
            const drawPath = this.add.path(
                path[0].x * tileSize + tileSize / 2,
                path[0].y * tileSize + tileSize / 2
            );
            for (let i = 1; i < path.length; i++) {
                drawPath.lineTo(
                    path[i].x * tileSize + tileSize / 2,
                    path[i].y * tileSize + tileSize / 2
                );
            }
            graphics.lineStyle(3, 0xffffff, 1);
            drawPath.draw(graphics);
        }
        console.log(`Path found for spawn ${spawnPointId}:`, path.length, 'steps');
        return path;
    }

    // Locate a specific spawn point in the map grid
    findSpawnPointLocation(map, spawnPointId) {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                if (map[y][x] === spawnPointId) return { x, y };
            }
        }
        return null;
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

    // Find exit location (value 3)
    findExitLocation(map) {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                if (map[y][x] === 3) return { x, y };
            }
        }
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

        const key = (x, y) => `${x},${y}`;
        let graphics;
        let drawPath;

        if (this.showDebugPaths) {
            graphics = this.add.graphics();
            drawPath = this.add.path(
                cur.x * tileSize + tileSize / 2,
                cur.y * tileSize + tileSize / 2
            );
        }

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

            if (this.showDebugPaths) {
                drawPath.lineTo(
                    cur.x * tileSize + tileSize / 2,
                    cur.y * tileSize + tileSize / 2
                );
            }
        }

        if (this.showDebugPaths) {
            graphics.lineStyle(3, 0xffffff, 1);
            drawPath.draw(graphics);
        }
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