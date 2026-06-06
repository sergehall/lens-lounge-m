import * as bcrypt from 'bcrypt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepo } from '../../../users/infrastructure/users-repo';
import { UsersEntity } from '../../../users/entities/users.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorMessages } from '../../../../../../../libs/common/src/filters/custom-errors-messages';

export class ValidLoginOrEmailPasswordCommand {
  constructor(
    public loginOrEmail: string,
    public password: string,
  ) {}
}

@CommandHandler(ValidLoginOrEmailPasswordCommand)
export class ValidLoginOrEmailPasswordUseCase implements ICommandHandler<ValidLoginOrEmailPasswordCommand> {
  constructor(private readonly usersRepo: UsersRepo) {}

  async execute(
    command: ValidLoginOrEmailPasswordCommand,
  ): Promise<UsersEntity> {
    const { loginOrEmail, password } = command;

    const user: UsersEntity | null =
      await this.usersRepo.findUserByLoginOrEmail(loginOrEmail);

    if (
      !user ||
      user.isBanned ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      throw new HttpException(
        { message: [ErrorMessages.authentication.loginOrPassInvalid] },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
