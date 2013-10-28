function ObjectiveStore() 
{
    this.store = new Array();
}

ObjectiveStore.prototype.addObjective =
    function(x, y)
    {
        var obj = new Objective(x, y);
        this.store.push(obj);
    }

ObjectiveStore.prototype.getObjective =
    function(x, y)
    {
        for (var i = 0; i < this.store.length; i++)
        {
            if (this.store[i].x == x && this.store[i].y == y)
            {
                return this.store[i];
            }
        }
        return undefined;
    }

ObjectiveStore.prototype.isObjective =
    function(x, y)
    {
        var obj = this.getObjective(x, y);
        return (obj === undefined ? false : true);
    }

function Objective(x, y)
{
    this.x = x;
    this.y = y;
    this.owner = undefined;
}

Objective.prototype.setOwner =
    function(owner)
    {
        this.owner = owner;
    }
