import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RabbitMQService } from '../../../libs/rabbitmq/src/rabbitmq.service';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  afterInit(_server: Server) {
    console.log('WebSocket server initialized');
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { queue: string; content: string },
  ): Promise<void> {
    await this.rabbitMQService.sendToQueue(data.queue, data.content);
    this.server.emit('messageSent', {
      queue: data.queue,
      content: data.content,
    });
  }
}
