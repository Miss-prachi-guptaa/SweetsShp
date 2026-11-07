import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Healthcheck endpoint reporting status of API, PostgreSQL, and Redis' })
  async check() {
    let dbStatus = 'disconnected';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch {
      dbStatus = 'disconnected / pending migration';
    }

    const redisStatus = this.redis.getStatus();

    return {
      status: 'ok',
      service: 'chicksum-backend',
      timestamp: new Date().toISOString(),
      database: {
        provider: 'postgresql',
        status: dbStatus,
      },
      redis: {
        status: redisStatus.connected ? 'connected' : 'disconnected (bypassed)',
        host: redisStatus.host,
        port: redisStatus.port,
      },
    };
  }
}
