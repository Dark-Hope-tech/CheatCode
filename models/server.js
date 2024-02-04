class ServerModel {
    constructor(serverName,email) {
        this.serverName = serverName;
        this.channels = [];
        this.admin =  email;
        this.moderators = [];
        this.users = []
    }

    createChannel(channelName,email) {
        if(this.moderators[email] || this.admin == email){
            if (!this.channels[channelName]) {
                this.channels[channelName] = [];
                return true;
            } else {
                return false; // Channel already exists
            }
        }
        else{
            return false; // User does not have permission
        }
    }

    joinChannel(channelName, user) {
        if (this.channels[channelName]) {
            this.channels[channelName].push(user);
            return true;
        } else {
            return false; // Channel does not exist
        }
    }

    getServerName() {
        return this.serverName;
    }

    // Getter for channels
    getChannels() {
        return Object.keys(this.channels);
    }
}

module.exports = ServerModel;
