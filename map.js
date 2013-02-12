var hex_size = 30;
var hex_3d_depth = 15;

var TILE_GRASS = 0;
var TILE_WATER = 1;
var TILE_OBSTACLE = 2;
var TILE_BASE0 = 3;
var TILE_BASE1 = 4;
var TILE_SPAWN0 = 5;
var TILE_SPAWN1 = 6;
var TILE_OBJECTIVE = 7;

/*
 * Game co-ordinates are organised in the following manner to give a straight
 * x and y axis. 
 * This aids in distance and path-finding calculations.
 * http://keekerdc.com/2011/03/hexagon-grids-coordinate-systems-and-distance-calculations/
 */
function GameMap(width, height, map_data, objectives, buildings)
{
    GameMap.baseConstructor.call(this, width, height);
    
    var x;
    var y;
    var map_obj;
    
    var map_group = create_group(mySvg);
    
    /* Build up the data map */
    for (x = 0; x < width; x++)
    {
        for (y = 0; y < height; y++)
        {
            map_obj = new Object();
            
            if (typeof map_data == 'undefined')
            {
                map_obj.tile_type = 0;
            }
            else
            {
                map_obj.tile_type = map_data[y][x];
            }
            
            map_obj.occupied = false;

            this.map[x][y] = map_obj;
        }
    }
    
    /* Build up the graphical map and add data to external structures.
     * Need to do this once we have a complete data map because tiles
     * may have dependence on others 
     */
    for (x = 0; x < width; x++)
    {
        for (y = 0; y < height; y++)
        {
            map_obj = this.map[x][y];
            
            var mx = hexmap_get_map_coord_x(x);
            var my = hexmap_get_map_coord_y(x, y);

            if (map_obj.tile_type != TILE_WATER)
            {
                var edge_array = this.get3dEdges(x, y);
                map_obj.sprite = 
                    create_hexagon
                    (
                        map_group,
                        gamemap_get_map_screenx(mx),
                        gamemap_get_map_screeny(mx, my),
                        hex_size,
                        gamemap_get_fill(map_obj.tile_type),
                        edge_array[0],
                        edge_array[1],
                        edge_array[2]
                    );
            }
            else
            {
                map_obj.sprite = undefined;
            }

            if (map_obj.tile_type == TILE_OBJECTIVE)
            {
                objectives.addObjective(hexmap_get_map_coord_x(x), hexmap_get_map_coord_y(x, y));
                map_obj.sprite_over = create_image(mySvg, gamemap_get_map_screenx(mx), gamemap_get_map_screeny(mx, my), "stones.svg");                
            }
            else if (map_obj.tile_type == TILE_SPAWN0 || map_obj.tile_type == TILE_SPAWN1)
            {
                map_obj.sprite_over = create_image(mySvg, gamemap_get_map_screenx(mx), gamemap_get_map_screeny(mx, my), "tent.svg");
            }
            else if (map_obj.tile_type == TILE_OBSTACLE)
            {
                map_obj.sprite_over = create_image(mySvg, gamemap_get_map_screenx(mx), gamemap_get_map_screeny(mx, my), "forest.svg", 1.5, 1.5);
            }
            else if (map_obj.tile_type == TILE_BASE0 || map_obj.tile_type == TILE_BASE1)
            {
                /* 0 or 1 depending on team */
                var owner = map_obj.tile_type - TILE_BASE0;

                buildings.addBuilding
                (
                    new Building
                    (
                        hexmap_get_map_coord_x(x),
                        hexmap_get_map_coord_y(x, y),
                        2,
                        5,
                        owner,
                        this,
                        undefined /* sprite */
                    )
                );

                map_obj.tile_type = TILE_GRASS;
            }
        }
    }
}    

KevLinDev.extend(GameMap, HexMap);

GameMap.prototype.get3dEdges =
    function(x, y)
    {
        var r = new Array(false,false,false);
        
        if (x % 2 == 0)
        {
            if (this.map[x-1][y].tile_type == TILE_WATER)
            {
                r[0] = true;
            }
            if (this.map[x][y+1].tile_type == TILE_WATER)
            {
                r[1] = true;
            }
            if (this.map[x+1][y].tile_type == TILE_WATER)
            {
                r[2] = true;
            }
        }
        else
        {
            for (var i = -1; i < 2; i++)
            {
                if (this.map[x+i][y+1].tile_type == TILE_WATER)
                {
                    r[i + 1] = true;
                }
            }
        }
        
        return r;
    }

GameMap.prototype.clearEventHandlers =
    function()
    {
        for (var y = 0; y < this.height; y++)
        {
            for (var x = 0; x < this.width; x++)        
            {
                this.map[x][y].sprite.removeAttribute("onclick");
            }
        }
    }

GameMap.prototype.redraw =
    function()
    {
        for (var y = 0; y < this.height; y++)
        {
            for (var x = 0; x < this.width; x++)        
            {
                var tile = this.map[x][y];
                if (tile.sprite != undefined)
                {
                    tile.sprite.setAttribute("fill", gamemap_get_fill(tile.tile_type));
                }
            }
        }
    }

GameMap.prototype.dump =
    function()
    {
        console.log("------------------------------------------------");
        console.log("Map Dump");
        console.log("width="+this.width+", height="+this.height);
        for (var y = 0; y < this.height; y++)
        {
            line = "";
            for (var x = 0; x < this.width; x++)        
            {
                line += this.map[x][y].tile_type;
            }
            console.log(line)
        }
        console.log("------------------------------------------------");
    }

GameMap.prototype.isPassable =
    function(x, y)
    {
        var tile = this.getTile(x, y);
        
        var v = tile.tile_type;
        
        if (v === TILE_GRASS || v === TILE_SPAWN0 || v === TILE_SPAWN1 || v === TILE_OBJECTIVE)
        {
            return true;
        }
        
        return false;
    }

GameMap.prototype.setOccupied =
    function(x, y, v)
    {
        var tile = this.getTile(x, y);
        tile.occupied = v;
    }

GameMap.prototype.isOccupied =
    function(x, y)
    {
        return this.getTile(x, y).occupied;
    }


function gamemap_get_fill(value)
{
    switch(value)
    {
        case 0: return "#217821"; // grass - passable
        case 1: return "blue";  // water - impassable
        case 2: return "#165016";  // blocked - impassable
        case 3: return "800000"; // team 0 base
        case 4: return "#000080"; // team 1 base
        case 5: return "#800000"; // team 0 spawn
        case 6: return "#000080"; // team 1 spawn
        case 7: return "#2CA02C"; // neutral objective
        default: return "yellow";
    }
}

function gamemap_get_hex_xoffset(r)
{
    return Math.sin(Math.PI/6) * r;
}

function gamemap_get_hex_yoffset(r)
{
    return Math.cos(Math.PI/6) * r;
}

function gamemap_get_map_screenx(x)
{
    return hex_size + x * (hex_size + gamemap_get_hex_xoffset(hex_size));
}

function gamemap_get_map_screeny(x, y)
{
    var my = hexmap_get_bufy(x, y); 
    var v = (gamemap_get_hex_yoffset(hex_size) + (my * gamemap_get_hex_yoffset(hex_size)) + (my + (x % 2)) * (gamemap_get_hex_yoffset(hex_size)));
    return v;
}
