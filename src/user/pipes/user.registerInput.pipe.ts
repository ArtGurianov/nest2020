import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common'
import {CustomError, CustomErrorsResult} from '../../types/CustomErrorsResult'

@Injectable()
class RegisterValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      await super.transform(value, metadata)
    } catch (e) {
      const resultArray: CustomError[] = []
      e.response.message.map((valErrObj: any) => {
        const messages: string[] = []
        Object.keys(valErrObj.constraints).forEach(key => {
          messages.push(valErrObj.constraints[key])
        })
        resultArray.push({
          property: valErrObj.property,
          errorMessages: messages,
        })
      })
      return new CustomErrorsResult({errors: resultArray})
    }
    return value
  }
}

export const registerValidationPipe = new RegisterValidationPipe({
  exceptionFactory: (errors: ValidationError[]) =>
    new BadRequestException(errors),
})
