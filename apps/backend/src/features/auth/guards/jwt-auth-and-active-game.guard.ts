import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessages } from '../../../../../../libs/common/src/filters/custom-errors-messages';

@Injectable()
export class JwtAuthAndActiveGameGuard extends AuthGuard('jwt-active-game') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, _info: any, _context: ExecutionContext) {
    if (err || !user) {
      throw (
        err ||
        new HttpException(
          { message: [ErrorMessages.jwt.incorrect] },
          HttpStatus.UNAUTHORIZED,
        )
      );
    }
    return user;
  }
}
