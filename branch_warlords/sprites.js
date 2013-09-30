function Sprite(type, colour)
{
    this._constructor_unit =
        function(filename)
        {
            this.svg_object = create_group(mySvg);
            create_image(this.svg_object, 0, 0, filename);
        }

    this._constructor_building =
        function(filename)
        {
            this.svg_object = create_group(mySvg);
            create_image(this.svg_object, 0, 0, filename, 3, 3);
        }

    this.fill = colour;
    this.text_object = null;

    switch (type)
    {
        case "building" : this._constructor_building("tower.svg"); break;
        default: this._constructor_unit(type+".svg");
            
    }

    var elems = this.svg_object.getElementsByTagName("*");

    for (var i = 0; i < elems.length ;i++)
    {
        if (elems[i].getAttribute("class") == "team_col")
        {
            elems[i].setAttribute("fill", this.fill);
        }
    }

    this.setPosition =
        function(x, y)
        {
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

Sprite.prototype.addStyleSheet =
    function(filename)
    {
        var s = document.createElementNS(svgns, "LINK");
        s.setAttribute("rel", "stylesheet");
        s.setAttribute("type", "text/css");
        s.setAttribute("href", filename);
        this.svg_object.appendChild(s);
    }

Sprite.prototype.setOpacity =
    function(alpha)
    {
        this.svg_object.setAttribute("opacity", ""+alpha);
    }

Sprite.prototype.destroy =
    function()
    {
        this.svg_object.parentNode.removeChild(this.svg_object);
    }
