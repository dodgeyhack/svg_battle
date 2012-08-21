function UnitTracker()
{
    this.reset();    
}

UnitTracker.prototype.reset =
    function()
    {
        this.moved = false;
        this.attacked = false;
    }

function Game()
{
    this.game_map = new GameMap(15, 11, sharkfood_island_map);

    this.num_teams = 2;
    
    this.armies = new Array(this.num_teams);
    
    this.armies[0] = new Army("red", this);
    this.armies[1] = new Army("blue", this);
    
    this.armies[0].getUnit(0).moveTo(2, 5);
    this.armies[0].getUnit(0).setTracker(new UnitTracker());
    
    this.armies[0].getUnit(1).moveTo(4, 4);
    this.armies[0].getUnit(1).setTracker(new UnitTracker());
    
    this.armies[0].getUnit(2).moveTo(7, 6);
    this.armies[0].getUnit(2).setTracker(new UnitTracker());

    this.armies[1].getUnit(0).moveTo(12, 0);
    this.armies[1].getUnit(0).setTracker(new UnitTracker());
    
    this.armies[1].getUnit(1).moveTo(10, 1);
    this.armies[1].getUnit(1).setTracker(new UnitTracker());
    
    this.armies[1].getUnit(2).moveTo(10, 3);
    this.armies[1].getUnit(2).setTracker(new UnitTracker());
    
    this.cur_team = 0;
}

Game.prototype.nextTurn =
    function()
    {
        this.cur_team += 1;
        this.cur_team %= this.num_teams;
        
        var ui = new UnitIterator(this.armies[this.cur_team]);
        var unit;
        
        while (ui.moveNext())
        {
            unit = ui.get();
            unit.getTracker().reset();
        }
    }
    
Game.prototype.getGameMap =
    function()
    {
        return this.game_map;
    }
    
Game.prototype.getCurrentArmy =
    function()
    {
        return this.armies[this.cur_team];
    }
    
Game.prototype.getEnemyUnitIterator =
    function()
    {
        return new UnitIterator(this.armies[(this.cur_team + 1) % this.num_teams]);
    }
    
Game.prototype.selectUnit =
    function(unit_id)
    {
        this.cur_unit = unit_id;
    }

Game.prototype.getCurrentUnit =
    function()
    {
        return this.getCurrentArmy().getUnit(this.cur_unit);
    }
    
Game.prototype.MoveCurrentUnit =
    function(mx, my)
    {
        var unit = this.getCurrentUnit();
        this.game_map.setOccupied(unit.x, unit.y, false);
        unit.moveTo(mx, my);
        unit.getTracker().moved = true;
        this.game_map.setOccupied(mx, my, true);
    }
    
Game.prototype.attackWithCurrentUnit =
    function(target_id)
    {
        var unit = this.getCurrentUnit();
        var enemy = this.armies[(this.cur_team + 1) % this.num_teams];
        var target = enemy.getUnit(target_id);
        
        unit.doDamage(target);

        if (target.isDead())
        {
            this.game_map.setOccupied(target.x, target.y, false);
            enemy.removeUnit(target_id);
            target.destroy();
        }        
        
        unit.getTracker().attacked = true;
    }
