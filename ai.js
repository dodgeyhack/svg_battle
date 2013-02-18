function ai_move_cmp_fn(a, b)
{
    return a.score - b.score;
}

function AiMove(unit)
{
    this.unit = unit;
    this.doMove = false;
    this.x = 0;
    this.y = 0;
    this.target = undefined;
    this.score = 0;
}

AiMove.prototype.setMove =
    function(x, y)
    {
        this.x = x;
        this.y = y;
        this.doMove = true;
    }
    
AiMove.prototype.attackUnit =
    function(unit)
    {
        this.target = unit;
    }
    
AiMove.prototype.setScore =
    function(v)
    {
        this.score = v;
    }

function Ai(game)
{
    this.game = game;
    
    var game_map = game.getGameMap();
    this.inf_map = new InfluenceMap(game_map.width, game_map.height, visible=true);
}

Ai.prototype.findBestMove =
    function(unit)
    {
        var game_map = this.game.getGameMap();
        var my_army = this.game.getCurrentArmy();
        
        /*
         * Need to select the unit as functions such as isValidMove
         * check for the selected game unit.
         */
        this.game.selectUnit(unit.id);

        this.inf_map.clearAll();
        
        var map_tile;
        
        var map_tiles = this.inf_map.getSurroundingHex(unit.x, unit.y, unit.move);
        var map_i;
        
        for (map_i = 0; map_i < map_tiles.length; map_i++)
        {
            //console.log("considering "+map_tiles[map_i].x+","+map_tiles[map_i].y)
            
            map_tile = game_map.getTile(map_tiles[map_i].x, map_tiles[map_i].y);
            
            /* Is this in our half - +inf if we are in defense mode +10 */
            
            /* Is this an objective +20 */
            var objective =
                this.game.objectives.getObjective
                (
                    map_tiles[map_i].x,
                    map_tiles[map_i].y
                );
            if (objective !== undefined && objective.owner != my_army.id)
            {
                this.inf_map.addInfluence
                (
                    map_tiles[map_i].x,
                    map_tiles[map_i].y,
                    20 - hexmap_distance(map_tiles[map_i].x, map_tiles[map_i].y, unit.x, unit.y)
                );            
            }
            /* Is this a good defense position - difficult access for enemy +15 */
            
            /* Does this position defend a friend +10 */
            
            /* Can I attack an enemy from here +10 */
            
            /* Can I be attacked here -15
             * But if I'm defended by a friend, then this is less of a worry
             * i.e. archer + runner vs archer + runner
             * We want runner to hit archer followed by archer hitting runner
             * We don't want the runner to be scared to take the attack.
             * Will probably be good to count wits here and have that factor
             * in.
             */
            
            /* Does this increase my view significantly +5 */
            
            /* Is it close to a danger zone - e.g. opponent spawn -10 */
        }
        
        /*
         * Make a move object and return it.
         */
        var m = new AiMove(unit);
        
        var inf_map_best = this.inf_map.getHighest();
        if (inf_map_best != undefined)
        {
            m.setScore(inf_map_best.score);
            m.setMove(inf_map_best.x, inf_map_best.y);
            console.log
            (
                "Best move for "+unit.name
                +
                " at ("+unit.x+","+unit.y+")"
                +
                " to ("+inf_map_best.x +","+ inf_map_best.y+")"
                +
                " with score="+inf_map_best.score
            );
        }
        else
        {
            console.log("No good moves for "+unit.name);
            return undefined;
        }
        
        return m;
    }

Ai.prototype.Turn =
    function()
    {
        var g = this.game;
        my_army = g.getCurrentArmy();
        
        var unit_iter = new UnitIterator(my_army);
        var unit_tracker = []
        var unit;
        var pq = new PriorityQueue(ai_move_cmp_fn);
        var done = false;
        
        var i = 0;
        while (unit_iter.moveNext())
        {
            unit = unit_iter.get();
            unit_tracker[i] = {"unit":unit, "moved":false};
            i += 1;
        }

        while (!done)
        {
            console.log("wits="+my_army.getTracker().wits);
            /*
             * Work out the move for each unit and store in a priority queue
             * ordered by move score.
             */
            unit_iter.moveFirst();
            while (unit_iter.moveNext())
            {
                unit = unit_iter.get();
                if (!unit.getTracker().moved && !unit.getTracker().attacked)
                {
                    var m = this.findBestMove(unit);
                    if (m != undefined) 
                    {
                        pq.insert(m);
                    }
                }
            }

            /*
             * Execute moves in order of score.
             */
            var move = pq.pop();
            if (move != undefined)
            {
                console.log(move.unit.name+" selected a move with score="+move.score);
                
                /* Moves and attacks won't happen if there aren't enough wits */
                g.selectUnit(move.unit.id);
                if (move.doMove)
                {
                    console.log("moving "+move.unit.name+" to "+move.x+","+move.y);
                    g.MoveCurrentUnit(move.x, move.y);
                }
                else
                {
                    console.log(move.unit.name+" decided not to move.");
                }

                if (move.target != undefined)
                {
                    console.log(unit.name+" is attacking "+move.target.name);
                    g.attackWithCurrentUnit(move.target.id);
                }
                /* Update the view after the ai has moved */
                g.updateFogOfWar();
                g.getGameMap().redraw();
            }

            pq.clear();
            
            if
            (
                move == undefined
                ||
                my_army.getTracker().wits < 1
            )
            {
                console.log(move);
                console.log(my_army.getTracker().wits);
                done = true;
            }
        }
    }