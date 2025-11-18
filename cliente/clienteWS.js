function ClienteWS() {
    this.socket = undefined;
    this.ini = function () {
        this.socket = io() //.connect("ws://localhost:3000");
    }
    
    this.ini();
}