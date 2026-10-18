// server/utils/auth.ts
import type { H3Event } from 'h3'

export async function requireAuth(event: H3Event) {
  const auth = getHeader(event, 'authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const payload = verifyToken(token)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  })

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'User not found' })
  }

  return user
}