import { WhereOptions } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';

import {
  Portfolio,
  PortfolioModelDto,
} from '@/portfolios/models/portfolio.model';
import { CreatePortfolioDto } from '@/portfolios/dto/create-portfolio.dto';
import { PaginationDbHelper } from '@/common/helper/pagination.helper';

export type TGetPortfolioFilterOptions = Partial<
  Pick<PortfolioModelDto, 'id' | 'userId'>
>;

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectModel(Portfolio) private portfolioModel: typeof Portfolio,
  ) {}

  async create(userId: number, data: CreatePortfolioDto) {
    const portfolio = await this.portfolioModel.create<Portfolio>({
      ...data,
      userId,
    });
    return new PortfolioModelDto(portfolio.toJSON());
  }

  async getPage(
    pagination: PaginationDbHelper,
    filter?: WhereOptions<Portfolio>,
  ) {
    const { rows, count } = await this.portfolioModel.findAndCountAll({
      where: filter,
      order: pagination.orderBy,
      limit: pagination.limit,
      offset: pagination.offset,
    });

    const models = rows.map((row) => new PortfolioModelDto(row.toJSON()));

    return { models, count };
  }

  async findOne(filter: WhereOptions<Portfolio>) {
    const portfolio = await this.portfolioModel.findOne({ where: filter });
    if (!portfolio) return null;
    return new PortfolioModelDto(portfolio.toJSON());
  }

  async remove(filter: WhereOptions<Portfolio>) {
    await this.portfolioModel.destroy({ where: filter });
  }

  getFilter(options: TGetPortfolioFilterOptions): WhereOptions<Portfolio> {
    const filter: WhereOptions<Portfolio> = {};

    if (options.id != null) filter.id = options.id;

    return filter;
  }
}
