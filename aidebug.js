// All the hacky code in one place

function AiDebug(game, map) {
    this.map = map;
}

AiDebug.prototype.showInfMap =
    function(inf_map) {
        var max_v = inf_map.getHighest().score;
        var mul = 128 / (max_v + 50);
        var min_v = max_v;

        for (var i = 0; i < inf_map.width; i++) {
            for (var j = 0; j < inf_map.height; j++) {
                if (this.map.map[i][j].sprite === undefined)
                    continue;

                var v = inf_map.map[i][j].value;
                if (v === undefined)
                    continue;

                if (v < min_v) min_v = v;

                // add 50 to push values below zero above zero.
                var r = 0, g = 0, b = 0;
                if (v == max_v)
                {
                    r = 255;
                    g = 255;
                    b = 0;
                }
                else
                {
                    r = 128 + (v + 50) * mul;
                    console.log("v: " + (v-50) + ",  r: " + r);
                }

                this.map.map[i][j].sprite.setAttribute(
                    "fill",
                    "rgb("+(r|0)+","+(g|0)+","+(b|0)+")"
                );
            }
        }   

        console.log('max v: '+max_v);
        console.log('min v: '+min_v);
    }
