import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  //
  // const configService = app.get<ConfigService<ConfigType, true>>(ConfigService);
  //
  // const redisUrl = configService.get<string>('db.redis.REDIS_URL', {
  //   infer: true,
  // });
  //

  const redisUrl = 'redis://localhost:6379';

  console.log(`Redis URL: ${redisUrl}`);

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      url: redisUrl,
    },
  });

  // Start the gateway and microservice listening
  await app.startAllMicroservices();
  await app.listen(3000); // Gateway listens on port 3000
}
bootstrap();
