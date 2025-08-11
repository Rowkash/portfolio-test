import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

import { User } from '@/users/models/user.model';

const expiresIn = 30 * 24 * 60 * 60 * 1000;
type TCacheData = {
  user: Pick<User, 'id' | 'userName'>;
  refreshToken: string;
};

type TSessionData = {
  userId: number;
  userName: string;
};

@Injectable()
export class SessionsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  //   // ---------- Create ---------- //

  async create(data: TCacheData) {
    const { refreshToken, user } = data;
    const value = { userId: user.id, userName: user.userName };
    const key = this.getKey(user.id);
    await this.cacheManager.set(key, [refreshToken]);
    await this.cacheManager.set(refreshToken, value, expiresIn);
  }

  //   // ---------- Find all by User ---------- //

  async findAllByUser(userId: number) {
    const key = this.getKey(userId);
    return await this.cacheManager.get<string[]>(key);
  }

  //   // ---------- Find One by key ---------- //

  async findByKey(key: string) {
    return await this.cacheManager.get<TSessionData>(key);
  }

  //   // ---------- Update Sessions ---------- //

  async updateSessions(sessions: string[], data: TCacheData) {
    const { refreshToken, user } = data;
    const sessionsKey = this.getKey(user.id);
    await this.cacheManager.set(sessionsKey, [...sessions, refreshToken]);
    const value = { userId: user.id, userName: user.userName };
    await this.cacheManager.set(refreshToken, value, expiresIn);
  }

  async remove(key: string) {
    const session = await this.findByKey(key);
    if (!session) return;
    const sessions = await this.findAllByUser(session.userId);
    if (sessions && sessions?.length > 0) {
      const sessionsKey = this.getKey(session.userId);
      const filterSessions = sessions.filter((session) => session !== key);
      if (filterSessions.length == 0) {
        await this.cacheManager.del(sessionsKey);
      } else {
        await this.cacheManager.set(sessionsKey, filterSessions);
      }
    }
    await this.cacheManager.del(key);
  }

  private getKey(userId: number) {
    return `user_sessions: ${userId}`;
  }
}
