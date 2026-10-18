// test-prisma.ts
import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from './app/generated/prisma/client'

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'library',
  connectionLimit: 5,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const userCount = await prisma.user.count()
  const itemCount = await prisma.item.count()
  const txCount = await prisma.borrowTransaction.count()

  console.log(`👤 Users:     ${userCount}`)
  console.log(`📚 Items:     ${itemCount}`)
  console.log(`📖 Borrow Tx: ${txCount}`)

  const sample = await prisma.item.findMany({
    take: 3,
    where: { status: 'AVAILABLE' },
    select: { itemId: true, title: true, author: true },
  })
  console.log('\n📖 Sample items:')
  sample.forEach((i) => console.log(`  #${i.itemId} — ${i.title} (${i.author})`))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())