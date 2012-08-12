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
     */
     
     this.getBufX =
        function(x)
         {
            return x;
         }
     
     this.getBufY =
        function(x, y)
         {
            return y + Math.floor(x / 2);
         }
    
    this.getTile =
        function(x, y)
        {
            nx = this.getBufX(x);
            ny = this.getBufY(x, y);
            
            return this.map[nx][ny];
        }
    
    this._select_hex =
        function(x, y, list, list_index)
        {
            bufx = this.getBufX(x);
            bufy = this.getBufY(x, y);
        
            if (bufx < 0 || bufx >= this.width || bufy < 0 || bufy >= this.height)
            {
                return list_index;
            }
            
            list[list_index] = new Object();
            list[list_index].x = x;
            list[list_index].y = y;
            
            console.print(list_index + 1);
            return list_index + 1;
        }
    
    this.getSurroundingR =
        function(x, y, r)
        {
            var minX = x - r;
            var maxX = x + r;

            rlist_max = 1;
            for (i = r; i > 0; i--)
            {
                rlist_max += (6 * i);
            }
            console.log(rlist_max);
            
            var rlist = Array(rlist_max);
            var rlist_index = 0;
            
            console.log("------------------------");
            
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

            console.log(rlist_index);

            assert(rlist_index <= rlist_max);
            rlist.length = rlist_index;
            return rlist;
        }
        
    this.getMapScreenX =
        function(x)
        {
            return get_map_screenx(this.getBufX(x));
        }
        
    this.getMapScreenY =
        function(x, y)
        {
            console.log(x+","+y);
            v = get_map_screeny(x, this.getBufY(x, y));
            console.log("v="+v);
            return v;
        }
}

function map_distance(ox, oy, x, y)
{
    var dx = x - ox;
    var dy = y - oy;

    var z = -(x + y);
    var oz = -(ox + oy);
    
    var dz = z - oz;
    
    var d = Math.max(Math.abs(dx), Math.max(Math.abs(dy), Math.abs(dz)));
    
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