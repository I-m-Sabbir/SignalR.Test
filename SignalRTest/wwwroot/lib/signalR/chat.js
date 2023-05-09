//Create Connection
var connectionChat = new signalR.HubConnectionBuilder().withUrl("/hubs/chat").build();

//receive notification from the hub
connectionChat.on("messageSend", (message, user) => {
    console.log(message + " from " + user);
    var messageBody = document.getElementById("messageBody");
    messageBody.innerHTML = `<div class="col-md-2>${user}</div><div class="col-md-10>${message}</div>"`;
});

//send notification to hub
function submitMessage() {
    connectionChat.send("SendMessage", "Hello user-2");
}

//start connection
function connectionSuccess() {
    console.log("Chat Connection Success...");
    submitMessage();
}

function connectionFailed() {
    console.log("Chat Connection Failed...");
}

connectionChat.start().then(connectionSuccess, connectionFailed);