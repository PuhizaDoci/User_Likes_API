import jwt from 'jsonwebtoken';
import {Request, Response} from 'express';

export function generateJwtToken(userid: string, email: string) {
    return jwt.sign({userid, email}, process.env.TOKEN_SECRET as string, { expiresIn: '3600s' });
}

export function authenticateToken(req: Request, res: Response, next: any) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403)
    
    req.user = user as UserDto

    next()
  })
}