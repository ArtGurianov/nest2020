import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common'

@Injectable()
class LoginValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      await super.transform(value, metadata)
    } catch (e) {
      throw new BadRequestException({...e, origin: 'ValidationPipe'})
    }
    return value
  }
}

export const loginValidationPipe = new LoginValidationPipe({
  exceptionFactory: (errors: ValidationError[]) =>
    new BadRequestException(errors),
})
