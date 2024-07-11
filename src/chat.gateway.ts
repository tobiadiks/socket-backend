import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// can specify port and namespace
// @WebSocketGateway(80,{namespace:'chat'})
@WebSocketGateway(3002, {
  cors: { origin: 'http://localhost:3001', credentials: true },
})
export class ChatGateway {
  // accessing server clients
  @WebSocketServer()
  server: Server;
  // add all event handlers and broadcast to all listeners
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    // sending message to everyone on the server
    this.server.emit('message', message);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    // Handle authentication here
    const token = client.handshake.headers.authorization.split(' ')[1];
    if (!token) {
      client.disconnect(true);
      return;
    }
    try {
      const decoded = this.jwtService.verify(token);
      // Optionally, you can attach the user object to the client object for use in subsequent events
      client['user'] = decoded;
    } catch (err) {
      console.error('Invalid token');
      client.disconnect(true);
    }
  }
}
