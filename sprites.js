function Sprite(type, colour)
{
    this._constructor_heavy =
        function()
        {
            this.svg_object = create_group(mySvg);
            create_image(this.svg_object, 0, 0, "heavy.svg");
        }

    this._constructor_soldier =
        function()
        {
            this.svg_object = create_group(mySvg);
            create_image(this.svg_object, 0, 0, "spearman.svg");
        }

    this._constructor_runner =
        function()
        {
            this.svg_object = create_group(mySvg);
            create_image(this.svg_object, 0, 0, "runner.svg");
        }

    this._constructor_building =
        function()
        {
            this.svg_object = create_group(mySvg);
            create_image(this.svg_object, 0, 0, "tower.svg", 3, 3);
        }

    this.fill = colour;
    this.text_object = null;

    switch (type)
    {
        case "heavy": this._constructor_heavy(); break;
        case "soldier": this._constructor_soldier(); break;
        case "runner": this._constructor_runner(); break;
        case "building" : this._constructor_building(); break;
    }

    this.setPosition =
        function(x, y)
        {
            console.log("setPosition( "+x+","+y+")");
            this.svg_object.setAttributeNS(null, "transform", "translate("+x+","+y+")");
        }
        
    this.setText =
        function(value)
        {
            assert(this.text_object == null);
            this.text_object = create_text(this.svg_object, value, -(hex_size / 2), -(hex_size / 4), "black");
        }
        
    this.changeText =
        function(value)
        {
            update_text(this.text_object, value);
        }
}

Sprite.prototype.destroy =
    function()
    {
        this.svg_object.parentNode.removeChild(this.svg_object);
    }
