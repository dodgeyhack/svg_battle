function create_hexagon(x, y, r, fill)
{
    x1 = Math.sin(Math.PI/6) * r;
    y1 = Math.cos(Math.PI/6) * r;

    x2 = r;
    y2 = 0;

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
    hex.setAttributeNS(null, "fill", fill);
    hex.setAttributeNS(null, "stroke", "black");

    hex.setAttribute("onclick", "map_click(evt)");

    mySvg.appendChild(hex);
    
    return hex;
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

    parent.appendChild(tri);
    
    return tri;
}

function create_group(parent)
{
    var g = document.createElementNS(svgns, "g");
    parent.appendChild(g);
    
    return g;
}