function EventHandlerTracker()
{
    this.groups = new Object();
}

EventHandlerTracker.prototype.addHandler =
    function(group, object, handler)
    {
        if (this.groups[group] === undefined)
        {
            this.groups[group] = new Array();
        }

        object.setAttribute("onclick", handler);
        //object.setAttribute("fill", "white");

        this.groups[group].push(object);
    }

EventHandlerTracker.prototype.removeAll =
    function()
    {
        var i;
        
        for (i = 0; i < this.groups.length; i++)
        {
            var object;
            
            while (undefined != (object = this.groups[i].pop()))
            {
                object.removeAttribute("onclick");
                //object.setAttribute("fill", "pink");
            }
            
            this.groups[i] = undefined;
        }
    }
    
EventHandlerTracker.prototype.removeAllFrom =
    function(group)
    {
        var object;
        
        while (undefined != (object = this.groups[group].pop()))
        {
            object.removeAttribute("onclick");
            //object.setAttribute("fill", "red");
        }
    }
