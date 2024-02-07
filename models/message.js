class message{
    constructor(text, sender) {
        this.text = text;
        this.sender = sender;
        this.time = new Date().getTime().toString();
    }
}
module.exports = message;