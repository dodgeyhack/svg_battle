var hex_size = 30;

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
    
    for (var x = 0; x < width; x++)
    {
        for (var y = 0; y < height; y++)
        {
            var map_obj = new Object();

            if (typeof map_data == 'undefined')
            {
                map_obj.tile_type = 0;
            }
            else
            {
                map_obj.tile_type = map_data[y][x];
            
                if (map_obj.tile_type == TILE_OBJECTIVE)
                {
                    objectives.addObjective(hexmap_get_map_coord_x(x), hexmap_get_map_coord_y(x, y));
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
                            new Sprite("building", owner == 0 ? "red" : "blue")
                        )
                    );

                    map_obj.tile_type = TILE_GRASS;
                }
            }
            
            var mx = hexmap_get_map_coord_x(x);
            var my = hexmap_get_map_coord_y(x, y);

            map_obj.occupied = false;
            map_obj.sprite = create_hexagon(gamemap_get_map_screenx(mx), gamemap_get_map_screeny(mx, my), hex_size, gamemap_get_fill(map_obj.tile_type));
                
            this.map[x][y] = map_obj;
        }
    }
}    

KevLinDev.extend(GameMap, HexMap);

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
                tile.sprite.setAttribute("fill", gamemap_get_fill(tile.tile_type));
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
        case 0: return "green"; // grass - passable
        case 1: return "blue";  // water - impassable
        case 2: return "gray";  // blocked - impassable
        case 3: return "white"; // team 0 base
        case 4: return "black"; // team 1 base
        case 5: return "rgb(220,220,220)"; // team 0 spawn
        case 6: return "rgb(35,35,35)"; // team 1 spawn
        case 7: return "cyan"; // neutral objective
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
