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

function ArmyTracker()
{
    this.objectives = 0;
    this.reset();
}

ArmyTracker.prototype.reset =
    function()
    {
        this.wits = 2 + this.objectives;
    }

ArmyTracker.prototype.useWit =
    function()
    {
        this.wits--;
    }

ArmyTracker.prototype.hasWits =
    function()
    {
        return (this.wits > 0 ? true : false);
    }

function Game()
{
    this.objectives = new ObjectiveStore();
    this.buildings = new BuildingStore();
    this.game_map = new GameMap(15, 11, sharkfood_island_map, this.objectives, this.buildings);

    this.num_teams = 2;
    
    this.armies = new Array(this.num_teams);
    
    this.armies[0] = new Army("red", this);
    this.armies[1] = new Army("blue", this);
    
    this.armies[0].setTracker(new ArmyTracker());
    this.armies[1].setTracker(new ArmyTracker());
    
    this.armies[0].getUnit(0).moveTo(2, 5);
    this.game_map.setOccupied(2, 5, true);
    this.armies[0].getUnit(0).setTracker(new UnitTracker());
    
    this.armies[0].getUnit(1).moveTo(4, 4);
    this.game_map.setOccupied(4, 4, true);    
    this.armies[0].getUnit(1).setTracker(new UnitTracker());
    
    this.armies[0].getUnit(2).moveTo(7, 6);
    this.game_map.setOccupied(7, 6, true);    
    this.armies[0].getUnit(2).setTracker(new UnitTracker());

    this.armies[1].getUnit(0).moveTo(12, 0);
    this.game_map.setOccupied(12, 0, true);    
    this.armies[1].getUnit(0).setTracker(new UnitTracker());
    
    this.armies[1].getUnit(1).moveTo(10, 1);
    this.game_map.setOccupied(10, 1, true);
    this.armies[1].getUnit(1).setTracker(new UnitTracker());
    
    this.armies[1].getUnit(2).moveTo(10, 3);
    this.game_map.setOccupied(10, 3, true);
    this.armies[1].getUnit(2).setTracker(new UnitTracker());
    
    this.cur_team = 0;

    this.finished = false;
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

        this.getCurrentArmy().getTracker().reset();
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

Game.prototype.getEnemyArmy =
    function()
    {
        return this.armies[(this.cur_team + 1) % this.num_teams];
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
        if (!this.getCurrentArmy().getTracker().hasWits())
        {
            return;
        }

        var unit = this.getCurrentUnit();

        this.game_map.setOccupied(unit.x, unit.y, false);
        unit.moveTo(mx, my);
        unit.getTracker().moved = true;
        this.game_map.setOccupied(mx, my, true);

        this.getCurrentArmy().getTracker().useWit();
   
        var objective = this.objectives.getObjective(mx, my);

        if (objective !== undefined)
        {
            var enemy_army = this.getEnemyArmy();
            var army = this.getCurrentArmy();

            if (objective.owner == enemy_army.id)
            {
                enemy_army.getTracker().objectives--;
            }
            objective.setOwner(army.id);
            army.getTracker().objectives++;
            console.log("Took objective");
        }
    }

Game.prototype.isValidMove =
    function (x, y)
    {
        if (!this.getCurrentArmy().getTracker().hasWits())
        {
            return false;
        }

        if (this.buildings.isBuilding(x, y))
        {
            return false;
        }
        
        var unit = this.getCurrentUnit();
        return is_path_valid(unit.move, this, unit.x, unit.y, x, y);
    }

Game.prototype.enemyInTile =
    function(x, y)
    {
        var ui = new UnitIterator(this.armies[(this.cur_team + 1) % this.num_teams]);
        var unit;
    
        while (ui.moveNext())
        {
            unit = ui.get();
            if (unit.x == x && unit.y == y)
            {
                return true;
            }       
        }
        return false;
    }

Game.prototype.attackWithCurrentUnit =
    function(target_id)
    {
        if (!this.getCurrentArmy().getTracker().hasWits())
        {
            return;
        }
        
        var unit = this.getCurrentUnit();
        var enemy = this.armies[(this.cur_team + 1) % this.num_teams];
        var target = enemy.getUnit(target_id);
        
        unit.doDamage(target);

        if (target.isDead())
        {
            this.game_map.setOccupied(target.x, target.y, false);
            enemy.removeUnit(target_id);
            target.destroy();
            
            if (enemy.num_units == 0)
            {
                this.finished = true;
                this.winner = this.cur_team;
            }
        }        
        
        unit.getTracker().attacked = true;

        this.getCurrentArmy().getTracker().useWit();
    }
