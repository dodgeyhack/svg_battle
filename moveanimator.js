function MoveAnimator(aimove, game) {
    this.aimove = aimove;
    this.game = game;
    this.path =
        this.aimove === undefined
        ?
        undefined
        :
        get_path
        (
            aimove.unit.move,
            game,
            aimove.unit.x,
            aimove.unit.y,
            aimove.x,
            aimove.y,
            get_path_find_walk_test_fn(game)
        );
}

/*
 * Applies the move.
 * The unit stored in the move will be selected. 
 */
MoveAnimator.prototype.go =
    function() {

        this.start_time = 0;

        console.log("moving "+this.aimove.unit.name+" to "+this.aimove.x+","+this.aimove.y);

        var t = this;

        this.intervalid =
            window.setInterval(
                move_animator_frame, 500, t
            );
    }

function move_animator_frame(ma) {
        var m = ma.aimove;
        var g = ma.game;

        var move_finished = false;

        assert(m !== undefined);

        g.selectUnit(m.unit.id);

        if (m.doMove)
        {

            var pos = ma.path.pop();
            if (pos !== undefined)
                g.moveCurrentUnit(pos.x, pos.y);
            else
                move_finished = true;
        }
        else
        {
            console.log(m.unit.name+" decided not to move.");
            move_finished = true;
        }

        if (move_finished && m.target) {
            console.log(m.unit.name+" is attacking "+m.target.name);
            g.attackWithCurrentUnit(m.target.id);
        }

        if (move_finished) {
            window.clearInterval(ma.intervalid);
            console.log('cleared');
        }
}
