function InfluenceMap(gamemap, unit, friends, enemies)
{
    InfluenceMap.baseConstructor.call(this, gamemap.width, gamemap.height);
    
    this.gamemap = gamemap;

    for (var i = 0; i < this.width; i++)
    {
        for (var j = 0; j < this.height; j++)
        {
            var o = new Object();
            o.value = 0;
            this.map[i][j] = o;
        }
    }
    
    /* step through each enemy */

    for (var i = 0; i < enemies.length; i++)
    {
    
        this.map[this.getBufX(enemies[i].x)][this.getBufY(enemies[i].y)] = -255;
        
        
        var l = game_map.getSurroundingR(enemies[i].x, enemies[i].y, 1);

        /* in squares where I could take damage, subtract that damage */
        for (var j = 0; j < l.length; j++)
        {
            tile = this.getTile(l[j].x, l[j].y);
            
            tile.value -= enemies[i].damage * 20;
            
            /* in squares where damage would kill me, subtract more */
            if (enemies[i].damage >= unit.health)
            {
                tile.value -= 50 ; 
            }
            
            /* in squares where I could damage enemy, add that damage */
            tile.value += unit.damage * 40;
            
            /* in squares where I could kill the enemy, add more */
            if (unit.damage >= enemies[i].health)
            {
                tile.value += 50;
            }
        }
    }
    
    
    /* Add objectives held by enemy */
    
    /* Add squares that are just out of reach of the enemy, closer to their base or objective is higher */
}

KevLinDev.extend(InfluenceMap, HexMap);
    
InfluenceMap.prototype.drawOnMap = 
    function()
    {
        for (var x = 0; x < this.width; x++)
        {
            for (var y = 0; y < this.height; y++)
            {
                if (this.map[x][y].value < 0)
                {
                    this.gamemap.map[x][y].sprite.setAttribute("fill", "rgb("+(-this.map[x][y].value)+",0,0)");
                }
                else if (this.map[x][y].value > 0)
                {
                    this.gamemap.map[x][y].sprite.setAttribute("fill", "rgb(0,0,"+this.map[x][y].value+")");
                }
            }
        }   
    }
