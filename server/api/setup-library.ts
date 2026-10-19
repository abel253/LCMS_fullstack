// server/api/setup-library.ts
// ✅ Prisma ተጠቀም — raw MySQL አይደለም

export default defineEventHandler(async (event) => {
  try {
    // 🔍 ነባር ዳታዎችን አረጋግጥ
    const userCount = await prisma.user.count()
    const itemCount = await prisma.item.count()
    const configCount = await prisma.systemConfig.count()

    // ⚙️ Default configurations ከሌሉ ፍጠር
    if (configCount === 0) {
      await prisma.systemConfig.createMany({
        data: [
          {
            configKey: 'default_due_days',
            configValue: '14',
            description: 'Default number of days for checkout',
          },
          {
            configKey: 'max_items_per_student',
            configValue: '5',
            description: 'Maximum items a student can borrow',
          },
          {
            configKey: 'max_items_per_faculty',
            configValue: '10',
            description: 'Maximum items a faculty can borrow',
          },
          {
            configKey: 'max_renewals',
            configValue: '2',
            description: 'Maximum number of renewals allowed',
          },
          {
            configKey: 'reservation_expiry_days',
            configValue: '3',
            description: 'Days to pick up reserved item',
          },
          {
            configKey: 'email_notifications',
            configValue: 'true',
            description: 'Enable email notifications for overdue items',
          },
        ],
        skipDuplicates: true,
      })
    }

    // 📊 ውጤት መልስ
    return {
      success: true,
      message: 'Library system is ready!',
      stats: {
        users: userCount,
        items: itemCount,
        configs: await prisma.systemConfig.count(),
      },
    }
  } catch (error: any) {
    console.error('Setup error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Setup failed',
    })
  }
})