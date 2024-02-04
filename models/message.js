class message{
    constructor(message, sender) {
        this.message = message;
        this.sender = sender;
        this.time = new Date().getTime().toString();
    }
}
module.exports = message;