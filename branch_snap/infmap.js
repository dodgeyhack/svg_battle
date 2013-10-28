function InfluenceMap(width, height)
{
    InfluenceMap.baseConstructor.call(this, width, height, visible=true);
    
    this.max_list = undefined;
    this.max_value = undefined;
    
    this.MIN_INFLUENCE = -1000;
    this.MAX_INFLUENCE = 1000;
    
    for (var i = 0; i < this.width; i++)
    {
        for (var j = 0; j < this.height; j++)
        {
            this.map[i][j] = {"value":undefined};
        }
    }
}

KevLinDev.extend(InfluenceMap, HexMap);

InfluenceMap.prototype.clearAll =
    function()
    {
        for (var i = 0; i < this.width; i++)
        {
            for (var j = 0; j < this.height; j++)
            {
                this.map[i][j].value = undefined;
            }
        }
    }

InfluenceMap.prototype._influence_map_set_tile_value =
    function(tile, x, y, influence)
    {
        tile.value = influence;

        tile.value = Math.min(this.MAX_INFLUENCE, tile.value);
        tile.value = Math.max(this.MIN_INFLUENCE, tile.value);
    }

InfluenceMap.prototype.addInfluence =
    function(x, y, influence)
    {
        var tile = this.getTile(x, y);
        if (tile.value === undefined) tile.value = 0;
        this._influence_map_set_tile_value(tile, x, y, tile.value += influence);

    }

InfluenceMap.prototype.setInfluence =
    function(x, y, influence)
    {
        this._influence_map_set_tile_value(this.getTile(x, y), x, y, influence);
    }

InfluenceMap.prototype.getHighest = 
    function()
    {
        max_value = undefined;
        max_list = undefined;
        
        for (var i = 0; i < this.width; i++)
        {
            for (var j = 0; j < this.height; j++)
            {
                if (this.map[i][j].value === undefined)
                    continue;
                
                if (max_list == undefined || this.map[i][j].value > max_value)
                {
                    max_value = this.map[i][j].value;
                    max_list = [];
                    max_list.push
                    (
                        {
                            "x":hexmap_get_map_coord_x(i),
                            "y":hexmap_get_map_coord_y(i,j),
                            "score":this.map[i][j].value
                        }
                    );
                }
                else if (this.map[i][j].value == max_value)
                {
                    max_list.push
                    (
                        {
                            "x":hexmap_get_map_coord_x(i),
                            "y":hexmap_get_map_coord_y(i,j),
                            "score":this.map[i][j].value
                        }
                    );
                }            
            }
        }
        
        if (max_list == undefined)
        {
            return undefined;
        }
        //FIXME: return a random selection
        return max_list[0];
    }
