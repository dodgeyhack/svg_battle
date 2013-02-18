function InfluenceMap(width, height)
{
    InfluenceMap.baseConstructor.call(this, width, height, visible=true);
    
    this.max_list = undefined;
    this.max_value = undefined;
    
    for (var i = 0; i < this.width; i++)
    {
        for (var j = 0; j < this.height; j++)
        {
            this.map[i][j] = {"value":0};
        }
    }
}

KevLinDev.extend(InfluenceMap, HexMap);

InfluenceMap.prototype.clearAll =
    function()
    {
        this.max_value = undefined;
        this.max_list = undefined;
        
        for (var i = 0; i < this.width; i++)
        {
            for (var j = 0; j < this.height; j++)
            {
                this.map[i][j].value = 0;
            }
        }
    }

InfluenceMap.prototype.addInfluence =
    function(x, y, influence)
    {
        var tile = this.getTile(x, y);
        tile.value += influence;
        
        if (this.max_list == undefined || tile.value > this.max_value)
        {
            this.max_value = tile.value;
            this.max_list = [];
            this.max_list.push({"x":x, "y":y, "score":tile.value});
        }
        else if (tile.value == this.max_value)
        {
            this.max_list.push({"x":x, "y":y, "score":tile.value});
        }
    }

InfluenceMap.prototype.getHighest = 
    function()
    {
        if (this.max_list == undefined)
        {
            return undefined;
        }
        else
        {
            //FIXME: return a random selection
            return this.max_list[0];
        }
    }
