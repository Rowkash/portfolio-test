import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from '@/users/models/user.model';
import { UsersService } from '@/users/users.service';
import { AuthLoginDto } from '@/auth/dto/auth-login.dto';
import { AuthRegisterDto } from '@/auth/dto/auth-register.dto';
import { SessionsService } from '@/sessions/sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private sessionsService: SessionsService,
  ) {}

  // ---------- Register ---------- //

  async register(dto: AuthRegisterDto) {
    const userFilter = this.userService.getFilter({ userName: dto.userName });
    const candidate = await this.userService.getOne(userFilter);
    if (candidate) throw new BadRequestException('User name already exist');

    const hashPass = await hash(dto.password);
    const user = await this.userService.create({ ...dto, password: hashPass });
    const { accessToken, refreshToken } = this.generateTokens(user);

    await this.sessionsService.create({ user, refreshToken });

    return { accessToken, refreshToken };
  }

  // ---------- Login ---------- //

  async login(dto: AuthLoginDto) {
    const user = await this.validateUser(dto);
    const { accessToken, refreshToken } = this.generateTokens(user);

    const sessions = await this.sessionsService.findAllByUser(user.id);

    if (sessions && sessions.length > 0) {
      await this.sessionsService.updateSessions(sessions, {
        refreshToken,
        user,
      });
    } else {
      await this.sessionsService.create({ user, refreshToken });
    }

    return { accessToken, refreshToken };
  }

  // ---------- Refresh Tokens ---------- //

  async refreshTokens(sessionId: string) {
    const session = await this.sessionsService.findByKey(sessionId);
    if (!session)
      throw new UnauthorizedException('Refresh token expired or its invalid');
    const userData = { id: session.userId, userName: session.userName };
    const { accessToken, refreshToken } = this.generateTokens(userData);
    const sessions = await this.sessionsService.findAllByUser(userData.id);
    if (sessions && sessions.length > 0)
      await this.sessionsService.updateSessions(sessions, {
        user: userData,
        refreshToken,
      });
    await this.sessionsService.remove(sessionId);

    return { accessToken, refreshToken };
  }

  // ---------- Logout ---------- //

  async logout(sessionId: string) {
    const session = await this.sessionsService.findByKey(sessionId);
    if (!session)
      throw new UnauthorizedException('Session not found or expired');
    await this.sessionsService.remove(sessionId);
  }

  // ---------- Generate Tokens ---------- //

  private generateTokens(user: Partial<User>) {
    const data = { id: user.id, userName: user.userName };
    const secret = this.configService.get<string>('auth.jwtSecret');
    const expiresIn = this.configService.get<string>('auth.jwtExpires');

    const accessToken = this.jwtService.sign(data, {
      secret,
      expiresIn,
    });
    const refreshToken = uuidv4();

    return { accessToken, refreshToken };
  }

  // ---------- Validate User ---------- //

  private async validateUser(dto: AuthLoginDto) {
    const filter = this.userService.getFilter({ userName: dto.userName });
    const user = await this.userService.getOne(filter);
    if (user) {
      const passEquals = await verify(user.password, dto.password);
      if (passEquals) return user;
    }

    throw new BadRequestException({ message: 'Wrong user name or password' });
  }
}
