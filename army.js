function Army(colour, game)
{
    this.colour = colour;
    this.units = Array(3);

    this.units[0] = new Unit(0, new Sprite("heavy", colour), 2, 4, 3, game);
    this.units[1] = new Unit(1, new Sprite("soldier", colour), 3, 3, 2, game);
    this.units[2] = new Unit(2, new Sprite("runner", colour), 5, 1, 1, game);
    
    this.num_units = 3;
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
            this.units.length = id;
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
    