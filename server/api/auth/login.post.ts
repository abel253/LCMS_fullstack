// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (!email || !password) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Email and password required',
    })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found — please register first',
    })
  }

  if (!user.password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Please login with OTP',
    })
  }

  const valid = await verifyPassword(password, user.password)
  if (!valid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    })
  }

  const token = generateToken(user.id)

  return {
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    },
  }
})