import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import User from '../models/User'
import authConfig from '../config/auth.json'

interface TokenDecoded {
  id: string;
}

class AuthMiddleware {
  public authVerification (req: Request, res: Response, next: NextFunction): Response | undefined {
    const authentication = req.headers.authorization

    if (!authentication) {
      return res.status(401).json('No token provided')
    }

    const parts = authentication.split(' ')

    if (!(/^Bearer/.test(authentication)) || parts.length !== 2) {
      return res.status(401).json('Token error')
    }

    jwt.verify(parts[1], authConfig.secret, async (err, decoded) => {
      if (err) {
        return res.status(401).json('Token invalid')
      }

      const user = await User.findById((decoded as TokenDecoded).id)

      if (user) {
        req.body.userId = (decoded as TokenDecoded).id

        return next()
      }

      return res.status(401).json('the token used does not belong to any user registered in the database')
    })
  }
}

export default new AuthMiddleware()
