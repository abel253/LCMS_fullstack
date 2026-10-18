// server/api/auth/register.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, password, password_confirmation, phone, role } = body

  if (!name || !email || !password) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Name, email and password required',
    })
  }

  if (password !== password_confirmation) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Passwords do not match',
    })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Email already registered',
    })
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      role: role || 'student',
      password: await hashPassword(password),
      isVerified: true,
    },
  })

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