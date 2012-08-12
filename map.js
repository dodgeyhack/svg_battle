var hex_size = 50;

function Map(width, height)
{
    this.width = width;
    this.height = height;

    this.map = new Array(width);
    for (var x = 0; x < width; x++)
    {
        this.map[x] = new Array(height);
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
                    get_map_screenx(x),
                    get_map_screeny(x, y),
                    hex_size,
                    map_get_fill(map_obj.tile_type)
                );
            
            this.map[x][y] = map_obj;
        }
    }
    
    /*
     * Game co-ordinates are organised in the following manner to give a straight
     * x and y axis. 
     * This aids in distance and path-finding calculations.
     * http://keekerdc.com/2011/03/hexagon-grids-coordinate-systems-and-distance-calculations/
     *
     *               y x
     * /  \  /  \  /  \   |  \
     *  00 --2 -1-- 
     * \  /  \  /  \  /   |   \
     *  -- 10 --    --
     * /  \  /  \  /  \   V    _|
     *  01    20 -- 
     * \  /  \  /  \  /
     *  -- 11 -- 30 -- 
     * /  \  /  \  /  \
     *  02 -- 12 -- 40
     * \  /  \  /  \  / 
     */
    
    this.getTile =
        function(x, y)
        {
            nx = x;
            ny = y + Math.floor(x / 2);
            
            console.log("getTile("+x+", "+y+") = " + "("+nx+", "+ny+")");
            
            return this.map[nx][ny];
        }
    
    this._select_hex =
        function(x, y, list, list_index)
        {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            {
                return;
            }
            
            list[list_index] = new Object();
            list[list_index].x = x;
            list[list_index].y = y;
            
            return list_index + 1;
        }

    
    this.getSurroundingR =
        function(x, y, r)
        {
            var minX = x - r;
            var maxX = x + r;
            
            var rlist = Array(r * r);
            var rlist_index = 0;
            
            for (var i = minX; i <= maxX; i++)
            {
                rlist_index = this._select_hex(i, y, rlist, rlist_index)
            }
            
            for (j = r; j > 0; j --)
            {
                for (var i = minX; i <= maxX; i++)
                {
                    if (map_distance(x, y, i, y + j) <= r)
                    {
                        rlist_index = this._select_hex(i, y + j, rlist, rlist_index)
                    }
                    if (map_distance(x, y, i, y - j) <= r)
                    {
                        rlist_index = this._select_hex(i, y - j, rlist, rlist_index)
                    }
                }
            }

            rlist.length = rlist_index;            
            return rlist;
        }

    this.getSurrounding =
        function(x, y)
        {
            var rlist = Array(6);

            var i = 0;

            if (y > 0)
            {
                rlist[i] = new Object();
                rlist[i].x = x;
                rlist[i].y = y - 1;
                i++;

                if (!(x % 2))
                {
                    if (x > 0)
                    {
                        rlist[i] = new Object();
                        rlist[i].x = x - 1;
                        rlist[i].y = y - 1;
                        i++;
                    }

                    if (x < this.width -1)
                    {
                        rlist[i] = new Object();
                        rlist[i].x = x + 1;
                        rlist[i].y = y - 1;
                        i++;
                    }
                }                
            }

            if (x > 0)
            {
                rlist[i] = new Object();
                rlist[i].x = x - 1;
                rlist[i].y = y;
                i++;
            }

            if (x < this.width -1)
            {
                rlist[i] = new Object();
                rlist[i].x = x + 1;
                rlist[i].y = y;
                i++;
            }

            if (y < this.height - 1)
            {
                rlist[i] = new Object();
                rlist[i].x = x;
                rlist[i].y = y + 1;
                i++;

                if (x % 2)
                {
                    if (x > 0)
                    {
                        rlist[i] = new Object();
                        rlist[i].x = x - 1;
                        rlist[i].y = y + 1;
                        i++;
                    }

                    if (x < this.width -1)
                    {
                        rlist[i] = new Object();
                        rlist[i].x = x + 1;
                        rlist[i].y = y + 1;
                        i++;
                    }
                }
            }

            rlist.length = i;
            return rlist;        
        }
}

function map_distance(ox, oy, x, y)
{
    var dx = x - ox;
    var dy = y - oy;

    var z = -(x + y);
    var oz = -(ox + oy);
    
    var dz = z - oz;
    
    var d = max(dx, max(dy, dz));
    
    console.log("("+ox+", "+oy+", "+oz+") to ("+x+", "+y+", "+z+") = " + d);
    console.log("Max("+dx+", "+dy+", "+dz+") = "+d);
    return d;
}

function map_get_fill(value)
{
    switch(value)
    {
        case 0: return "green";
        case 1: return "blue";
        case 2: return "gray";
    }
}

function map_click(evt) {
    var hex = evt.target;
    hex.setAttribute("fill", "white");
}

function get_hex_xoffset(r)
{
    return Math.sin(Math.PI/6) * r;
}

function get_hex_yoffset(r)
{
    return Math.cos(Math.PI/6) * r;
}

function get_map_screenx(x)
{
    return hex_size + x * (hex_size + get_hex_xoffset(hex_size));
}

function get_map_screeny(x, y)
{
    return get_hex_yoffset(hex_size) + (y * get_hex_yoffset(hex_size)) + (y + (x % 2)) * (get_hex_yoffset(hex_size));
}