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

    game_map = new GameMap(15, 11, sharkfood_island_map);
    
    armies[0] = new Army("red");
    armies[1] = new Army("blue");
    
    armies[0].units[0].moveTo(2, 5);
    armies[0].units[1].moveTo(4, 4);
    armies[0].units[2].moveTo(4, 6);

    armies[1].units[0].moveTo(12, 0);
    armies[1].units[1].moveTo(10, 1);
    armies[1].units[2].moveTo(10, 3);

    var im = new InfluenceMap(game_map, armies[0].units[2], armies[0].units, armies[1].units);
    im.drawOnMap();

}
