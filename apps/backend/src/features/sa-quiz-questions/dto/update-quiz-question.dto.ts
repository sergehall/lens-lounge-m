import { IsString, Length, Validate } from 'class-validator';
import { IsArrayValidator } from '../../../../../../libs/common/src/validators/is-array.validator';

export class UpdateQuizQuestionDto {
  @IsString()
  @Length(10, 500, {
    message: 'Incorrect body! Must be min 10 ch, max 500 ch.',
  })
  body: string;

  @Validate(IsArrayValidator)
  correctAnswers: string[];
}
