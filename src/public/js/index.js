const socket = io();


socket.on('nuevo_producto', data => {
    console.log('Nuevo producto:', data.producto);
  });