//Create Connection
var connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount").build();

//receive notification from the hub
connectionUserCount.on("updateTotalViews", (value) => {
    var newCountSpan = document.getElementById("totalViews");
    newCountSpan.innerText = value.toString();
});

connectionUserCount.on("updateTotalUsers", (value) => {
    var newCountSpan = document.getElementById("totalUsers");
    newCountSpan.innerText = value.toString();
});

//send notification to hub
function newWindowLoadedOnClient() {
    connectionUserCount.send("NewWindowLoaded");
}

//start connection
function connectionSuccess() {
    console.log("Connection Success...");
    newWindowLoadedOnClient();
}

function connectionFailed() {
    console.log("Connection Failed...");
}

connectionUserCount.start().then(connectionSuccess, connectionFailed);