var svgns = "http://www.w3.org/2000/svg";
var mySvg;

var g;

var turn_num = 0;

var event_handlers = new EventHandlerTracker();

function unit_move_click(evt) {
    var hex = evt.target;

    var mx = parseInt(hex.getAttribute("game_pos_x"));
    var my = parseInt(hex.getAttribute("game_pos_y"));
    
    g.getGameMap().redraw();
    event_handlers.removeAllFrom("unit");

    g.MoveCurrentUnit(mx, my);
    
    set_unit_select_event_handlers();
}

function unit_attack_click(evt)
{
    var hex = evt.target;
    var target_id = parseInt(hex.getAttribute("game_attack_unit_id"));
    
    g.attackWithCurrentUnit(target_id);    
    
    g.getGameMap().redraw();
    event_handlers.removeAllFrom("unit");

    set_unit_select_event_handlers();
}

function set_unit_attack_event_handlers()
{
    var ux, uy;
    var unit = g.getCurrentUnit();
    
    var enemy_iter = g.getEnemyUnitIterator();
    var enemy;
    
    while (enemy_iter.moveNext())
    {
        enemy = enemy_iter.get();
        if (hexmap_distance(unit.x, unit.y, enemy.x, enemy.y) < 2)
        {
            var tile = g.getGameMap().getTile(enemy.x, enemy.y);
            tile.sprite.setAttribute("fill", "rgb(128,0,0)");
            
            tile.sprite.setAttribute("game_attack_unit_id", enemy.getId());
            event_handlers.addHandler("unit", tile.sprite, "unit_attack_click(evt)");
        }
        
    }
}

function unit_select_click(evt) 
{
    var hex = evt.target;
    
    g.getGameMap().redraw();
    event_handlers.removeAllFrom("unit");
    
    set_unit_select_event_handlers();
    
    
    var unit_id = parseInt(hex.getAttribute("game_unit_id"));
    
    g.selectUnit(unit_id);
    
    var cur_unit = g.getCurrentUnit();
    
    var tile = g.getGameMap().getTile(cur_unit.x, cur_unit.y);
    tile.sprite.setAttribute("fill", "yellow");
    
    var cur_unit_tracker = cur_unit.getTracker();
    
    if (!cur_unit_tracker.moved)
    {
        var poslist = g.getGameMap().getSurroundingR(cur_unit.x, cur_unit.y, cur_unit.move);

        var posi;

        for (posi = 0; posi < poslist.length; posi++)
        {
            var mx = poslist[posi].x;
            var my = poslist[posi].y;

            tile = g.getGameMap().getTile(mx, my);

            if (g.getGameMap().isPassable(mx, my) && !g.getGameMap().isOccupied(mx, my))
            {
                tile.sprite.setAttribute("fill", "rgb(128,255,128)");
                tile.sprite.setAttribute("game_pos_x", poslist[posi].x);
                tile.sprite.setAttribute("game_pos_y", poslist[posi].y);
                event_handlers.addHandler("unit", tile.sprite, "unit_move_click(evt)");                
            }
        }
    }
    
    if (!cur_unit_tracker.attacked)
    {
        set_unit_attack_event_handlers();
    }
}

function set_unit_select_event_handlers()
{
    var army = g.getCurrentArmy();
    
    var ui = new UnitIterator(army);
    var unit;
    
    while (ui.moveNext())
    {
        unit = ui.get();    
        
        var tile = g.getGameMap().getTile(unit.x, unit.y);
        
        tile.sprite.setAttribute("fill", "rgb(128,255,128)");
        tile.sprite.setAttribute("game_unit_id", unit.getId());
        event_handlers.addHandler("unit", tile.sprite, "unit_select_click(evt)");
    }
}

function next_turn()
{
    if (g.finished)
    {
        event_handlers.removeAll();
        Message(mySvg, "Game Over");
    }
    else
    {
        if (turn_num > 0)
        {
            g.nextTurn();
        }

        set_unit_select_event_handlers();

        turn_num++;
    }
}

function next_turn_click()
{
    g.getGameMap().redraw();
    event_handlers.removeAllFrom("unit");

    next_turn();
}

function create_dashboard()
{
    var button =
        new Button
        (
            mySvg,
            gamemap_get_map_screenx(g.getGameMap().width + 1),
            gamemap_get_map_screeny(g.getGameMap().width + 1, 1),
            "End Turn",
            "next_turn_click()",
            event_handlers
        );
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
