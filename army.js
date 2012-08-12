function Army(colour)
{
    this.colour = colour;
    this.units = Array(3);

    this.units[0] = new Unit(new Sprite("heavy", colour), 2, 4, 3);
    this.units[1] = new Unit(new Sprite("soldier", colour), 3, 3, 2);
    this.units[2] = new Unit(new Sprite("runner", colour), 5, 1, 1);
}
