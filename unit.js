function Unit(sprite, move, health, damage)
{
    this.sprite = sprite;
    this.x = 0;
    this.y = 0;
    this.move = move;
    this.max_health = health;
    this.health = health;
    this.damage = damage;
    this.alive = true;

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

    this.moveTo =
        function(x, y)
        {
            this.x = x;
            this.y = y;
            
            this.sprite.setPosition(get_map_screenx(x), get_map_screeny(x, y));
        }

    this.healOther =
        function(other_unit)
        {
            other_unit.heal();
        }

    this.heal =
        function heal()
        {
            this.health = this.max_health + 1;
        }

    this.doDamage =
        function(other_unit)
        {
            other_unit.takeDamage(this.damage);
        }

    this.takeDamage =
        function(damage)
        {
            this.health -= damage;
            if (this.health < 0)
            {
                this.alive = false;
            }
        }
}
