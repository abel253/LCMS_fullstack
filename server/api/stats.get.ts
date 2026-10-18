// server/api/stats.get.ts
export default defineEventHandler(async () => {
  try {
    // 🔍 ትይዩ ጥሪዎች
    const [studentCount, bookCount, researchCount] = await Promise.all([
      // የተማሪዎች ቁጥር
      prisma.user.count({
        where: { userType: 'Student' },
      }),
      // የመጽሐፍት ቁጥር
      prisma.item.count({
        where: { status: 'AVAILABLE' },
      }),
      // የሪሰርች ቁጥር
      prisma.research.count(),
    ])

    return {
      success: true,
      data: {
        students: studentCount,
        books: bookCount,
        research: researchCount,
      },
    }
  } catch (error: any) {
    console.error('Stats error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch stats',
    })
  }
})