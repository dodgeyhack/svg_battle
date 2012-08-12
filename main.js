var svgns = "http://www.w3.org/2000/svg";
var mySvg;
var game_map;

var armies = Array(2);

window.onload = main;

function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
  return 'AssertException: ' + this.message;
}

function assert(exp, message) {
  if (!exp) {
    throw new AssertException(message);
  }
}

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
    
    armies[0].units[0].moveTo(0, 0);
    armies[0].units[1].moveTo(1, 0);
    armies[0].units[2].moveTo(2, 0);

    armies[1].units[0].moveTo(3, 0);
    armies[1].units[1].moveTo(4, 0);
    armies[1].units[2].moveTo(5, 0);
    
    var im = new InfluenceMap(game_map, armies[0].units[2], armies[0].units, armies[1].units);
    im.drawOnMap();
    
    var tx = 2;
    var ty = 1;
    var tr = 2;
    slist = game_map.getSurroundingR(tx, ty, tr);
    for (var i = 0; i < slist.length; i++)
    {   
        //game_map.getTile(slist[i].x, slist[i].y).sprite.setAttribute("fill", "yellow");
    }
    game_map.getTile(tx, ty).sprite.setAttribute("stroke", "red");

    console.log(game_map.getBufY(tx, ty));
}
