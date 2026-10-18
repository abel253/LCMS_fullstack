// server/utils/jwt.ts
import jwt from 'jsonwebtoken'

interface TokenPayload {
  userId: number
}

export function generateToken(userId: number): string {
  const config = useRuntimeConfig()
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as jwt.SignOptions)
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const config = useRuntimeConfig()
    return jwt.verify(token, config.jwtSecret) as TokenPayload
  } catch {
    return null
  }
}