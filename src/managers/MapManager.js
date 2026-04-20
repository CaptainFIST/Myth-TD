export default class MapManager extends Phaser.Scene {
    constructor() {
        super({ key: 'MapManager' });
    }

    // Build the map from tilemap data when scene starts
    create(data) {
        const level = data.level;
        const mapData = level.mapData;          
        const decoData = level.decoData;        
        const tileTypes = level.tileTypes;      
        const decoTypes = level.decoTypes;      

        const tileSize = this.tileSize || 64;   // Size of each tile in pixels
        
        // Loop through map data and place tiles and decorations
        for (let row = 0; row < mapData.length; row++) {
            for (let col = 0; col < mapData[row].length; col++) {
                const tileKey = tileTypes[mapData[row][col]];
                const decoKey = decoTypes[decoData[row][col]];
                const x = col * tileSize;
                const y = row * tileSize;

                if (tileKey) {
                    this.add.image(x, y, tileKey).setOrigin(0);
                }
                
                if (decoKey) {
                    this.add.image(x, y, decoKey).setOrigin(0).setDepth(0.5);
                }
            }
        }

        // Find the path enemies will follow
        this.findOpening(mapData, 'Ex');        
        this.mappedPath = this.findPath(mapData);  
        this.worldPath = this.actualWorldPath(this.mappedPath);  
        console.log(this.mappedPath);
        console.log(this.worldPath);
    }

    // Find entrance (2) or exit (3) points on the map
    findOpening(map, e) {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                if (map[y][x] === 2 && e === 'Ent') {
                    console.log(`Entrance is at: {${x}, ${y}}`);
                    return { x, y };
                }

                if (map[y][x] === 3 && e === 'Ex') {
                    console.log(`Exit is at: {${x}, ${y}}`);
                    return { x, y };
                }
            }
        }

        if (e === 'Ent') {
            console.log("Missing Entrance");
        } else if (e === 'Ex') {
            console.log("Missing Exit");
        }
        return null;
    }

    // Use flood-fill algorithm to find path from entrance to exit
    findPath(map) {
        const path = [];                        
        const visited = new Set();              
        const tileSize = this.tileSize || 64;

        let cur = this.findOpening(map, 'Ent');
        if (!cur) {
            console.error("No entrance found — cannot build path");
            return [];
        }

        const graphics = this.add.graphics();
        const drawPath = this.add.path(
            cur.x * tileSize + tileSize / 2,
            cur.y * tileSize + tileSize / 2
        );

        const key = (x, y) => `${x},${y}`;
        
        // Follow the path tiles (1) and exit (3) from entrance to exit
        while (cur) {
            path.push(cur);
            visited.add(key(cur.x, cur.y));

            if (map[cur.y][cur.x] === 3) {
                break;
            }

            // Look for next path tile in all 4 directions
            let next = null;
            const directions = [
                { x: 0, y: -1 },   // Up
                { x: 1, y: 0 },    // Right
                { x: 0, y: 1 },    // Down
                { x: -1, y: 0 }    // Left
            ];

            // Find first unvisited path tile in a direction
            for (let dir of directions) {
                let nx = cur.x + dir.x;
                let ny = cur.y + dir.y;
                
                // Check if tile is in bounds and is a path tile
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

    // Convert tile coordinates to world pixel coordinates
    actualWorldPath(tileP) {
        const tileSize = this.tileSize || 64;
        return tileP.map(tile => ({
            x: tile.x * tileSize + tileSize / 2,  // Center of tile
            y: tile.y * tileSize + tileSize / 2,
        }));
    }

    // Draw a debug grid overlay on the map
    drawGrid(width, height) {
        const grid = this.add.graphics();
        grid.lineStyle(1, 0x0000ff, 0.1);  

        // Draw horizontal lines
        for(var i = 0; i < ((height - 96) / 64); i++) {
            grid.moveTo(0, i * 64);
            grid.lineTo(width, i * 64);
        }

        // Draw vertical lines
        for(var j = 0; j < (width / 64); j++) {
            grid.moveTo(j * 64, 0);
            grid.lineTo(j * 64, height);
        }

        grid.strokePath();
        grid.setDepth(0);                  // Draw behind everything
        return grid;
    }
}