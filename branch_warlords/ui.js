function Window(parent, x, y, w, h, fill)
{
    this.g = create_group(parent);
    this.rect = create_rect(this.g, x, y, w, h, fill);
}

function Message(parent, msg)
{
    Message.baseConstructor.call(this, parent, 10, 10, 200, 100, "rgb(200,200,220)");
    create_text(this.g, msg, 40, 40, "black");
    
    this.b = new Button(this.g, 40, 50, "Ok", "reset_game()", event_handlers);
    
    console.log(msg);
}

KevLinDev.extend(Message, Window);

function Button(parent, x, y, msg, handler, event_handlers)
{
    Button.baseConstructor.call(this, parent, x, y, 120, 40, "red");
    
    create_text(this.g, msg, x+20, y+20, "black");
    event_handlers.addHandler("temp_ui", this.rect, handler);
    
}

KevLinDev.extend(Button, Window);