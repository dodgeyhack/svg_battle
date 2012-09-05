function PriorityQueue(cmp_fn)
{
    this.data = new Array();
    this.cmp_fn = cmp_fn;
}   

PriorityQueue.prototype.insert =
    function(object)
    {
        this.data.push(object);
        this.data.sort(this.cmp_fn);
    }   

PriorityQueue.prototype.pop =
    function()
    {
        return this.data.pop();
    }

PriorityQueue.prototype.resort =
    function()
    {
        this.data.sort(this.cmp_fn);
    }

