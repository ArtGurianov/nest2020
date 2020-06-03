import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common'

@Injectable()
class RegisterValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      await super.transform(value, metadata)
    } catch (e) {
      throw new BadRequestException({...e, origin: 'ValidationPipe'})
    }
    return value
  }
}

export const registerValidationPipe = new RegisterValidationPipe({
  exceptionFactory: (errors: ValidationError[]) =>
    new BadRequestException(errors),
})
