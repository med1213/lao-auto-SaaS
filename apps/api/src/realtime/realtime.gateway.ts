import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class RealtimeGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('tenant.join')
  joinTenant(@ConnectedSocket() socket: Socket, @MessageBody() tenantId: string) {
    socket.join(`tenant:${tenantId}`);
    return { joined: tenantId };
  }

  notifyTenant(tenantId: string, event: string, payload: unknown) {
    this.server?.to(`tenant:${tenantId}`).emit(event, payload);
  }
}
