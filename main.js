var svgns = "http://www.w3.org/2000/svg";
var mySvg;

var g;

var turn_num = 0;


function unit_move_click(evt) {
    var hex = evt.target;

    var mx = parseInt(hex.getAttribute("game_pos_x"));
    var my = parseInt(hex.getAttribute("game_pos_y"));
    
    g.getGameMap().redraw();
    g.getGameMap().clearEventHandlers();

    g.MoveCurrentUnit(mx, my);
    
    set_unit_select_event_handlers();
}

function unit_on_hex(x, y)
{
    var i;
    
    var unit_list = g.getCurrentArmy().units;
    
    unit_list = unit_list.concat(g.getEnemyUnits());
    
    for (i = 0; i < unit_list.length; i++)
    {
        if (unit_list[i].x == x && unit_list[i].y == y)
        {
            return true;
        }
    }
    
    return false;
}

function unit_select_click(evt) 
{
    var hex = evt.target;
    
    g.getGameMap().redraw();
    g.getGameMap().clearEventHandlers();
    
    set_unit_select_event_handlers();
    
    var unit_id = parseInt(hex.getAttribute("game_unit_id"));
    
    g.selectUnit(unit_id);
    
    var cur_unit = g.getCurrentUnit();
    
    if (!cur_unit.getTracker().moved)
    {
        var poslist = g.getGameMap().getSurroundingR(cur_unit.x, cur_unit.y, cur_unit.move);

        var posi;

        for (posi = 0; posi < poslist.length; posi++)
        {
            var mx = poslist[posi].x;
            var my = poslist[posi].y;

            var tile = g.getGameMap().getTile(mx, my);

            if (g.getGameMap().isPassable(mx, my) && !unit_on_hex(mx, my))
            {
                tile.sprite.setAttribute("fill", "rgb(128,255,128)");

                tile.sprite.setAttribute("onclick", "unit_move_click(evt)");
                tile.sprite.setAttribute("game_pos_x", poslist[posi].x);
                tile.sprite.setAttribute("game_pos_y", poslist[posi].y);
            }
        }
    }
}

function set_unit_select_event_handlers()
{
    var army = g.getCurrentArmy();
    
    for (var unit_num = 0; unit_num < army.units.length; unit_num++)
    {
        /* set up event handlers for unit selection */
        var unit = army.units[unit_num];
        
        var tile = g.getGameMap().getTile(unit.x, unit.y);
        
        tile.sprite.setAttribute("fill", "rgb(128,255,128)");
        
        tile.sprite.setAttribute("onclick", "unit_select_click(evt)");
        tile.sprite.setAttribute("game_unit_id", unit.getId());
    }
}

function next_turn()
{
    if (turn_num > 0)
    {
        g.nextTurn();
    }
    
    set_unit_select_event_handlers();
    
    turn_num++;
}

function next_turn_click()
{
    g.getGameMap().redraw();
    g.getGameMap().clearEventHandlers();

    next_turn();
}

function create_dashboard()
{
    var button =
        create_rect
        (
            mySvg,
            gamemap_get_map_screenx(g.getGameMap().width + 1),
            gamemap_get_map_screeny(g.getGameMap().width + 1, 1),
            hex_size,
            20,
            "red"
        );
    
    button.setAttribute("onclick", "next_turn_click()");
}

function main()
{
    var container = document.getElementById("svgContainer");
    mySvg = document.createElementNS(svgns, "svg");
    mySvg.setAttribute("viewBox", "0 0 1280 700");
    mySvg.setAttribute("version", "1.2");
    mySvg.setAttribute("baseProfile", "tiny");
    container.appendChild(mySvg);

    g = new Game();
    
    create_dashboard();
    
    next_turn();
}

window.onload = main;
