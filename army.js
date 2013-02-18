var _next_army_id = 0;

function Army(colour, game)
{
    this.colour = colour;
    this.units = Array(4);

    /*
     *  FIXME: proper army generation
     *  This is currently just a hack.
     */
    this.units[0] = new Unit(0, "Gary the heavy", new Sprite("heavy_"+colour, colour), 2, 4, 3, 1, game);
    this.units[1] = new Unit(1, "Bill the spearman", new Sprite("spearman_"+colour, colour), 3, 3, 2, 1, game);
    this.units[2] = new Unit(2, "Robby the runner", new Sprite("runner_"+colour, colour), 5, 1, 1, 1, game);
    this.units[3] = new Unit(3, "Finduilas the archer", new Sprite("archer_"+colour, colour), 1, 1, 3, 3, game);
    
    this.num_units = this.units.length;

    this.id = _next_army_id;
    _next_army_id++;
}

Army.prototype.getUnit =
    function(unit_id)
    {
        return this.units[unit_id];
    }
    
Army.prototype.addUnit =
    function(unit)
    {
        var id = unit.getId();
        
        if (this.units.length < (id - 1))
        {
            this.units.length = id;changeText
        }
        
        this.units[id] = unit;
        
        this.num_units++;
    }

Army.prototype.removeUnit =
    function(unit_id)
    {
        delete this.units[unit_id];
        this.num_units--;
    }


Army.prototype.setTracker =
    function(tracker)
    {
        this.tracker = tracker;
    }

Army.prototype.getTracker =
    function()
    {
        return this.tracker;
    }

function UnitIterator(army)
{
    this.army = army;
    this.current = -1;
}

UnitIterator.prototype.get =
    function()
    {
        return this.army.units[this.current];
    }
    
UnitIterator.prototype.moveNext =
    function()
    {
        var first = true;
        
        while (first || this.army.units[this.current] == undefined)
        {
            first = false;
            this.current++;
            if (this.current >= this.army.units.length)
            {
                return false;
            }
        }
        
        return true;
    }

UnitIterator.prototype.moveFirst =
    function()
    {
        this.current = -1;
    }