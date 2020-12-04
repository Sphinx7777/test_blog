import passportLocal from 'passport-local';


import UserModel from '../model/userModel';
import { Request } from 'express';

const localRegisterStrategy = new passportLocal.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
}, (req: Request, email: string, password: string, done: any) => {
    const userData = {
        email: email.trim().toLowerCase(),
        password: password.trim(),
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        photoUrl: req.body.photoUrl,
        fullName: `${req.body.firstName} ${req.body.lastName}`
    };

    const newUser = new UserModel(userData);
    newUser.save()
        .then((user) => {
            return done(null, user);
        })
        .catch((error) => {
            return done(error);
        });

});

export default localRegisterStrategy;