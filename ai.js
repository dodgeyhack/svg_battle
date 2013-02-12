function Ai(game)
{
    this.game = game;
}

Ai.prototype.Turn =
    function()
    {
        my_army = this.game.getCurrentArmy();
        
        var unit_iter = new UnitIterator(my_army);
        
        while (unit_iter.moveNext())
        {
            var unit = unit_iter.get();
            
            this.game.selectUnit(unit.id);
            
            var x = unit.x;
            var y = unit.y;
            
            if
            (
                this.game.isValidMove(x-1, y)
                &&
                !this.game.unitInTile(x-1, y)
            )
            {
                this.game.MoveCurrentUnit(x-1, y);
            }
            else if
            (
                this.game.isValidMove(x, y-1)
                &&
                !this.game.unitInTile(x, y-1)
            )
            {
                this.game.MoveCurrentUnit(x, y-1);
            }
            else if
            (
                this.game.isValidMove(x, y+1)
                &&
                !this.game.unitInTile(x, y+1)
            )
            {
                this.game.MoveCurrentUnit(x, y+1);
            }
        }
        
        
    }