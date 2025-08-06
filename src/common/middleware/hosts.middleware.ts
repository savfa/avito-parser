import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HostsMiddleware implements NestMiddleware {
  private allowedHosts = new Set(['localhost', 'test-alpha.reestrdoma.ru']);
  use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host?.split(':')[0];

    if (!this.allowedHosts.has(host)) {
      throw new ForbiddenException('Access denied');
    }

    next();
  }
}
