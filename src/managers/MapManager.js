export default class MapManager extends Phaser.Scene {
    constructor() {
        super({ key: 'MapManager' });
    }

    create(data) {

        const level = data.level;
        const mapData = level.mapData;
        const decoData = level.decoData;
        const tileTypes = level.tileTypes;
        const decoTypes = level.decoTypes;

            const tileSize = this.tileSize || 64;        
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

        //this.findOpening(mapData, 'Ent');
        this.findOpening(mapData, 'Ex');

        this.mappedPath = this.findPath(mapData);
        this.worldPath = this.actualWorldPath(this.mappedPath);
        console.log(this.mappedPath);
        console.log(this.worldPath);

        //tests
        // for(let i = 0; i < this.mappedPath.length; i++){
        //     console.log(this.mappedPath[i]);
        //     console.log(this.worldPath[i]);
        // }
    }

    findOpening(map, e) {
        
        for(let y = 0; y < map.length; y++) {
            for(let x = 0; x < map[0].length; x++) {
                if(map[y][x] === 2 && e === 'Ent') {
                    console.log(`Entrance is at: {${x}, ${y}}`);
                    return {x, y};
                }
                else if(map[y][x] === 3 && e === 'Ex') {
                    console.log(`Exit is at: {${x}, ${y}}`);
                       return {x, y};
                }
            }
        }

        if(e === 'Ent'){
            console.log("Missing Entrance");
        }
        else if(e === 'Ex'){
            console.log("Missing Exit");
        }
        return null;
    }

    findPath(map) {
        const path = [];
        const visited = new Set();
        const tileSize = this.tileSize || 64;
        let cur = this.findOpening(map, 'Ent');

        var graphics = this.add.graphics();
        let drawPath = this.add.path(cur.x * tileSize + tileSize / 2, cur.y * tileSize + tileSize / 2);

        const key = (x,y) => `${x},${y}`;

        while(cur) {
            path.push(cur);
            visited.add(key(cur.x, cur.y));
            console.log(cur);

            if(map[cur.y][cur.x] === 3) {
                break;
            }

            let next = null;
            const directions = [
                {x: 0, y: -1},
                {x: 1, y: 0},
                {x: 0, y: 1},
                {x: -1, y: 0}
            ];

            for(let dir of directions) {
                let nx = cur.x + dir.x;
                let ny = cur.y + dir.y;

                if(map[ny] && (map[ny][nx] === 1 || map[ny][nx] === 3) && !visited.has(key(nx, ny))) {
                    next = { x: nx, y: ny };
                    break;
                }
            }
            cur = next;
            drawPath.lineTo((cur.x * tileSize) + (tileSize / 2), (cur.y * tileSize) + (tileSize / 2));

        }
             graphics.lineStyle(3, 0xffffff, 1);
            // visualize the path
             drawPath.draw(graphics);

        return path;
    }

    actualWorldPath(tileP) {
        const tileSize = this.tileSize || 64;

        return tileP.map(tile => ({
            x: tile.x * tileSize + tileSize / 2,
            y: tile.y * tileSize + tileSize / 2,
        }));
    }
}