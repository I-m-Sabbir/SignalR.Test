//Create Connection
var connectionChat = new signalR.HubConnectionBuilder().withUrl("/hubs/chat").build();

//receive notification from the hub
connectionChat.on("messageSend", (message, user) => {
    let userBox = document.getElementById('receiverEmail').value;

    if (userBox == user) {
        var messageBody = document.getElementById("messageBody");
        var temp = document.createElement('div');
        temp.innerHTML = `
        <div style="max-width: 70%;">
            <div class="text-start">${user.split('@')[0]}  <sub>${formattedDateTime()}</sub></div>
            <p class="messageBodyTo">
            
            </p>
        </div>
        `;
        temp.getElementsByTagName("p")[0].innerText = message.messageBody;
        messageBody.appendChild(temp);
        scrollToBottom();
        connectionChat.send("MarkAsReadAsync", message.id);
    }
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

function formattedDateTime(initialDate) {
    let date = initialDate == null ? new Date() : new Date(initialDate);
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

connectionChat.on("unreadMessageCount", (data) => {
    var userList = document.getElementsByClassName("userList");
    for (let i = 0; i < userList.length; i++) {
        let linkTag = userList[i].getElementsByTagName("a")[0];
        let userId = linkTag.getAttribute("data-id");

        let unreadMessage = data.filter(obj => obj.senderId == userId);
        if (unreadMessage.length > 0) {
            console.log(unreadMessage[0].count);
            let temp = document.createElement('sup');
            temp.innerHTML = unreadMessage[0].count;

            userList[i].appendChild(temp);
        }
    }
});

function RequestPreviousMessage(receiverId, senderEmail) {
    var messageBody = document.getElementById("messageBody");
    messageBody.innerHTML = '';
    connectionChat.send("LoadPreviousMessage", receiverId, senderEmail);
}

connectionChat.on("LoadPreviousMessage", (messages) => {
    messages.forEach((item, index) => {
        var user = document.getElementById("user").value;

        if (item.senderEmail == user)
            PreviousLoadOwn(item);
        else
            PreviousLoadOther(item);
    })
});

function PreviousLoadOther(data) {
    var messageBody = document.getElementById("messageBody");

    var temp = document.createElement('div');
    temp.innerHTML = `
    <div style="max-width: 70%;">
        <div class="text-start">${data.senderEmail.split('@')[0]}  <sub>${formattedDateTime(data.messageDateTime)}</sub></div>
        <p class="messageBodyTo">
            
        </p>
    </div>
    `;
    temp.getElementsByTagName("p")[0].innerText = data.messageBody;
    messageBody.appendChild(temp);
    scrollToBottom();
}

function PreviousLoadOwn(data) {
    var messageBody = document.getElementById("messageBody");
    var temp = document.createElement('div');
    temp.innerHTML = `
    <div class="d-flex justify-content-end">
	    <div style="max-width: 70%;">
		    <div class="text-end">Me  <sub>${formattedDateTime(data.messageDateTime)}</sub></div>
		    <p class="messageBodyFrom">
			    
		    </p>
	    </div>
    </div>
    `;
    temp.getElementsByTagName("p")[0].innerText = data.messageBody;
    messageBody.appendChild(temp);
}