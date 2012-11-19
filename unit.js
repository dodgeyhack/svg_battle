function Unit(id, sprite, move, health, damage, range, game)
{
    Unit.baseConstructor.call(this, 0, 0, sprite);
/*
    var col_elem = this.sprite.svg_object.getElementById("team_col");
    col_elem.setAttribute("fill", "white");
*/
    this.game = game;

    this.id = id;
    this.move = move;
    this.max_health = health;
    this.health = health;
    this.damage = damage;
    this.range = range;
    this.alive = true;

    this.sprite.setText(this.health);

    if (damage > 0)
    {
        this.canDamage = true;
        this.canHeal = false;
    }
    else
    {
        this.canDamage = false;
        this.canHeal = true;
    }
}

KevLinDev.extend(Unit, RenderMapObject)

Unit.prototype.updateSprite =
    function()
    {
        this.sprite.changeText(this.health);
    }
    

Unit.prototype.destroy =
    function()
    {
        this.sprite.destroy();
        /* release any references so garbage collector can do it's thing */
        delete this.tracker;
        delete this.game;
        delete this.sprite;        
    }

Unit.prototype.setTracker =
    function(tracker)
    {
        this.tracker = tracker;
    }

Unit.prototype.getTracker =
    function()
    {
        return this.tracker;
    }

Unit.prototype.moveTo =
    function(x, y)
    {
        this.x = x;
        this.y = y;

        /*
         * While it's probably ok to have a global game map, I'd prefer not to.
         */
        this.sprite.setPosition(gamemap_get_map_screenx(x), gamemap_get_map_screeny(x, y));
    }

Unit.prototype.healOther =
    function(other_unit)
    {
        other_unit.heal();
    }

Unit.prototype.heal =
    function heal()
    {
        this.health = this.max_health + 1;
        this.updateSprite();
    }

Unit.prototype.doDamage =
    function(other_unit)
    {
        other_unit.takeDamage(this.damage);
    }

Unit.prototype.doDamageToBuilding =
    function(building)
    {
        building.takeDamage(this.damage);
    }

Unit.prototype.takeDamage =
    function(damage)
    {
        this.health -= damage;
        this.updateSprite();
        if (this.health < 0)
        {
            this.alive = false;
        }
    }
    
Unit.prototype.isDead =
    function()
    {
        return (this.health < 1 ? true : false);
    }

Unit.prototype.getId =
    function()
    {
        return this.id;
    }
