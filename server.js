const path =require('path');
const http=require('http');
const express =require('express');
const socket=require('socket.io');
const formatMessage=require('./util/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers}=require('./util/users');

const app = express();
const server =http.createServer(app);
const io=socket(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botname="SkyChat Bot";

//run when client comnnects
io.on('connection', socket=>{

    socket.on('joinroom',({username,room})=>{

        const user=userJoin(socket.id, username,room);
        socket.join(user.room);

        //welcome current user
        socket.emit('message',formatMessage(botname,`${user.username}, welcome to SkyChat`));//as soon as someone connects it will send this message(will send msg to a single client)

        //broadcast when a useer connectrs(means send msg to everyone but the person himself)
        socket.broadcast.to(user.room).emit('message',formatMessage(botname,`${user.username} has joind the chat`));

        //send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });

    });

   
    //listem for chatmessage
    socket.on('chatmessage',(msg)=>{
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });

    //runs when a client disconnects
    socket.on('disconnect',()=>{

        const user= userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message',formatMessage(botname,`${user.username}, has left the chat`));

        //send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
        }
    });


    //io.emit(); tis will sed msg to everone
});

const PORT=3000 || process.env.PORT;

server.listen(PORT, ()=>{console.log(`server running on port ${PORT}`)});