var svgns = "http://www.w3.org/2000/svg";
var mySvg;
var game_map;

var armies = Array(2);

window.onload = main;

function main()
{
    var container = document.getElementById("svgContainer");
    mySvg = document.createElementNS(svgns, "svg");
    mySvg.setAttribute("viewBox", "0 0 1280 700");
    mySvg.setAttribute("version", "1.2");
    mySvg.setAttribute("baseProfile", "tiny");
    container.appendChild(mySvg);

    game_map = new Map(14, 7);

    armies[0] = new Army("red");
    armies[1] = new Army("blue");
    
    armies[0].units[0].moveTo(2, 2);
    armies[0].units[1].moveTo(3, 3);
    armies[0].units[2].moveTo(2, 4);

    armies[1].units[0].moveTo(8, 5);
    armies[1].units[1].moveTo(9, 5);
    armies[1].units[2].moveTo(10, 5);
    
    var im = new InfluenceMap(game_map, armies[0].units[2], armies[0].units, armies[1].units);
    im.drawOnMap();
    
    slist = game_map.getSurroundingR(2, 1, 1);
    for (var i = 0; i < slist.length; i++)
    {
        game_map.map[slist[i].x][slist[i].y].sprite.setAttribute("fill", "yellow");
    }

    game_map.getTile(0, 0);
    game_map.getTile(1, 0);
    game_map.getTile(2, -1);
    game_map.getTile(3, -1);    
    game_map.getTile(4, -1);
    game_map.getTile(5, -1);    

}
