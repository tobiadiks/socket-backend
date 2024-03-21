import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
// can specify port and namespace
// @WebSocketGateway(80,{namespace:'chat'})
@WebSocketGateway(3002,{cors:{origin:'http://localhost:3001',credentials:true}})
export class ChatGateway {
    // accessing server clients
    @WebSocketServer()
    server;
    // add all event handlers and broadcast to all listeners
    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string): void {
        // sending message to everyone on the server
        this.server.emit('message',message)
    }
}