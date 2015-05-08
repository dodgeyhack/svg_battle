function GameFlow(game)
{
    this.game = game;
    this.unit_iterators = new Array(game.num_teams);
    for (var i = 0; i < game.num_teams; i++) {
        this.unit_iterators[i] = new UnitIterator(game.armies[i]);
    }
    this.current_army = 0;
    this.turn_num = 0;
}

GameFlow.prototype.turn =
    function()
    {
        var army = this.current_army;
        if (false === this.unit_iterators[army].moveNext()) {
            this.game.nextTurn();
            this.current_army += 1;
            this.current_army %= this.game.num_teams;
            this.unit_iterators[this.current_army].moveFirst();
            if (this.current_army === 0)
                this.turn_num += 1;
            return this.turn();
        }
        
        var unit = this.unit_iterators[army].get();
        var ai = this.game.armies[this.current_army].getTracker().ai;
        ai.singleUnitTurn(unit);
    }
