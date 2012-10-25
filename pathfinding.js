function PathFindMap(width, height)
{
    PathFindMap.baseConstructor.call(this, width, height);
    
    for (var x = 0; x < width; x++)
    {
        for (var y = 0; y < height; y++)
        {
            var map_obj = new Object();
            map_obj.in_set = false;
            this.map[x][y] = map_obj;
        }
    }
}    

KevLinDev.extend(PathFindMap, HexMap);

PathFindMap.prototype.addTile =
    function(x, y, path_find_tile)
    {
        var tile = this.getTile(x, y);
        tile.in_set = true;
        tile.path_find_tile = path_find_tile;
    }

PathFindMap.prototype.isSet =
    function(x, y)
    {
        var tile = this.getTile(x, y);
        if (tile.in_set)
        {
            return tile.path_find_tile;
        }

        return false;
    }

function open_cmp_fn(a, b)
{
    return b.f - a.f;
}

function PathFindTile(x, y, f, g, parent)
{
    this.x = x;
    this.y = y;
    this.f = f;
    this.g = g;
    this.parent = parent;
    this.open = false;
    this.closed = false;
}

function is_path_valid(max_dist, game, start_x, start_y, dest_x, dest_y)
{
    var game_map = game.getGameMap();
    /* 
     * The open list.
     * This list contains tiles that may lead to a solution.
     * It is a priority queue, sorted lowest F to highest F.
     *
     * Where F = G + H
     * G = movement cost from start to current tile, following generated path
     * H = estimated movement cost from current tile to destination
     */
    var open = new PriorityQueue(open_cmp_fn);
    
    /*
     * A map which we store tile details in
     */
    var map = new PathFindMap(game_map.width, game_map.height);

    var g, f;

    g = 0;
    f = g + hexmap_distance(start_x, start_y, dest_x, dest_y); 

    var current_tile = new PathFindTile(start_x, start_y, f, g, null);
    map.addTile(current_tile.x, current_tile.y, current_tile);
    current_tile.open = true;
    open.insert(current_tile);

    var i;
    var adj_list;

    while (1)
    {
        current_tile = open.pop();

        // TODO: why does this sometimes return false and sometimes undefined?
        if (current_tile == false || current_tile == undefined)
        {
            // open list is empty, there is no solution
            return false;
        }
        current_tile.open = false;

        if (current_tile.x == dest_x && current_tile.y == dest_y)
        {
            // we have reached our goal.
            // All we need to do now is indicate success
            // we don't actually care about the path, just whether
            // we can get there.
            /*
            // TODO: step through parent nodes and mark path on game_map
            // for testing purposes.
            while (current_tile.parent != null)
            {
                var gm_tile = game_map.getTile(current_tile.x, current_tile.y);
                gm_tile.sprite.setAttribute("fill", "red");
                current_tile = current_tile.parent;
            }
            */
            return true;
        }

        current_tile.closed = true;

        adj_list = game.getGameMap().getSurroundingHex(current_tile.x, current_tile.y, 1);
        
        for (i = 0; i < adj_list.length; i++)
        {
            var tile = map.isSet(adj_list[i].x, adj_list[i].y);

            g = current_tile.g + 1;

            if (g > max_dist)
            {
                // ignore, as this goes past the max distance we can travel
                continue;
            }

            f = g + hexmap_distance(adj_list[i].x, adj_list[i].y, dest_x, dest_y);

            if (tile == false)
            {
                tile = new PathFindTile(adj_list[i].x, adj_list[i].y, f, g, null);
                map.addTile(adj_list[i].x, adj_list[i].y, tile);
            }

            if (tile.closed || !game_map.isPassable(adj_list[i].x, adj_list[i].y) || game.enemyInTile(adj_list[i].x, adj_list[i].y))
            {
                // ignore
                continue;
            }

            if (tile.open)
            {
                // compare newly calculated G cost against stored G cost
                // if new G is lower, replace
                if (g < tile.g)
                {
                    tile.f = f;
                    tile.g = g;
                    tile.parent = current_tile;
                    // need to re-sort open list, as f has changed
                    open.resort();
                }
            }
            else
            {
                // I'm pretty sure in this case, we will always have created a new node
                // (if both open and closed are false, this tile has never been in the map)
                // so probably don't need to set f and g. But for now we'll set it just in case.
                tile.f = f;
                tile.g = g;
                tile.open = true;
                open.insert(tile);
                tile.parent = current_tile;
            }
        }
    }
}

