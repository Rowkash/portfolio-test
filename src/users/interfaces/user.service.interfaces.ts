import { UserModel } from '@/users/models/user.model';
import { Attributes } from 'sequelize';

export type TGetUserFilterOptions = Partial<Attributes<UserModel>>;
export type TUserDataCreation = Pick<UserModel, 'userName' | 'password'>;
export type TUserDataRemoving = Pick<UserModel, 'id' | 'password'>;
export type TGetOneUserOptions = Partial<Attributes<UserModel>>;
