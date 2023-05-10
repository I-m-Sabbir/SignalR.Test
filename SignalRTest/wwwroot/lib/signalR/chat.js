//Create Connection
var connectionChat = new signalR.HubConnectionBuilder().withUrl("/hubs/chat").build();

//receive notification from the hub
connectionChat.on("messageSend", (message, user) => {
    var messageBody = document.getElementById("messageBody");

    var temp = document.createElement('div');
    temp.innerHTML = `<div class="left"><div class="col-md-12">${user.split('@')[0]} <sub>${formattedDateTime()}</sub></div><div class="col-md-10"><p class="messageBodyTo"></p></div></div>`;
    temp.getElementsByTagName("p")[0].innerText = message;
    messageBody.appendChild(temp);
    scrollToBottom();
});

//send notification to hub
function submitMessage() {
    var message = document.getElementById("messageText").value;
    var receiver = document.getElementById("receiver").value;
    loadMessageToOwn(message);
    connectionChat.send("SendMessage", message, receiver);
    document.getElementById("messageText").value = '';
    scrollToBottom();
}

//start connection
function connectionSuccess() {
    console.log("Chat Connection Success...");
}

function connectionFailed() {
    console.log("Chat Connection Failed...");
}

connectionChat.start().then(connectionSuccess, connectionFailed);

//datetime
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "September", "Oct", "Nov", "Dec"
];

function formattedDateTime() {
    let date = new Date();
    let year = date.getFullYear();
    let month = monthNames[date.getMonth()];
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    if (day < 10) day = '0' + day;
    if (hour < 10) hour = '0' + hour;
    if (minute < 10) minute = '0' + minute;
    if (second < 10) second = '0' + second;

    return `${hour}:${minute}:${second} - ${day} ${month}, ${year}`;
}

function loadMessageToOwn(message) {
    var messageBody = document.getElementById("messageBody");
    var temp = document.createElement('div');
    temp.innerHTML = `<div class="right"><div class="col-md-12">Me <sub>${formattedDateTime()}</sub></div><div class="col-md-10"><p class="messageBodyFrom"></p></div></div>`;
    temp.getElementsByTagName("p")[0].innerText = message;
    messageBody.appendChild(temp);
}

function scrollToBottom() {
    var element = document.getElementsByClassName('message')[0];

    element.scrollTop = element.scrollHeight;
}