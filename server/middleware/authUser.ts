import { Request, Response } from 'express';
import passport from 'passport';



export function authUser(req: Request, res: Response, next: any) {
  passport.authenticate('jwt-strategy', (error, identity) => {
    if (identity) {
      next()
    }else if(error){
      return res.status(500).json({ data: { message: error.message, success: false } })
    }else {
      return res.redirect('/register')
    }
  }
  )(req,res)
}