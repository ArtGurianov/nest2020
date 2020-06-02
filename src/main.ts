import {NestFactory} from '@nestjs/core'
import {NestExpressApplication} from '@nestjs/platform-express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import {AppModule} from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.use(helmet())
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10000, // limit each IP to 100 requests per windowMs
    }),
  )
  app.set('trust proxy', 1)
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  })
  //app.use(csurf({cookie: true}))
  await app.listen(3000)
}
bootstrap()
