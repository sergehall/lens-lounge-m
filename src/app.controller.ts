import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get('/healthz')
  getHealthz() {
    return { status: 'ok' };
  }

  @Get('/ready')
  getReady() {
    return { status: 'ready' };
  }
}
