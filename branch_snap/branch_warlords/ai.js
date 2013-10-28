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
        var my_army_iter = new UnitIterator(my_army);

        var enemy_unit_iter = g.getEnemyUnitIterator();
        var other_unit;
        
        /*
         * Need to select the unit as functions such as isValidMove
         * check for the selected game unit.
         */
        this.game.selectUnit(unit.id);

        this.inf_map.clearAll();
        
        var map_tiles = this.inf_map.getSurroundingHex(unit.x, unit.y, unit.move);
        var map_i;
        var x, y;
        
        map_tiles.push({"x":unit.x, "y":unit.y});
        
        console.log("------FINDING BEST MOVE FOR "+unit.name+", current at ("+unit.x+","+unit.y+") --------");
        
        for (map_i = 0; map_i < map_tiles.length; map_i++)
        {
            //console.log("considering "+map_tiles[map_i].x+","+map_tiles[map_i].y)
            x = map_tiles[map_i].x;
            y = map_tiles[map_i].y;
            
            /* Skip any square that's occupied (except by this unit) or impassable */
            if (!game_map.isPassable(x, y) || (g.unitInTile(x, y) && (x != unit.x || y != unit.y)))
            {
                /* Don't set any influence and they won't get considered at all */
                continue;
            }
            
            /* Initialise the tile, otherwise we'll only consider tiles
             * affected by something below.
             * Initialise current tile to 1 so we have a tendency to stay in
             * place if there's no better options.
             */
            this.inf_map.setInfluence(x, y, (x == unit.x && y == unit.y)?1:0);
            
            /* Is this in our half - +inf if we are in defense mode +10 */
            
            /* Is this an objective +20 */
            var objective = this.game.objectives.getObjective(x, y);
            if (objective !== undefined)
            {
                if (objective.owner == my_army.id)
                {
                    /* If it's ours then it's good to stay here to defend */
                    this.inf_map.addInfluence(x, y, 4);
                }
                else
                {
                    this.inf_map.addInfluence
                    (
                        x,
                        y,
                        Math.max(0, 12 - hexmap_distance(x, y, unit.x, unit.y))
                    );            
                }
            }
            /* Is this a good defense position - difficult access for enemy +15 */
            
            /* Does this position defend a friend +10 */
            my_army_iter.moveFirst();
            while (my_army_iter.moveNext())
            {
                other_unit = my_army_iter.get();
                if (other_unit.id == unit.id)
                    continue;
                //console.log(4 - hexmap_distance(other_unit.x, other_unit.y, x, y));
                this.inf_map.addInfluence
                (
                    x,
                    y,
                    Math.max(0, 4 - hexmap_distance(other_unit.x, other_unit.y, x, y))
                );
            }
            //console.log("------");

            /* Can I attack an enemy from here +10 */
            if (!unit.getTracker().attacked)
            {
                enemy_unit_iter.moveFirst();
                while (enemy_unit_iter.moveNext())
                {
                    other_unit = enemy_unit_iter.get();

                    if
                    (
                        hexmap_distance(other_unit.x, other_unit.y, x, y)
                        <=
                        unit.range
                    )
                    {
                        console.log
                        (
                            "can attack " + other_unit.name +
                            " in (" + other_unit.x + "," + other_unit.y +
                            ") from ("+x+","+y+")"
                        );
                        /* influence will relative to the % of damage we can do 
                         * Taking the min of the ratio or the unit health is an
                         * attempt to stop powerful units moving miles to attack
                         * something that another unit could kill.
                         */
                        var dmg_ratio = Math.min(unit.damage / other_unit.health, other_unit.health);
                        this.inf_map.addInfluence(x, y, dmg_ratio * 30 + 0.5);

                        /* Add some extra influence if we can attack without moving
                         * And make it a lot if we can kill them in current location
                         * That's a no brainer move
                         */
                        if (x == unit.x && y == unit.y)
                        {
                            this.inf_map.addInfluence(x, y, dmg_ratio * 20);
                        }
                    }
                }
            }
            
            /* Can I be attacked here -15
             * But if I'm defended by a friend, then this is less of a worry
             * i.e. archer + runner vs archer + runner
             * We want runner to hit archer followed by archer hitting runner
             * We don't want the runner to be scared to take the attack.
             * Will probably be good to count wits here and have that factor
             * in.
             */
            var enemy_unit_counter = 0;
            enemy_unit_iter.moveFirst();
            while (enemy_unit_iter.moveNext())
            {
                other_unit = enemy_unit_iter.get();
                
                if
                (
                    hexmap_distance(other_unit.x, other_unit.y, x, y)
                    <=
                    (other_unit.range + other_unit.move)
                )
                {
                    if
                    (
                        enemy_unit_counter == 0
                        &&
                        unit.damage >= other_unit.health
                        &&
                        hexmap_distance(other_unit.x, other_unit.y, x, y) <= unit.range
                    )
                    {
                        /* ignore this one */
                        enemy_unit_counter += 1;
                        console.log(unit.name+": ignoring "+other_unit.name);
                    }
                    else if (other_unit.damage >= unit.health)
                    {
                        /* we are going to die if we go here */
                        this.inf_map.addInfluence(x, y, -20);
                        console.log(unit.name+": "+other_unit.name+" will kill me!");
                    }
                    else
                    {
                        /* will damage but not kill us, not so bad */
                        this.inf_map.addInfluence(x, y, -10);
                        console.log(unit.name+": not overly worried about "+other_unit.name);
                    }
                }
            }

            /* Does this increase my view significantly +5 */
            
            /* Is it close to a danger zone - e.g. opponent spawn -10 */
            
            console.log("("+x+","+y+") = "+this.inf_map.getTile(x,y).value);
        }
        
        /*
         * Make a move object and return it.
         */
        var m = new AiMove(unit);
        
        var attack_pos = {"x":unit.x, "y":unit.y};
        
        var inf_map_best = this.inf_map.getHighest();
        if (inf_map_best != undefined)
        {
            m.setScore(inf_map_best.score);
            
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
                
            if (inf_map_best.x != unit.x || inf_map_best.y != unit.y)
            {
                m.setMove(inf_map_best.x, inf_map_best.y);
            }
                
            attack_pos.x = inf_map_best.x;
            attack_pos.y = inf_map_best.y;
        }
        
        enemy_unit_iter.moveFirst();
        var attack_unit = undefined;
        var max_ratio = 0.0;
        
        while (enemy_unit_iter.moveNext())
        {
            other_unit = enemy_unit_iter.get();
            
            if
            (
                hexmap_distance(other_unit.x, other_unit.y, attack_pos.x, attack_pos.y)
                <=
                unit.range
            )
            {
                /*
                console.log
                (
                    "in position to attack " + other_unit.name +
                    " in (" + other_unit.x + "," + other_unit.y +
                    ") from ("+attack_pos.x +","+ attack_pos.y+")"
                );
                */
                /* influence will relative to the % of damage we can do */
                var dmg_ratio = unit.damage / other_unit.health;

                if (dmg_ratio > max_ratio)
                {
                    max_ratio = dmg_ratio;
                    attack_unit = other_unit;
                    //console.log(unit.name +  ", might attack" + attack_unit.name);                        
                }
            }
        }
        
        if (attack_unit == undefined && !m.doMove)
        {
            console.log("No good moves for "+unit.name + " (attack_unit="+attack_unit+", m.doMove="+m.doMove);
            return undefined;
        }
        
        m.attackUnit(attack_unit);
        
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
        
        console.log("============= DOING AI TURN ==================");

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
                if (!unit.getTracker().moved || !unit.getTracker().attacked)
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
                done = true;
            }
        }
    }