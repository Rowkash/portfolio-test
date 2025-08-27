import { UserModel } from '@/users/models/user.model';

export type TCacheData = {
  user: Pick<UserModel, 'id' | 'userName'>;
  refreshToken: string;
};

export type TSessionData = {
  userId: number;
  userName: string;
};
