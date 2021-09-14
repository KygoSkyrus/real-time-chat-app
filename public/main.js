const chatform = document.getElementById('form');
const chatMessages = document.querySelector('.chat-messages');
const roomname = document.getElementById('room-name');
const userList = document.getElementById('users');


//get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);

const socket = io();

//get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//join chat room
socket.emit('joinroom', { username, room });

//message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


//mesage submit
chatform.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;//to get the msg typed

    //emit message to server
    socket.emit('chatmessage', msg);

    //clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();

});


//output message to dom
function outputMessage(message) {

    if (message.username === 'SkyChat Bot') {
        const div = document.createElement('div');
        div.classList.add('message');
        div.innerHTML = `
        <div class="name-time flex green">
            <section>${message.username}</section>
            <section>${message.time}</section>
        </div>
        <div>
            <section class="main-message green-l">${message.text}</section>
        </div>`;
        document.querySelector('.chat-messages').appendChild(div);
    } else {
        const div = document.createElement('div');
        div.classList.add('message');
        div.innerHTML = `
        <div class="name-time flex">
            <section>${message.username}</section>
            <section>${message.time}</section>
        </div>
        <div>
            <section class="main-message">${message.text}</section>
        </div>`;
        document.querySelector('.chat-messages').appendChild(div);//it will add a div everytime when a msg recieved
    }

}

//ad roomname to dom
function outputRoomName(room) {
    roomname.innerText = room;
}

//ad roomname to dom
function outputUsers(users) {
    userList.innerHTML = `${users.map(user => ` <li class="list"><i class="fas fa-user fa-sm">&nbsp;&nbsp;&nbsp;&nbsp;</i>${user.username}</li>`).join('')}`;
}


//to show users on click
function showUsers() {
    document.getElementById('users').classList.toggle('display');
}

//to hide users when users are click
/*
function hideUsers(){
    document.getElementById('users').style.display="hidden";
}
*/