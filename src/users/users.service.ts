import { verify } from 'argon2';
import { WhereOptions } from 'sequelize/types';
import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException, Injectable } from '@nestjs/common';

import { User, UserDto } from '@/users/models/user.model';

export type IGetUserFilterOptions = Partial<Pick<UserDto, 'id' | 'userName'>>;
export type IUserDataCreation = Pick<UserDto, 'userName' | 'password'>;
export type IUserDataDeleting = Pick<UserDto, 'id' | 'password'>;

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}
  async create(data: IUserDataCreation) {
    const user = await this.userModel.create<User>(data);
    return new UserDto(user.toJSON());
  }

  async remove({ id, password }: IUserDataDeleting) {
    const filter = this.getFilter({ id });
    const user = await this.getOne(filter);
    if (!user) return;
    const verifyPass = await verify(user.password, password);
    if (!verifyPass) throw new BadRequestException('Wrong password');
    return await this.userModel.destroy({ where: { id } });
  }

  async getOne(filter: WhereOptions<User>) {
    const user = await this.userModel.findOne({ where: filter });
    if (!user) return null;
    return new UserDto(user.toJSON());
  }

  getFilter(options: IGetUserFilterOptions): WhereOptions<User> {
    const filter: WhereOptions<User> = {};

    if (options.userName != null) filter.userName = options.userName;
    if (options.id != null) filter.id = options.id;

    return filter;
  }
}
