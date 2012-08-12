function Sprite(type, colour)
{
    this._constructor_heavy =
        function()
        {
            this.svg_object = create_group(mySvg);
            create_triangle(this.svg_object, 0, 0, hex_size, this.fill);
        }

    this._constructor_soldier =
        function()
        {
            this.svg_object = create_group(mySvg);
            create_triangle(this.svg_object, 0, 0, hex_size / 3 * 2, this.fill);
        }

    this._constructor_runner =
        function()
        {
            this.svg_object = create_group(mySvg);
            create_triangle(this.svg_object, 0, 0, hex_size / 3, this.fill);
        }

    this.fill = colour;

    switch (type)
    {
        case "heavy": this._constructor_heavy(); break;
        case "soldier": this._constructor_soldier(); break;
        case "runner": this._constructor_runner(); break;
    }

    this.setPosition =
        function(x, y)
        {
            this.svg_object.setAttributeNS(null, "transform", "translate("+x+","+y+")");
        }
}
