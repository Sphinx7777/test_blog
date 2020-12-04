import passportLocal from 'passport-local';
import { Request } from 'express';
import UserModel, { UserSchema } from '../model/userModel';



const localLogOutStrategy = new passportLocal.Strategy({
    usernameField: 'userId',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
}, (req: Request, userId: string, password: string, done: any) => {
    const _id = userId
    UserModel.findOne({ _id })
        .exec()
        .then((user: any) => {
            if (!user) {
                return done({ message: 'Пользователь не найден' })
            }
            user.token = null
            user.save()
                .then((user: UserSchema) => {
                    req.cookies.token = null
                    req.session.identity = user.getGuestIdentity();
                    const guest =  user.getGuestIdentity();
                    return done(null, guest);
                })
                .catch((error: any) => {
                    console.log(error);
                    return done(error);
                });

        })
        .catch((err: any) => {
            return done({ message: err.message })
        })

});

export default localLogOutStrategy;