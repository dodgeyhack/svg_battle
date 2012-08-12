var hex_size = 50;

/*
 * Game co-ordinates are organised in the following manner to give a straight
 * x and y axis. 
 * This aids in distance and path-finding calculations.
 * http://keekerdc.com/2011/03/hexagon-grids-coordinate-systems-and-distance-calculations/
 */
function GameMap(width, height)
{
    GameMap.baseConstructor.call(this, width, height);

    for (var x = 0; x < width; x++)
    {
        for (var y = 0; y < height; y++)
        {
            var map_obj = new Object();
        
            if (x == 0 || x == width - 1 || y == 0 || y == height - 1)
            {
                map_obj.tile_type = 1;
                
            }
            else if (Math.random() < 0.18)
            {
                map_obj.tile_type = 2;
            }
            else
            {
                map_obj.tile_type = 0;
            }

            map_obj.sprite = 
                create_hexagon
                (
                    gamemap_get_map_screenx(x),
                    gamemap_get_map_screeny(x, y),
                    hex_size,
                    gamemap_get_fill(map_obj.tile_type)
                );
            
            this.map[x][y] = map_obj;
        }
    }
}    

KevLinDev.extend(GameMap, HexMap);

GameMap.prototype._select_hex =
    function(x, y, list, list_index)
    {
        if (!this.validHex(x, y))
        {
            return list_index;
        }

        list[list_index] = new Object();
        list[list_index].x = x;
        list[list_index].y = y;

        console.print(list_index + 1);
        return list_index + 1;
    }
    
    
GameMap.prototype.getMapScreenX =
    function(x)
    {
        return gamemap_get_map_screenx(this.getBufX(x));
    }
        
GameMap.prototype.getMapScreenY =
    function(x, y)
    {
        return gamemap_get_map_screeny(x, this.getBufY(x, y));
    }

function gamemap_get_fill(value)
{
    switch(value)
    {
        case 0: return "green";
        case 1: return "blue";
        case 2: return "gray";
    }
}

function gamemap_hex_click(evt) {
    var hex = evt.target;
    hex.setAttribute("fill", "white");
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
    return(
        gamemap_get_hex_yoffset(hex_size) 
        +
        (y * gamemap_get_hex_yoffset(hex_size))
        +
        (y + (x % 2)) * (gamemap_get_hex_yoffset(hex_size))
    );
}
