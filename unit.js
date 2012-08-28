function Unit(id, sprite, move, health, damage, game)
{
    this.game = game;

    this.id = id;
    this.sprite = sprite;
    this.x = 0;
    this.y = 0;
    this.move = move;
    this.max_health = health;
    this.health = health;
    this.damage = damage;
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
        delete this.sprite;
        delete this.tracker;
        delete this.game;
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
        this.sprite.setPosition(this.game.getGameMap().getMapScreenX(x), this.game.getGameMap().getMapScreenY(x, y));
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
