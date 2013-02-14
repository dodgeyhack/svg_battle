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
        this.score = score;
    }

function Ai(game)
{
    this.game = game;
}

Ai.prototype.findBestMove =
    function(unit)
    {
        var m = new AiMove(unit);
        
        /*
         * Need to select the unit as functions such as isValidMove
         * check for the selected game unit.
         */
        this.game.selectUnit(unit.id);
        
        m.score = unit.health;
        
        var x = unit.x;
        var y = unit.y;
        
        /*
         * Problem here is that a valid move may be valid when we calculate
         * the best move but then one of our guys may move into the space.
         * Or an enemy may die and make a better move.
         * Might be best to recalculate the best moves after each
         * unit has their turn.
         */

        if
        (
            this.game.isValidMove(x-1, y)
            &&
            !this.game.unitInTile(x-1, y)
        )
        {
            m.setMove(x-1, y);
        }
        else if
        (
            this.game.isValidMove(x, y-1)
            &&
            !this.game.unitInTile(x, y-1)
        )
        {
            m.setMove(x, y-1);
        }
        else if
        (
            this.game.isValidMove(x, y+1)
            &&
            !this.game.unitInTile(x, y+1)
        )
        {
            m.setMove(x, y+1);
        }
        
        return m;
    }

Ai.prototype.Turn =
    function()
    {
        my_army = this.game.getCurrentArmy();
        
        var unit_iter = new UnitIterator(my_army);
        var unit;
        var pq = new PriorityQueue(ai_move_cmp_fn);
        
        /*
         * Work out the move for each unit and store in a priority queue
         * ordered by move score.
         */
        while (unit_iter.moveNext())
        {
            unit = unit_iter.get();
            var m = this.findBestMove(unit);
            
            pq.insert(m);
        }
        
        /*
         * Execute moves in order of score.
         */
        console.log('AI has '+this.game.getCurrentArmy().getTracker().wits+' wits.');
        
        var move = pq.pop();
        while (move != undefined)
        {
            /* Moves and attacks won't happen if there aren't enough wits */
            this.game.selectUnit(move.unit.id);
            if (move.doMove)
            {
                this.game.MoveCurrentUnit(move.x, move.y);
            }
            
            if (move.target != undefined)
            {
                this.game.attackWithCurrentUnit(move.target.id);
            }
            
            move = pq.pop();
        }
    }