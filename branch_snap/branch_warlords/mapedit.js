var svgns = "http://www.w3.org/2000/svg";
var mySvg;
var game_map;

var armies = Array(2);

window.onload = main;


function mapedit_hex_click(evt) {
    var hex = evt.target;
    
    var x = hex.getAttribute("gamemap_x");
    var y = hex.getAttribute("gamemap_y");
    
    game_map.map[x][y].tile_type += 1;
    game_map.map[x][y].tile_type %= 8;
    
    hex.setAttribute("fill", gamemap_get_fill(game_map.map[x][y].tile_type));
}

function mapedit_dump() {
    game_map.Dump();    
}

function main()
{
    var container = document.getElementById("svgContainer");
    mySvg = document.createElementNS(svgns, "svg");
    mySvg.setAttribute("viewBox", "0 0 1280 700");
    mySvg.setAttribute("version", "1.2");
    mySvg.setAttribute("baseProfile", "tiny");
    container.appendChild(mySvg);

    game_map = new GameMap(15, 11);
    
    for (var y = 0; y < game_map.height; y++)
    {
        for (var x = 0; x < game_map.width; x++)        
        {
            game_map.map[x][y].sprite.setAttribute("gamemap_x", x);
            game_map.map[x][y].sprite.setAttribute("gamemap_y", y);
            game_map.map[x][y].sprite.setAttribute("onclick", "mapedit_hex_click(evt)");
        }
    }
    
    var button =
        create_hexagon
        (
            gamemap_get_map_screenx(game_map.width + 1),
            gamemap_get_map_screeny(game_map.width + 1, 1),
            hex_size,
            "red"
        );
    
    button.setAttribute("onclick", "mapedit_dump()");
}
