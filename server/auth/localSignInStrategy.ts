import passportLocal from 'passport-local';
import { Request } from 'express';
import UserModel, { UserSchema } from '../model/userModel';
import jwt from 'jsonwebtoken'
import config from '../config'
import * as bcrypt from 'bcrypt'

const localSignInStrategy = new passportLocal.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
}, (req: Request, email: string, password: string, done: any) => {
    UserModel.findOne({ email })
        .exec()
        .then(async (user: any) => {
            if (!user) {
                return done({ message: 'Incorrectly entered data' })
            }
            const userIsValid = await bcrypt.compare(password, user.password)
            if (userIsValid) {
                const token = jwt.sign(user._id.toString(), config.secretJwt)
                user.token = token
                user.lastDateOfActive = new Date().getTime()
                user.save()
                    .then((user: UserSchema) => {
                        user.initSession(req);
                        const identity = user.getIdentity();
                        req.session.identity = identity;
                        done(null, identity);
                    })
                    .catch((error: any) => {
                        console.log(error);
                        return done(error);
                    });
            } else {
                return done({ message: 'Incorrectly entered data' })
            }
        })
        .catch((err: any) => {
            return done({ message: err.message })
        })

});

export default localSignInStrategy;