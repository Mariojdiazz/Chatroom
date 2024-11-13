const express = require('express'); 
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const usuarios = [];

server.listen(3000, function(){
    console.log("Corriendo en el puerto 3000");
});

const io = new socket.Server(server);

app.get('/', function(llamado, respuesta){
    respuesta.sendFile(__dirname + '/cliente.html');
}); 

io.on('connection', function(socket){
    socket.on('nuevo usuario', function(usuario, callback){
        if(usuarios.indexOf(usuario) != -1){
            callback(false);
        }
        else{
            callback(true);
            socket.usuario = usuario;
            usuarios.push(usuario);
            actualizarUsuarios();
            io.emit('mensaje', {mensaje: 'se ha conectado', usuario: socket.usuario});
        }
    });

    socket.on('nuevo mensaje', function(mensaje){
        io.emit('mensaje', {mensaje: mensaje, usuario: socket.usuario});
    });

    const actualizarUsuarios = () => {
        io.emit('actualizarUsuarios', usuarios);
    };

    socket.on('disconnect', function(data){
        usuarios.splice(usuarios.indexOf(socket.usuario), 1);
        io.emit('mensaje',{mensaje: 'se ha desconectado', usuario:socket.usuario});
        actualizarUsuarios();
    });
});
