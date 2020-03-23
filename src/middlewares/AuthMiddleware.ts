import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

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

    jwt.verify(parts[1], authConfig.secret, (err, decoded) => {
      if (err) {
        return res.status(401).json('Token invalid')
      }

      req.body.userId = (decoded as TokenDecoded).id

      return next()
    })
  }
}

export default new AuthMiddleware()
