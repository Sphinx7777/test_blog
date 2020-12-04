import { route, GET, POST, before } from 'awilix-express'
import userModel, { User } from '../model/userModel';
import passport from 'passport';
import { Request, Response } from 'express';


@route('/api/v.1.0/users')
export default class UsersAPI {
  public userModel: User
  constructor() {
    this.userModel = userModel
  }

  @route('/registration')
  @POST()
  registrationUser(req: Request, res: Response) {
    passport.authenticate('local-register', (error, user) => {
      if (error) {
        return res.status(500).json({ message: error.message, success: false })
      } else if (!user) {
        return res.status(500).json({ message: error.message, success: false })
      }
      return res.status(200).json(
        {
          data: user.email,
          success: true,
          message: 'You have successfully registered!'
        }
      );
    })(req, res)

  }

  @route('/emailValidate')
  @POST()
  async emailValidate(req: Request, res: Response) {

    const email: string = req.body.email
    const emailValid = await this.userModel.findOne({ email })
    if (emailValid) {
      res.status(200).json({ success: false, message: 'Sorry, email is already in use' })
    }
    return res.status(200).json({ success: true, message: 'Email is valid' });

  }

  @route('/auth')
  @POST()
  signInUser(req: Request, res: Response) {
    passport.authenticate('local-signIn', (error, identity) => {
      if (error) {
        return res.status(500).json({message: error.message, success: false  })
      } else if (!identity) {
        return res.status(500).json({ message: error.message, success: false })
      }
      res.cookie('token', identity.token, { maxAge: 43200000});
      return res.status(200).json({
        data: identity,
        success: true,
        message: 'Authentication successful'
      });
    })(req, res)
  }

  @route('/logout')
  @POST()
  logOutUser(req: Request, res: Response) {
    passport.authenticate('log-out', (error, guest) => {
      if (error) {
        return res.status(500).json({ message: error.message, success: false })
      } else if (!guest) {
        return res.status(500).json({ message: error.message, success: false })
      }
      return res.status(200).json({
        success: true,
        message: 'User logOut',
        data: guest
      });
    })(req, res)
  }
}