function InfluenceMap(map, unit, friends, enemies)
{
    this.width = map.width;
    this.height = map.height;
    
    this.map = map;

    this.infmap = new Array(this.width);
    for (var i = 0; i < this.width; i++)
    {
        this.infmap[i] = new Array(this.height);
        for (var j = 0; j < this.height; j++)
        {
            this.infmap[i][j] = 0;
        }
    }
    
    /* step through each enemy */

    for (var i = 0; i < enemies.length; i++)
    {
    
        this.infmap[enemies[i].x][enemies[i].y] = -255;
        
        var l = game_map.getSurrounding(enemies[i].x, enemies[i].y);

        /* in squares where I could take damage, subtract that damage */
        for (var j = 0; j < l.length; j++)
        {
            ax = l[j].x;
            ay = l[j].y;
            this.infmap[ax][ay] -= enemies[i].damage * 20;
            
            /* in squares where damage would kill me, subtract more */
            if (enemies[i].damage >= unit.health)
            {
                this.infmap[ax][ay] -= 50 ; 
            }
            
            /* in squares where I could damage enemy, add that damage */
            this.infmap[ax][ay] += unit.damage * 40;
            
            /* in squares where I could kill the enemy, add more */
            if (unit.damage >= enemies[i].health)
            {
                this.infmap[ax][ay] += 50;
            }
        }
    }
    
    
    /* Add objectives held by enemy */
    
    /* Add squares that are just out of reach of the enemy, closer to their base or objective is higher */
    
    
    this.drawOnMap = 
        function()
        {
            for (var x = 0; x < this.width; x++)
            {
                for (var y = 0; y < this.height; y++)
                {
                    if (this.infmap[x][y] < 0)
                    {
                        this.map.map[x][y].sprite.setAttribute("fill", "rgb("+(-this.infmap[x][y])+",0,0)");
                    }
                    else if (this.infmap[x][y] > 0)
                    {
                        this.map.map[x][y].sprite.setAttribute("fill", "rgb(0,0,"+this.infmap[x][y]+")");
                    }
                }
            }   
        }
}
