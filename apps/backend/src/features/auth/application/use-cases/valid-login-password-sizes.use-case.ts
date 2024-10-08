import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomErrorsMessagesType } from '../../../../../../../libs/common/src/filters/types/custom-errors-messages.types';
import { ErrorMessages } from '../../../../../../../libs/common/src/filters/custom-errors-messages';

export class ValidLoginPasswordSizesCommand {
  constructor(
    public loginOrEmail: string,
    public password: string,
  ) {}
}

@CommandHandler(ValidLoginPasswordSizesCommand)
export class ValidLoginPasswordSizesUseCase
  implements ICommandHandler<ValidLoginPasswordSizesCommand>
{
  async execute(command: ValidLoginPasswordSizesCommand): Promise<void> {
    const { loginOrEmail, password } = command;

    const messages: CustomErrorsMessagesType[] = [];

    this.validateLength(
      loginOrEmail.toString(),
      3,
      50,
      ErrorMessages.authentication.invalidLoginOrEmailLength,
      messages,
    );

    this.validateLength(
      password.toString(),
      6,
      20,
      ErrorMessages.authentication.invalidPasswordLength,
      messages,
    );

    if (messages.length !== 0) {
      throw new HttpException(
        {
          message: messages,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private validateLength(
    value: string,
    min: number,
    max: number,
    errorMessage: CustomErrorsMessagesType,
    messages: CustomErrorsMessagesType[],
  ): void {
    if (value.length < min || value.length > max) {
      messages.push(errorMessage);
    }
  }
}
