// server/api/books/search.ts
// ✅ Prisma ተጠቀም — raw MySQL አይደለም

export default defineEventHandler(async (event) => {
  const params = getQuery(event)
  const q = String(params.q ?? params.query ?? '').trim()
  const type = String(params.type ?? 'title').trim().toLowerCase()

  try {
    // 🔍 የፍለጋ ሁኔታ
    const where: any = {}

    if (q) {
      if (type === 'author') {
        where.author = { contains: q }
      } else if (type === 'isbn') {
        where.isbn = { contains: q }
      } else {
        where.title = { contains: q }
      }
    }

    const items = await prisma.item.findMany({
      where,
      take: 10,
      orderBy: [{ availableQuantity: 'desc' }, { title: 'asc' }],
      select: {
        itemId: true,
        title: true,
        author: true,
        isbn: true,
        callNumber: true,
        availableQuantity: true,
        status: true,
      },
    })

    return {
      success: true,
      count: items.length,
      books: items.map((i) => ({
        item_id: i.itemId,
        title: i.title,
        author: i.author || 'Unknown',
        isbn: i.isbn,
        call_number: i.callNumber,
        available_copies: i.availableQuantity ?? 0,
        is_available: (i.availableQuantity ?? 0) > 0 && i.status === 'AVAILABLE',
      })),
    }
  } catch (error) {
    console.error('Book search error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Database search failed',
    })
  }
})