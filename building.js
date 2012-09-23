function Building(x, y, size, health, owner, sprite)
{
    GameMap.baseConstructor.call(this, x, y, sprite);

    this.size = size;
    this.owner = owner;
    this.health = health;
}

KevLinDev.extend(Building, RenderMapObject)

Building.prototype.takeDamage =
    function(dmg)
    {
        this.health -= dmg;
    }

Building.prototype.isDead =
    function()
    {
        return (this.health < 0 ? true : false);
    }

Building.prototype.inBuilding =
    function(x, y)
    {
        if (Math.abs(x - this.x) <= this.size && Math.abs(y - this.y) <= this.size)
        {
            return true;
        }
        return false;
    }


function BuildingStore()
{
    this.store = Array();
}

BuildingStore.prototype.addBuilding =
    function(building)
    {
        this.store.push(building);
    }

BuildingStore.prototype.isBuilding =
    function(x, y)
    {
        var building = this.getBuilding(x, y);
        return (building === undefined ? false : true);
    }


BuildingStore.prototype.getBuilding =
    function(x, y)
    {
        var i;

        for (i = 0; i < this.store.length; i++)
        {
            if (this.store[i].inBuilding(x, y))
            {
                return this.store[i];
            }
        }

        return undefined;
    }
