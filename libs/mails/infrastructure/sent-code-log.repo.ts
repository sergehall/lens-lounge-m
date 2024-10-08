import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SentCodesLogEntity } from '../entities/sent-codes-log.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { UsersEntity } from '../../../apps/backend/src/features/users/entities/users.entity';

export class SentCodeLogRepo {
  constructor(
    @InjectRepository(SentCodesLogEntity)
    private readonly sentCodesLogRepository: Repository<SentCodesLogEntity>,
  ) {}

  async addTime(user: UsersEntity): Promise<SentCodesLogEntity> {
    const newLogEntry: SentCodesLogEntity = await this.createNewLogEntry(user);

    try {
      return await this.sentCodesLogRepository.save(newLogEntry);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        throw new InternalServerErrorException(error.message);
      } else {
        console.log('An unknown error occurred');
        throw new InternalServerErrorException('An unknown error occurred');
      }
    }
  }

  private async createNewLogEntry(
    user: UsersEntity,
  ): Promise<SentCodesLogEntity> {
    const newLogEntry = new SentCodesLogEntity();
    newLogEntry.sentForUser = user;
    newLogEntry.sentCodeTime = new Date().toISOString();
    return newLogEntry;
  }
}
