import { getChunkWidth, getChunkHeight, TILE_SIZE, CHUNK_TILE_HEIGHT } from "./world.js";

export class Camera
{
    constructor()
    {
        this.position = {x:0.0, y:0.0};
        this.zoom = {x:1.0, y:1.0};

        this.scaleMode = PIXI.settings.SCALE_MODE.NEAREST;
        APP.ticker.add((delta) => {this.update(delta)})
        this.tickCounter = 0;
        this.needsUpdate = false;
    }

    update(delta)
    {
        this.tickCounter++;
        // update every 20 ticks sounds fine
        if(this.tickCounter > 20)
        {
            this.tickCounter = 0;
            if(this.needsUpdate)
            {
                WORLD.updateMap();
                this.needsUpdate = false;
            }
        }
    }

    setScaleMode(scaleMode)
    {
        this.scaleMode = PIXI.settings.SCALE_MODE = scaleMode;
    }

    setPosition(x, y)
    {
        this.position.x = x;
        this.position.y = y;

        APP.stage.x = this.position.x;
        APP.stage.y = this.position.y;
        this.needsUpdate = true;
    }

    setZoom(x, y)
    {
        this.zoom.x = APP.stage.scale.x = x;
        this.zoom.y = APP.stage.scale.y = y;
        this.needsUpdate = true;
    }

    getCursorPosition()
    {
        var x = APP.renderer.plugins.interaction.mouse.global.x;
        var y = APP.renderer.plugins.interaction.mouse.global.y;
       // var y = (window.innerHeight - this.app.renderer.plugins.interaction.mouse.global.y);

        return {x:x, y:y};
    }

    getCursorWorldPosition()
    {
        return this.screenPosToWorldPos(this.getCursorPosition().x, this.getCursorPosition().y);
    }

    screenPosToWorldPos(x, y)
    {
        const oldScale = this.zoom.x;
        const point = {
            x: x / oldScale - this.position.x / oldScale,
            y: y / oldScale - this.position.y / oldScale
            };
       //point.y = (point.y - CHUNK_TILE_HEIGHT) * -1;
        return point;
    }

    isWorldPositionInView(x, y)
    {
        var topLeft = this.screenPosToWorldPos(0, 0);
        var bottomRight = this.screenPosToWorldPos(window.innerWidth, window.innerHeight);

        if(x < topLeft.x || x > bottomRight.x)
            return false;
        
        if(y < topLeft.y || y > bottomRight.y)
            return false;

        return true;
    }

    isXInView(x)
    {
        var topLeft = this.screenPosToWorldPos(0, 0);
        var bottomRight = this.screenPosToWorldPos(window.innerWidth, window.innerHeight);

        if(x < topLeft.x || x > bottomRight.x)
            return false;

        return true;
    }

    isYInView(y)
    {
        var topLeft = this.screenPosToWorldPos(0, 0);
        var bottomRight = this.screenPosToWorldPos(window.innerWidth, window.innerHeight);

        if(y < topLeft.y || y > bottomRight.y)
            return false;

        return true;
    }

    // gets an array of chunks that are currently in the view
    // starting from top left to bottom right
    getChunksInView()
    {
        var topLeftPos = this.screenPosToWorldPos(0, 0);
        var topLeftChunk = WORLD.getChunkPositionFromWorldPosition(topLeftPos.x, topLeftPos.y);
        console.log(topLeftChunk);
        var count = 0;

        var xChunkMax = Math.floor(((topLeftChunk.x + window.innerWidth) / getChunkWidth()) / this.zoom.x) + 2;
        var yChunkMax = Math.floor(((topLeftChunk.y + window.innerHeight) / getChunkHeight()) / this.zoom.y) + 2;

        //console.log("MAX: ", xChunkMax, " - ", yChunkMax);
        var chunkPosList = [];
        for(var x = topLeftChunk.x; x < topLeftChunk.x + xChunkMax; x++)
        {
            for(var y = topLeftChunk.y; y < topLeftChunk.y + yChunkMax; y++)
            {
                chunkPosList.push({x:x, y:y});
                count++;
            }
        }
        //console.log(count);
        return chunkPosList;
    }
}