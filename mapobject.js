function MapObject(x, y)
{
    this.x = x;
    this.y = y;
}

function RenderMapObject(x, y, sprite)
{
    RenderMapObject.baseConstructor.call(this, x, y);

    this.sprite = sprite;
    
}

KevLinDev.extend(RenderMapObject, MapObject);

RenderMapObject.prototype.destroy =
    function()
    {
        this.sprite.destroy();
        delete this.sprite;
    }
