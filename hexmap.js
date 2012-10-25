function hexmap_distance(ox, oy, x, y)
{
    var dx = x - ox;
    var dy = y - oy;

    var z = -(x + y);
    var oz = -(ox + oy);
    var dz = z - oz;
    
    return Math.max(Math.abs(dx), Math.max(Math.abs(dy), Math.abs(dz)));
}

function hexmap_get_map_coord_x(buf_x)
{
    return buf_x;
}

function hexmap_get_map_coord_y(buf_x, buf_y)
{
    return buf_y - Math.floor(buf_x / 2);
}

function hexmap_get_bufx(x)
{
    return x;
}

function hexmap_get_bufy(x, y)
{
    return y + Math.floor(x / 2);
}

/*
 * Map co-ordinates are organised in the following manner to give a straight
 * x and y axis. 
 * This aids in distance and path-finding calculations.
 * http://keekerdc.com/2011/03/hexagon-grids-coordinate-systems-and-distance-calculations/
 */
function HexMap(width, height)
{
    this.width = width;
    this.height = height;

    this.map = new Array(width);
    for (var x = 0; x < width; x++)
    {
        this.map[x] = new Array(height);
    }
}
    
HexMap.prototype.getTile =
    function(x, y)
    {
        nx = hexmap_get_bufx(x);
        ny = hexmap_get_bufy(x, y);

        try
        {
            return this.map[nx][ny];
        }
        catch(e)
        {
            console.log(x);
            console.log(y);
            console.log(nx);
            console.log(ny);            
        }
    }

HexMap.prototype.validHex =
    function(x, y)
    {
        bufx = hexmap_get_bufx(x);
        bufy = hexmap_get_bufy(x, y);

        if (bufx < 0 || bufx >= this.width || bufy < 0 || bufy >= this.height)
        {
            return false;
        }

        return true;
    }

HexMap.prototype._select_hex =
    function(x, y, list, list_index)
    {
        if (!this.validHex(x, y))
        {
            return list_index;
        }

        list[list_index] = new Object();
        list[list_index].x = x;
        list[list_index].y = y;

        return list_index + 1;
    }

HexMap.prototype.getSurroundingHex =
    function(x, y, r)
    {
        var i;
        var minX = x - r;
        var maxX = x + r;

        /* Work out how big to make the array to fit the hexes */
        rlist_max = 1;
        for (i = r; i > 0; i--)
        {
            /*
             * Currently over-estimates (I think)
             */
            rlist_max += (6 * i);
        }

        var rlist = Array(rlist_max);
        var rlist_index = 0;

        for (i = minX; i <= maxX; i++)
        {
            /* don't add the center hex */
            if (!(i == x))
            {
                rlist_index = this._select_hex(i, y, rlist, rlist_index)
            }
        }

        for (j = r; j > 0; j --)
        {
            for (i = minX; i <= maxX; i++)
            {
                if (hexmap_distance(x, y, i, y + j) <= r)
                {
                    rlist_index = this._select_hex(i, y + j, rlist, rlist_index)
                }
                if (hexmap_distance(x, y, i, y - j) <= r)
                {
                    rlist_index = this._select_hex(i, y - j, rlist, rlist_index)
                }
            }
        }

        assert(rlist_index <= rlist_max);
        rlist.length = rlist_index;
        return rlist;
    }