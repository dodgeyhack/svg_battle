/*
 * Return col, either darkened or lightened
 * by delta. delta may be positive or negative.
 * col must be in # format.
 */
function mod_svg_colour(col, delta)
{
    var r;
    var g;
    var b;
    
    r = parseInt(col.slice(1, 3), 16) + delta;
    g = parseInt(col.slice(3, 5), 16) + delta;
    b = parseInt(col.slice(5, 7), 16) + delta;
    
    
    if (r > 255) r = 255;
    if (g > 255) g = 255;
    if (b > 255) b = 255;
    
    if (r < 0) r = 0;
    if (g < 0) g = 0;
    if (b < 0) b = 0;
    
    var r_hex = r.toString(16);
    var g_hex = g.toString(16);
    var b_hex = b.toString(16);

    if (r_hex.length < 2) r_hex = "0" + r_hex;
    if (g_hex.length < 2) g_hex = "0" + g_hex;
    if (b_hex.length < 2) b_hex = "0" + b_hex;
    
    return ("#" + r_hex + g_hex + b_hex);
}

function create_drop_shadow_filter(parent, name)
{
    var f = document.createElementNS(svgns, "filter");
    f.setAttribute("id", name);
    f.setAttribute("x", "-100%");
    f.setAttribute("y", "-100%");
    f.setAttribute("width", "300%");
    f.setAttribute("height", "300%");
    
    var blur = document.createElementNS(svgns, "feGaussianBlur");
    blur.setAttribute("result", "blurOut");
    blur.setAttribute("stdDeviation", "10");

    var offset = document.createElementNS(svgns, "feOffset");
    offset.setAttribute("dx", "-4");
    offset.setAttribute("dy", "4");
    offset.setAttribute("in", "blurOut");
    offset.setAttribute("result", "offOut");
    
    var blend = document.createElementNS(svgns, "feBlend");
    blend.setAttribute("in", "SourceGraphic");
    blend.setAttribute("in2", "blurOut");
    blend.setAttribute("mode", "normal");
    
    f.appendChild(blur);
    f.appendChild(offset);
    f.appendChild(blend);
    parent.appendChild(f);
}

function create_light_filter(parent, name, brightness)
{
    var f = document.createElementNS(svgns, "filter");
    f.setAttribute("id", name);
    
    var flood = document.createElementNS(svgns, "feFlood");
    flood.setAttribute("result", "floodOut");
    flood.setAttribute("flood-color", "#000");
    flood.setAttribute("flood-opacity", 1 - brightness);
    
    var blend = document.createElementNS(svgns, "feBlend");
    blend.setAttribute("mode", "multiply");
    blend.setAttribute("in", "floodOut");
    blend.setAttribute("in2", "SourceGraphic");
    blend.setAttribute("result", "blendOut");
    
    var comp = document.createElementNS(svgns, "feComposite");
    comp.setAttribute("in", "blendOut");
    comp.setAttribute("in2", "SourceGraphic");
    comp.setAttribute("result", "compOut");
    comp.setAttribute("operator", "atop");
    
    f.appendChild(flood);
    f.appendChild(blend);
    f.appendChild(comp);
    parent.appendChild(f);
}
       
function write_defs(svg_doc)
{
    var defs = document.createElementNS(svgns, "defs");

    //create_light_filter(defs, "global_light_t", 0.8);
    //create_light_filter(defs, "global_light_w", 0);
    //create_light_filter(defs, "global_light_s", 0.5);
    //create_light_filter(defs, "global_light_e", 1);
    
    //create_drop_shadow_filter(defs, "shadow");

    svg_doc.appendChild(defs);
}

/* 
 * fill MUST be a 6 digit hex value.
 */
