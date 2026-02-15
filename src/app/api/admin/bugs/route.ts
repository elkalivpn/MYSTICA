import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }

    if (priority) {
      where.priority = priority
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }

    const [bugs, total] = await Promise.all([
      db.bugReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      }),
      db.bugReport.count({ where })
    ])

    // Stats by status
    const statusStats = await db.bugReport.groupBy({
      by: ['status'],
      _count: true
    })

    // Stats by priority
    const priorityStats = await db.bugReport.groupBy({
      by: ['priority'],
      _count: true
    })

    return NextResponse.json({
      bugs: bugs.map(bug => ({
        id: bug.id,
        userId: bug.userId,
        user: bug.user,
        title: bug.title,
        description: bug.description,
        status: bug.status,
        priority: bug.priority,
        category: bug.category,
        device: bug.device,
        os: bug.os,
        browser: bug.browser,
        version: bug.version,
        assignedTo: bug.assignedTo,
        comments: JSON.parse(bug.comments),
        createdAt: bug.createdAt,
        updatedAt: bug.updatedAt,
        resolvedAt: bug.resolvedAt
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        byStatus: statusStats.reduce((acc, item) => {
          acc[item.status] = item._count
          return acc
        }, {} as Record<string, number>),
        byPriority: priorityStats.reduce((acc, item) => {
          acc[item.priority] = item._count
          return acc
        }, {} as Record<string, number>)
      }
    })
  } catch (error) {
    console.error('Error fetching bug reports:', error)
    return NextResponse.json(
      { error: 'Error fetching bug reports' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, description, category, priority, device, os, browser, version } = body

    if (!userId || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const bug = await db.bugReport.create({
      data: {
        userId,
        title,
        description,
        category: category || 'other',
        priority: priority || 'medium',
        device,
        os,
        browser,
        version
      }
    })

    return NextResponse.json({ success: true, bug })
  } catch (error) {
    console.error('Error creating bug report:', error)
    return NextResponse.json(
      { error: 'Error creating bug report' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { bugId, action, data } = body

    if (!bugId || !action) {
      return NextResponse.json(
        { error: 'Missing bugId or action' },
        { status: 400 }
      )
    }

    let updatedBug

    switch (action) {
      case 'update_status':
        const updateData: Record<string, unknown> = { status: data.status }

        if (data.status === 'resolved') {
          updateData.resolvedAt = new Date()
        }

        updatedBug = await db.bugReport.update({
          where: { id: bugId },
          data: updateData
        })
        break

      case 'update_priority':
        updatedBug = await db.bugReport.update({
          where: { id: bugId },
          data: { priority: data.priority }
        })
        break

      case 'assign':
        updatedBug = await db.bugReport.update({
          where: { id: bugId },
          data: {
            assignedTo: data.developerId,
            status: 'in_progress'
          }
        })
        break

      case 'add_comment':
        const bug = await db.bugReport.findUnique({
          where: { id: bugId }
        })
        if (!bug) {
          return NextResponse.json({ error: 'Bug not found' }, { status: 404 })
        }

        const comments = JSON.parse(bug.comments)
        comments.push({
          id: Date.now().toString(),
          message: data.message,
          authorId: data.authorId,
          authorName: data.authorName,
          createdAt: new Date().toISOString()
        })

        updatedBug = await db.bugReport.update({
          where: { id: bugId },
          data: { comments: JSON.stringify(comments) }
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, bug: updatedBug })
  } catch (error) {
    console.error('Error updating bug report:', error)
    return NextResponse.json(
      { error: 'Error updating bug report' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bugId = searchParams.get('bugId')

    if (!bugId) {
      return NextResponse.json(
        { error: 'Missing bugId' },
        { status: 400 }
      )
    }

    await db.bugReport.delete({
      where: { id: bugId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting bug report:', error)
    return NextResponse.json(
      { error: 'Error deleting bug report' },
      { status: 500 }
    )
  }
}
