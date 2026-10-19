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

  // ⚡ ሁሉንም አስፈላጊ ኮለሞች ከዳታቤዝ አውጣ
  const items = await prisma.item.findMany({
    where,
    take: limit,
    orderBy: [{ availableQuantity: 'desc' }, { title: 'asc' }],
  })

  // ⚡ ሁሉንም ወደ ፊት አስተላልፍ
  return items.map((item) => ({
    item_id: item.itemId,
    title: item.title,
    author: item.author || 'Unknown Author',
    isbn: item.isbn,
    call_number: item.callNumber,
    publisher: item.publisher,
    publication_year: item.publicationYear,
    edition: item.edition,
    shelf_number: item.shelfNumber,             // ← ይህ ተጨምሯል
    sub_shelf_number: item.subShelfNumber,      // ← ይህ ተጨምሯል
    subject_category: item.subjectCategory,
    location: item.location,                    // ← ይህ ተጨምሯል
    barcode: item.barcode,
    quantity: item.quantity,
    total_copies: item.quantity ?? 1,
    available_copies: item.availableQuantity ?? 0,
    available_quantity: item.availableQuantity ?? 0,
    item_type: item.itemType,
    status: item.status,
    shelf_type: item.shelfType,                 // ← በጣም አስፈላጊው ኮለም!
    is_available:
      (item.availableQuantity ?? 0) > 0 && item.status === 'AVAILABLE',
  }))
})