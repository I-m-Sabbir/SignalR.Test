//Create Connection
var connectionChat = new signalR.HubConnectionBuilder().withUrl("/hubs/chat").build();

//receive notification from the hub
connectionChat.on("messageSend", (message, user) => {
    var messageBody = document.getElementById("messageBody");

    var temp = document.createElement('div');
    temp.innerHTML = `
    <div style="max-width: 70%;">
        <div class="text-start">${user.split('@')[0]}  <sub>${formattedDateTime()}</sub></div>
        <p class="messageBodyTo">
            ${message}
        </p>
    </div>
    `;
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
    temp.innerHTML = `
    <div class="d-flex justify-content-end">
	    <div style="max-width: 70%;">
		    <div class="text-end">Me  <sub>${formattedDateTime()}</sub></div>
		    <p class="messageBodyFrom">
			    
		    </p>
	    </div>
    </div>
    `;
    temp.getElementsByTagName("p")[0].innerText = message;
    messageBody.appendChild(temp);
}

function scrollToBottom() {
    var element = document.getElementsByClassName('message')[0];

    element.scrollTop = element.scrollHeight;
}