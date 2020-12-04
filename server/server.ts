import express, { Request, Response } from 'express'
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import next from 'next'
import { loadControllers, scopePerRequest } from 'awilix-express'
import container from './awilix/container'
import config from '../server/config'
import passport from 'passport';
import localRegisterStrategy from './auth/localRegisterStrategy'
import localSignInStrategy from './auth/localSignInStrategy'
import jwtStrategy from './auth/jwtStrategy'
import cookieParser from 'cookie-parser'
import localLogOutStrategy from './auth/logOutStrategy';



const env: any = process.env.PORT
const port = parseInt(env, 10) || config.PORT
const dev = process.env.NODE_ENV !== 'production'

export const app = next({ dev })
const handle = app.getRequestHandler()

passport.use('local-register', localRegisterStrategy);
passport.use('jwt-strategy', jwtStrategy.strategy);
passport.use('local-signIn', localSignInStrategy);
passport.use('log-out', localLogOutStrategy);


app.prepare().then(() => {
  const server = express()
  server.use(bodyParser.json({ limit: '10mb' }));
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(cookieParser());

  server.use(cookieSession({
    name: 'session',
    secret: 'sss',
    keys: [config.secretJwt],
    maxAge: 24 * 60 * 60 * 1000,
  }));


  server.use(passport.initialize())
  // server.use('/posts', authUser)


  server.use(scopePerRequest(container))
  const files = 'controllers/**/*.' + (config.dev ? 'ts' : 'js');
  server.use(loadControllers(files, { cwd: __dirname }))

  const Start = async () => {
    try {
      await mongoose.connect(config.mongoDbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        dbName: "posts"
      })
      // @ts-ignore
      server.listen(port, err => {
        if (err) throw err
          console.log(`> Server has started on http://localhost:${port}`)
      })
    } catch (err) {
      console.log(`some error ${err}`)
    }
  }

  server.all('*', (req: any, res: Response) => {
    return handle(req, res)
  })

  Start()
})



// export const IGNORS = [
//   '/favicon.ico',
//   '/_next',
//   '/static',
//   '/error',
//   '/sitemap.xml',
//   '/robots.txt',
//   '/service-worker.js',
//   '/manifest.json',
//   ]; 

  // const path = req.path.toString();
  // for (const item of IGNORS) {
  // if (path.startsWith(item)) {
  // useAcl = false;
  // }
  // }if (useAcl) { } else {
  // next();
  // }