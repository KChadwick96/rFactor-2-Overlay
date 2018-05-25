// create socket connection
/* this._socket = SocketIO(this.SOCKET_URL);
this._socket.on('connect', () => console.log('connected to socket server'));
this._socket.on('disconnect', () => console.log('disconnected from socket server'));
this._socket.on('carSelect', data => this._goToCar(data.slot_id, data.camera)); */

/* _goToCar(slotId, camera): void {

    // select camera
    const cameraEndpoint = `${this.BASE_URL}/focus/${camera}/GROUP1/false`;
    this.http.put(cameraEndpoint, {}).subscribe();

    // select slot
    const slotEndpoint = `${this.BASE_URL}/focus/${slotId}`;
    this.http.put(slotEndpoint, {}).subscribe();
} */

/* _streamData(data): void {
    if (data && this._socket.connected) {
      this._socket.emit('updateSessionData', data);
    }
} */