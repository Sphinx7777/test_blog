import { Strategy, ExtractJwt } from 'passport-jwt';
import config, { ONE_HOUR } from '../config'
import { Request } from 'express';
import userModel from '../model/userModel';


class Jwt {
  private _strategy: any;
  private _request: any;
  get strategy() {
    return this._strategy;
  }

  constructor() {
    this.verifyRequest = this.verifyRequest.bind(this);
    this.getJwtFromRequest = this.getJwtFromRequest.bind(this);

    this._strategy = new Strategy({
      jwtFromRequest: this.getJwtFromRequest,
      secretOrKey: config.secretJwt,
    }, this.verifyRequest);
  }

  public async verifyRequest(jwtPayload: any, done: any) {
    if (jwtPayload) {
      const sub = jwtPayload.sub;
      let identity = this._request.session.identity;
      if (identity.updatedAt - Date.now() > ONE_HOUR) {
        const user = await userModel.findById(sub);
        if (user) {
          identity = user.getIdentity();
        } else {
          identity = user.getGuestIdentity();
        }
      }
      this._request.session.identity = identity;
      return done(null, identity);
    }
  }

  public getJwtFromRequest(req: any) {

    this._request = req;
    const getToken = ExtractJwt.fromAuthHeaderAsBearerToken();

    return getToken(req) || req.cookies['token'] || null;
  }
}

export default new Jwt();

