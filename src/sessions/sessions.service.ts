import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

import {
  TCacheData,
  TSessionData,
} from '@/sessions/interfaces/session.interfaces';

const expiresIn = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class SessionsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async create(data: TCacheData) {
    const { refreshToken, user } = data;
    const value = { userId: user.id, userName: user.userName };
    const key = this.getSessionKey(user.id);
    await this.cacheManager.set(key, [refreshToken]);
    await this.cacheManager.set(refreshToken, value, expiresIn);
  }

  async findAllByUser(userId: number) {
    const key = this.getSessionKey(userId);
    return await this.cacheManager.get<string[]>(key);
  }

  async findByKey(key: string) {
    return await this.cacheManager.get<TSessionData>(key);
  }

  async updateSessions(sessions: string[], data: TCacheData) {
    const { refreshToken, user } = data;
    const sessionsKey = this.getSessionKey(user.id);
    await this.cacheManager.set(sessionsKey, [...sessions, refreshToken]);
    const value = { userId: user.id, userName: user.userName };
    await this.cacheManager.set(refreshToken, value, expiresIn);
  }

  async remove(key: string) {
    const session = await this.findByKey(key);
    if (!session) return;
    const sessions = await this.findAllByUser(session.userId);
    if (sessions && sessions?.length > 0) {
      const sessionsKey = this.getSessionKey(session.userId);
      const filterSessions = sessions.filter((session) => session !== key);
      if (filterSessions.length == 0) {
        await this.cacheManager.del(sessionsKey);
      } else {
        await this.cacheManager.set(sessionsKey, filterSessions);
      }
    }
    await this.cacheManager.del(key);
  }

  private getSessionKey(userId: number) {
    return `user_sessions: ${userId}`;
  }
}
