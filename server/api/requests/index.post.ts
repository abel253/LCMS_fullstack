// server/api/requests/index.post.ts
export default defineEventHandler(async (event) => {
  const { itemId, guestName, guestPhone } = await readBody(event)

  if (!itemId) {
    throw createError({ statusCode: 422, statusMessage: 'Item ID required' })
  }

  // 🔓 Login አያስፈልግም — ማንኛውም ሰው መጠየቅ ይችላል

  const item = await prisma.item.findUnique({
    where: { itemId: Number(itemId) },
  })

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found' })
  }

  if ((item.availableQuantity ?? 0) <= 0) {
    throw createError({
      statusCode: 409,
      statusMessage: 'No copies available right now',
    })
  }

  // 📝 ጥያቄ ፍጠር — user_id NULL ወይም guest
  const [tx] = await prisma.$transaction([
    prisma.borrowTransaction.create({
      data: {
        userId: null,          // ✅ Login የለም — NULL
        itemId: Number(itemId),
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'REQUESTED',
      },
    }),
    prisma.item.update({
      where: { itemId: Number(itemId) },
      data: { availableQuantity: { decrement: 1 } },
    }),
  ])

  // 📝 Guest info በ audit log ውስጥ አስቀምጥ
  await prisma.auditLog.create({
    data: {
      userId: null,
      action: 'GUEST_REQUEST',
      tableName: 'borrow_transactions',
      recordId: tx.transactionId,
      newData: {
        guestName: guestName || 'Guest',
        guestPhone: guestPhone || null,
        itemId: Number(itemId),
        itemTitle: item.title,
      },
    },
  })

  return {
    success: true,
    message: `Request submitted! We'll contact you at ${guestPhone || 'your phone'} when the book is ready.`,
    data: {
      request_id: tx.transactionId,
      item_id: tx.itemId,
      item_title: item.title,
      status: tx.status,
    },
  }
})