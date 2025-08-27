import { verify } from 'argon2';
import { WhereOptions } from 'sequelize/types';
import { InjectModel } from '@nestjs/sequelize';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptions, InferAttributes } from 'sequelize';

import { UserModel } from '@/users/models/user.model';
import {
  TUserDataCreation,
  TUserDataRemoving,
  TGetUserFilterOptions,
  TGetOneUserOptions,
} from '@/users/interfaces/user.service.interfaces';

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserModel) private userModel: typeof UserModel) {}
  async create(data: TUserDataCreation) {
    const user = await this.userModel.create<UserModel>(data);
    return user.toJSON();
  }

  async remove({ id, password }: TUserDataRemoving) {
    const user = await this.getOne({ id });
    const verifyPass = await verify(user.password, password);
    if (!verifyPass) throw new BadRequestException('Wrong password');
    await this.userModel.destroy({ where: { id } });
  }

  async getOne(options: TGetOneUserOptions) {
    const findOneOptions: FindOptions<InferAttributes<UserModel>> = {};
    findOneOptions.where = this.getFilter(options);
    const user = await this.userModel.findOne(findOneOptions);
    if (!user) throw new NotFoundException('User not found');
    return user.toJSON();
  }

  async checkUserNameExists(userName: string) {
    const user = await this.userModel.findOne({ where: { userName } });
    if (user) throw new BadRequestException('User name already exist');
    return;
  }

  getFilter(options: TGetUserFilterOptions): WhereOptions<UserModel> {
    const filter: WhereOptions<UserModel> = {};

    if (options.userName != null) filter.userName = options.userName;
    if (options.id != null) filter.id = options.id;

    return filter;
  }
}
