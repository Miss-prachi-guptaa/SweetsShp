import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; phone: string; email?: string; message: string; subject?: string }) {
    try {
      const created = await this.prisma.contactMessage.create({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          subject: data.subject,
          message: data.message,
          status: 'UNREAD',
        },
      });
      return { success: true, data: created };
    } catch (err: any) {
      this.logger.error(`Failed to save contact message: ${err.message}`);
      return { success: true, fallback: true, message: 'Message logged' };
    }
  }

  async findAll() {
    try {
      const messages = await this.prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return { success: true, data: messages };
    } catch (err: any) {
      this.logger.error(`Failed to fetch contact messages: ${err.message}`);
      return { success: true, data: [] };
    }
  }

  async updateStatus(id: number, status: string) {
    try {
      const updated = await this.prisma.contactMessage.update({
        where: { id },
        data: { status },
      });
      return { success: true, data: updated };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.contactMessage.delete({
        where: { id },
      });
      return { success: true, message: 'Deleted' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}
