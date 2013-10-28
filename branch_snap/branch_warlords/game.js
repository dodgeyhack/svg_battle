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
    this.ai = undefined;
    this.baseWits = 2;
    this.wits = 0;
}

ArmyTracker.prototype.setAi =
    function(ai)
    {
        this.ai = ai;
    }

ArmyTracker.prototype.reset =
    function()
    {
        this.wits += this.baseWits + this.objectives;
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
    
    var building_iter = new BuildingIterator(this.buildings);
    var building;

    /* Buildings must be placed last so they don't overlap with the hexes */
    while (building_iter.moveNext())
    {
        building = building_iter.get();
        building.setSprite(new Sprite("building", building.owner == 0 ? "red" : "blue"));
    }

    this.num_teams = 2;
    
    this.armies = new Array(this.num_teams);
    
    this.armies[0] = new Army("red", this);
    this.armies[1] = new Army("blue", this);
    
    this.armies[0].setTracker(new ArmyTracker());
    this.armies[1].setTracker(new ArmyTracker());
    
    this.armies[1].getTracker().setAi(new Ai(this));
    
    this.armies[0].getUnit(0).moveTo(2, 5);
    this.game_map.setOccupied(2, 5, true);
    this.armies[0].getUnit(0).setTracker(new UnitTracker());
    
    this.armies[0].getUnit(1).moveTo(4, 4);
    this.game_map.setOccupied(4, 4, true);    
    this.armies[0].getUnit(1).setTracker(new UnitTracker());
    
    this.armies[0].getUnit(2).moveTo(7, 6);
    this.game_map.setOccupied(7, 6, true);    
    this.armies[0].getUnit(2).setTracker(new UnitTracker());

    this.armies[0].getUnit(3).moveTo(6, 6);
    this.game_map.setOccupied(6, 6, true);    
    this.armies[0].getUnit(3).setTracker(new UnitTracker());

    this.armies[1].getUnit(0).moveTo(12, 0);
    this.game_map.setOccupied(12, 0, true);    
    this.armies[1].getUnit(0).setTracker(new UnitTracker());
    
    this.armies[1].getUnit(1).moveTo(10, 1);
    this.game_map.setOccupied(10, 1, true);
    this.armies[1].getUnit(1).setTracker(new UnitTracker());
    
    this.armies[1].getUnit(2).moveTo(10, 3);
    this.game_map.setOccupied(10, 3, true);
    this.armies[1].getUnit(2).setTracker(new UnitTracker());

    this.armies[1].getUnit(3).moveTo(11, 3);
    this.game_map.setOccupied(11, 3, true);
    this.armies[1].getUnit(3).setTracker(new UnitTracker());

    this.finished = false;
    
    /* Start the first turn. We know cur_team will be incremented in nextTurn */
    this.cur_team = -1;
    this.nextTurn();    
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

Game.prototype.getEnemyBuildingIterator =
    function()
    {
        return new BuildingIterator(this.buildings, this.cur_team);
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
        return is_path_valid
               (
                   unit.move,
                   this,
                   unit.x,
                   unit.y,
                   x,
                   y,
                   get_path_find_walk_test_fn(this)
               );
    }

Game.prototype.unitInTile =
    function(x, y)
    {
        var unit_iter = new UnitIterator(this.getCurrentArmy());
        var unit;
        
        while (unit_iter.moveNext())
        {
            unit = unit_iter.get();
            if (unit.x == x && unit.y == y)
            {
                return true;
            }
        }
        
        return this.enemyInTile(x, y);
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

Game.prototype.attackBuildingWithCurrentUnit =
    function(building_x, building_y)
    {
        var building = this.buildings.getBuilding(building_x, building_y);
        var unit = this.getCurrentUnit();

        unit.doDamageToBuilding(building);

        if (building.isDead())
        {
            console.log("Building is dead, how sad =[ ");
            /* FIXME: Should do something here */
        }

        this.getCurrentArmy().getTracker().useWit();
    }

Game.prototype.updateFogOfWar =
    function()
    {
        this.game_map.obscureAll();
        
        var unit_iter = new UnitIterator(this.getCurrentArmy());
        var unit;
        var visible_list;
        var posi;
        var max_dist;

        while (unit_iter.moveNext())
        {
            unit = unit_iter.get();
            /* Clear any opacity that may have been set before */
            unit.sprite.setOpacity(1);
            
            max_dist = Math.max(unit.move, unit.range);
            
            this.game_map.setVisible(unit.x, unit.y);
            
            visible_list = 
                this.game_map.getSurroundingHex
                (
                    unit.x,
                    unit.y,
                    max_dist
                );

            for (posi = 0; posi < visible_list.length; posi++)
            {
                if
                (
                    is_path_valid
                    (
                        max_dist,
                        this,
                        unit.x,
                        unit.y,
                        visible_list[posi].x,
                        visible_list[posi].y,
                        get_path_find_visible_test_fn(this)
                    )
                )
                {
                    this.game_map.setVisible
                    (
                        visible_list[posi].x,
                        visible_list[posi].y
                    );
                }    
            }
        }

        unit_iter = this.getEnemyUnitIterator();
        while (unit_iter.moveNext())
        {
            unit = unit_iter.get();
            if (this.game_map.getTile(unit.x, unit.y).obscured)
            {
                unit.sprite.setOpacity(0.3);
            }
            else
            {
                unit.sprite.setOpacity(1);
            }
        }
    }
    
/* Hah! Finally managed to use closures */
function get_path_find_walk_test_fn(game)
{
    return function(x, y, dest_x, dest_y)
    {
        return (
            game.getGameMap().isPassable(x, y)
            &&
            !game.enemyInTile(x, y)
        );
    }
}

function get_path_find_visible_test_fn(game)
{
    return function(x, y, dest_x, dest_y)
    {
        var game_map = game.getGameMap();
       
        return (
                game_map.isPassable(x, y)
                ||
                game_map.getTile(x,y).tile_type == TILE_WATER
            )
            &&
            (
                (x == dest_x && y == dest_y)
                ||
                !game.enemyInTile(x, y)
            );
    }
}
