const socket = io();

socket.emit('message', 'Mensaje desde el Front'); // MODIFICAR