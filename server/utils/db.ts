// server/utils/db.ts
import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
<<<<<<< HEAD
import { PrismaClient } from '~/generated/prisma/client'
=======
import { PrismaClient } from '~/app/generated/prisma/client'   // ← ✅ አዲስ import
>>>>>>> 446808d0c07d20c161d39a68e37dbdc45c63dad9

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'library',
  connectionLimit: 5,
})

let prisma: PrismaClient

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter })
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({ adapter })
  }
  prisma = global.__prisma
}

export { prisma }