// server/api/items/search.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()
  const type = String(query.type || 'title').toLowerCase()
  const limit = Math.min(Number(query.limit) || 10000, 10000)

  const where: any = {}
  if (q) {
    if (type === 'author') where.author = { contains: q }
    else if (type === 'isbn') where.isbn = { contains: q }
    else where.title = { contains: q }
  }

  const items = await prisma.item.findMany({
    where,
    take: limit,
    orderBy: [{ availableQuantity: 'desc' }, { title: 'asc' }],
  })

  return items.map((item) => ({
    item_id: item.itemId,
    title: item.title,
    author: item.author || 'Unknown Author',
    isbn: item.isbn,
    call_number: item.callNumber,
    total_copies: item.quantity ?? 1,
    available_copies: item.availableQuantity ?? 0,
    is_available:
      (item.availableQuantity ?? 0) > 0 && item.status === 'AVAILABLE',
  }))
})