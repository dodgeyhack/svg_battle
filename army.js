function Army(colour, game)
{
    this.colour = colour;
    this.units = Array(3);

    this.units[0] = new Unit(0, new Sprite("heavy", colour), 2, 4, 3, game);
    this.units[1] = new Unit(1, new Sprite("soldier", colour), 3, 3, 2, game);
    this.units[2] = new Unit(2, new Sprite("runner", colour), 5, 1, 1, game);
}