function create_hexagon(parent, x, y, r, fill, edge1, edge2, edge3)
{
    x1 = Math.sin(Math.PI/6) * r;
    y1 = Math.cos(Math.PI/6) * r;

    x2 = r;
    y2 = 0;
    
    var g = create_group(parent);

    var hex = document.createElementNS(svgns, "polygon");
    
    hex.setAttributeNS
    (
        null,
        "points",
        (x + x1) + "," + (y - y1) + " " +
        (x + x2) + "," + (y + y2) + " " +
        (x + x1) + "," + (y + y1) + " " +
        (x - x1) + "," + (y + y1) + " " +
        (x - x2) + "," + (y + y2) + " " +
        (x - x1) + "," + (y - y1)
    );
    //hex.setAttributeNS(null, "filter", "url(#global_light_t)");
    hex.setAttributeNS(null, "fill", fill);
    hex.setAttributeNS(null, "stroke", "black");
    hex.setAttributeNS(null, "stroke-linejoin", "bevel");
    g.appendChild(hex);
    
    if (edge1)
    {
        var bit_1 = document.createElementNS(svgns, "polygon");
        bit_1.setAttributeNS
        (
            null,
            "points",
            (x - x2) + "," + (y + y2) + " " +
            (x - x1) + "," + (y + y1) + " " +
            (x - x1) + "," + (y + y1 + hex_3d_depth) + " " +
            (x - x2) + "," + (y + y2 + hex_3d_depth)
        );
        //bit_1.setAttributeNS(null, "filter", "url(#global_light_w)");
        bit_1.setAttributeNS(null, "fill", mod_svg_colour(fill, -128));
        //bit_1.setAttributeNS(null, "fill", "#000");
        bit_1.setAttributeNS(null, "stroke", "black");
        bit_1.setAttributeNS(null, "stroke-linejoin", "bevel");
        g.appendChild(bit_1);
    }
   
    if (edge2)
    {
        var bit_2 = document.createElementNS(svgns, "polygon");
        bit_2.setAttributeNS
        (
            null,
            "points",
            (x - x1) + "," + (y + y1) + " " +
            (x + x1) + "," + (y + y1) + " " +
            (x + x1) + "," + (y + y1 + hex_3d_depth) + " " +
            (x - x1) + "," + (y + y1 + hex_3d_depth)
        );
        //bit_2.setAttributeNS(null, "filter", "url(#global_light_s)");
        //bit_2.setAttributeNS(null, "fill", "#0d550d");
        bit_2.setAttributeNS(null, "fill", mod_svg_colour(fill, -32));
        bit_2.setAttributeNS(null, "stroke", "black");
        bit_2.setAttributeNS(null, "stroke-linejoin", "bevel");
        g.appendChild(bit_2);
    }
    
    if (edge3)
    {
        var bit_3 = document.createElementNS(svgns, "polygon");
        bit_3.setAttributeNS
        (
            null,
            "points",
            (x + x1) + "," + (y + y1) + " " +
            (x + x2) + "," + (y + y2) + " " +
            (x + x2) + "," + (y + y2 + hex_3d_depth) + " " +
            (x + x1) + "," + (y + y1 + hex_3d_depth)
        );
        //bit_3.setAttributeNS(null, "filter", "url(#global_light_e)");
        //bit_3.setAttributeNS(null, "fill", "#227822");
        bit_3.setAttributeNS(null, "fill", mod_svg_colour(fill, 16));
        bit_3.setAttributeNS(null, "stroke", "black");
        bit_3.setAttributeNS(null, "stroke-linejoin", "bevel");
        g.appendChild(bit_3);
    }

    return hex;
}

function create_image(parent, x, y, file, width_mul, height_mul)
{

    if(typeof(width_mul)==='undefined') width_mul = 1;
    if(typeof(height_mul)==='undefined') height_mul = 1;
   
    var img = document.createElementNS(svgns, "image");
    img.setAttribute("pointer-events", "none");
    img.setAttribute("width", "" + (60 * width_mul));
    img.setAttribute("height", "" + (60 * height_mul));
    img.setAttribute("x", x);
    img.setAttribute("y", y);
    img.setAttribute("transform", "translate("+(-30*width_mul)+","+(-30*height_mul)+")");
    img.setAttributeNS(xlinkns, "href", "assets/"+file);
    parent.appendChild(img);
    return img;
}

function create_triangle(parent, x, y, size, fill)
{
    var tri = document.createElementNS(svgns, "polygon");

    s = size / 2;

    tri.setAttribute
    (
        "points",
        (x)      + "," + (y - s) + " " +
        (x + s) + "," + (y + s) + " " +
        (x - s) + "," + (y + s)
    );
    tri.setAttributeNS(null, "fill", fill);
    tri.setAttributeNS(null, "stroke", "black");
    tri.setAttribute("pointer-events", "none");

    parent.appendChild(tri);
    
    return tri;
}

function create_rect(parent, x, y, width, height, fill)
{
    var rect = document.createElementNS(svgns, "rect");

    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);

    rect.setAttributeNS(null, "fill", fill);
    rect.setAttributeNS(null, "stroke", "black");

    parent.appendChild(rect);
    
    return rect;
}

function create_group(parent)
{
    var g = document.createElementNS(svgns, "g");
    parent.appendChild(g);
    
    return g;
}

function create_shadow_group(parent)
{
    var g = document.createElementNS(svgns, "g");
    g.setAttributeNS(null, "filter", "url(#shadow)");
    parent.appendChild(g);
    
    return g;
}

function create_text(parent, value, x, y, fill)
{
    var text_data = document.createTextNode(value);
    var text = document.createElementNS(svgns, "text");
    
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("fill", fill);
    text.setAttribute("font-family", "sans-serif");
    text.setAttribute("font-weight", "bold");
    
    text.appendChild(text_data);
    parent.appendChild(text);
    
    var text_object = new Object();
    text_object.text = text;
    text_object.data = text_data;
    
    return text_object;
}

function update_text(text_object, new_value)
{
    text_object.data.nodeValue = new_value;
}
