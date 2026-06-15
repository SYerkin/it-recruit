import { prisma } from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'chat');

function ensureUploadDir(conversationId) {
  const dir = path.join(UPLOAD_DIR, String(conversationId));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);
}

async function ensureParticipant(application, userId, role) {
  if (role === 'CANDIDATE') {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user?.profile || application.candidateProfileId !== user.profile.id) {
      return false;
    }
    return true;
  }
  if (role === 'HR' || role === 'ADMIN') {
    if (application.job.creatorId !== userId && role !== 'ADMIN') return false;
    return true;
  }
  return false;
}

// GET /api/applications/:id/chat — получить или создать чат и список сообщений
export const getChat = async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
        candidateProfile: { include: { user: true } },
      },
    });

    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }

    const isParticipant = await ensureParticipant(
      application,
      req.user.id,
      req.user.role
    );
    if (!isParticipant) {
      return res.status(403).json(errorResponse('Permission denied'));
    }

    let conversation = await prisma.conversation.findUnique({
      where: { applicationId },
      include: {
        messages: {
          include: {
            author: {
              select: { id: true, email: true, role: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { applicationId },
        include: {
          messages: {
            include: {
              author: {
                select: { id: true, email: true, role: true },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }

    const messages = conversation.messages.map((m) => ({
      ...m,
      attachmentUrl: m.attachmentPath
        ? `/uploads/chat/${conversation.id}/${path.basename(m.attachmentPath)}`
        : null,
    }));

    return res.json(
      successResponse({
        conversation: {
          id: conversation.id,
          applicationId: conversation.applicationId,
        },
        messages,
      })
    );
  } catch (error) {
    console.error('Get chat error:', error);
    return res.status(500).json(errorResponse('Failed to fetch chat'));
  }
};

// POST /api/applications/:id/chat/messages — отправить сообщение (текст и/или файл)
export const sendMessage = async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    const body = (req.body && req.body.body) || (req.body && req.body.text) || '';
    const attachmentBase64 = req.body && req.body.attachment;
    const attachmentName = req.body && req.body.attachmentName;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true, candidateProfile: true },
    });

    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }

    const isParticipant = await ensureParticipant(
      application,
      req.user.id,
      req.user.role
    );
    if (!isParticipant) {
      return res.status(403).json(errorResponse('Permission denied'));
    }

    let conversation = await prisma.conversation.findUnique({
      where: { applicationId },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { applicationId },
      });
    }

    let attachmentPath = null;
    let attachmentStoredName = null;

    if (attachmentBase64 && attachmentName) {
      ensureUploadDir(conversation.id);
      const ext = path.extname(attachmentName) || '';
      const base = sanitizeFilename(path.basename(attachmentName, ext));
      attachmentStoredName = `${base}_${Date.now()}${ext}`;
      const fullPath = path.join(UPLOAD_DIR, String(conversation.id), attachmentStoredName);
      const buffer = Buffer.from(attachmentBase64, 'base64');
      fs.writeFileSync(fullPath, buffer);
      attachmentPath = path.join(String(conversation.id), attachmentStoredName);
    }

    if (!body?.trim() && !attachmentPath) {
      return res.status(400).json(errorResponse('Message must have text or attachment'));
    }

    const message = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        authorId: req.user.id,
        body: body?.trim() || null,
        attachmentName: attachmentName || null,
        attachmentPath,
      },
      include: {
        author: {
          select: { id: true, email: true, role: true },
        },
      },
    });

    const attachmentUrl = message.attachmentPath
      ? `/uploads/chat/${message.attachmentPath}`
      : null;

    return res.status(201).json(
      successResponse(
        {
          ...message,
          attachmentUrl,
        },
        'Message sent'
      )
    );
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json(errorResponse('Failed to send message'));
  }
};

// POST /api/applications/:id/chat/read — пометить сообщения как прочитанные
export const markChatRead = async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    const { lastMessageId } = req.body || {};

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true, candidateProfile: true },
    });

    if (!application) {
      return res.status(404).json(errorResponse('Application not found'));
    }

    const isParticipant = await ensureParticipant(
      application,
      req.user.id,
      req.user.role
    );
    if (!isParticipant) {
      return res.status(403).json(errorResponse('Permission denied'));
    }

    const conversation = await prisma.conversation.findUnique({
      where: { applicationId },
      include: { messages: true },
    });

    if (!conversation) {
      return res.json(successResponse({ marked: 0 }));
    }

    const candidateUserId = application.candidateProfile?.userId;
    const otherUserId =
      req.user.role === 'CANDIDATE'
        ? application.job.creatorId
        : candidateUserId;

    if (!otherUserId) {
      return res.json(successResponse({ marked: 0 }));
    }

    const idLimit = lastMessageId != null ? parseInt(lastMessageId, 10) : undefined;
    const where = {
      conversationId: conversation.id,
      authorId: otherUserId,
      readAt: null,
    };
    if (idLimit != null && !Number.isNaN(idLimit)) {
      where.id = { lte: idLimit };
    }

    const toUpdate = await prisma.chatMessage.findMany({
      where,
      select: { id: true },
    });

    if (toUpdate.length === 0) {
      return res.json(successResponse({ marked: 0 }));
    }

    await prisma.chatMessage.updateMany({
      where: { id: { in: toUpdate.map((m) => m.id) } },
      data: { readAt: new Date() },
    });

    return res.json(successResponse({ marked: toUpdate.length }));
  } catch (error) {
    console.error('Mark chat read error:', error);
    return res.status(500).json(errorResponse('Failed to mark as read'));
  }
};
