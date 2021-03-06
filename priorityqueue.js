/*
 * cmp_fn compares a to b and is like strcmp
 */
function PriorityQueue(cmp_fn)
{
    this.data = [];
    this.cmp_fn = cmp_fn;
}   

PriorityQueue.prototype.insert =
    function(object)
    {
        this.data.push(object);
        this.data.sort(this.cmp_fn);
    }   

/* returns undefined if empty */
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

PriorityQueue.prototype.clear =
    function()
    {
        this.data = [];
    }