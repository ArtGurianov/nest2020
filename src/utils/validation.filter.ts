import {Catch, HttpException} from '@nestjs/common'
import {GqlExceptionFilter} from '@nestjs/graphql'
import {CustomError, CustomErrorsResult} from '../types/CustomErrorsResult'

@Catch(HttpException)
export class ValidationFilter implements GqlExceptionFilter {
  catch(err: any) {
    if (err.response.origin === 'ValidationPipe') {
      const resultArray: CustomError[] = []
      err.response?.response?.message?.map((valErrObj: any) => {
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
    return err
  }
}
