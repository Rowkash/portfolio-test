import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, WhereOptions } from 'sequelize';

import { Portfolio, PortfolioModel } from '@/portfolios/models/portfolio.model';
import {
  PortfolioImage,
  PortfolioImageModel,
} from '@/portfolios/models/portfolio-image.model';
import { plainToInstance } from 'class-transformer';
import { PaginationDbHelper } from '@/common/helper/pagination.helper';

export type TImageDataCreation = Pick<
  PortfolioImageModel,
  'name' | 'description' | 'fileName' | 'portfolioId'
>;

export type TGetPortfolioImageFilterOptions = Partial<
  Pick<PortfolioImageModel, 'id' | 'portfolioId'>
>;

export type TGetPortfolioImageIncludesOptions = {
  portfolio?: boolean;
};

@Injectable()
export class PortfolioImagesService {
  constructor(
    @InjectModel(PortfolioImageModel)
    private portfolioImageModel: typeof PortfolioImageModel,
  ) {}

  async create(data: TImageDataCreation) {
    const image =
      await this.portfolioImageModel.create<PortfolioImageModel>(data);
    return plainToInstance(PortfolioImage, image.get({ plain: true }), {
      excludeExtraneousValues: true,
    });
  }

  async findOne(filter: WhereOptions<PortfolioImageModel>) {
    const image = await this.portfolioImageModel.findOne({
      where: filter,
      include: PortfolioModel,
    });
    if (!image) return null;
    const imageData = image.get({ plain: true });
    const portfolio = new Portfolio(imageData.portfolio);
    return new PortfolioImage({
      ...imageData,
      portfolio,
    });
  }

  async findMany(
    pagination: PaginationDbHelper,
    includes?: Includeable,
    filter?: WhereOptions<PortfolioImageModel>,
  ) {
    const { rows, count } = await this.portfolioImageModel.findAndCountAll({
      where: filter,
      order: pagination.orderBy,
      limit: pagination.limit,
      offset: pagination.offset,
      include: includes,
    });

    const models = rows.map((row) => {
      const data = row.get({ plain: true });
      if (data.portfolio) {
        data.portfolio = new Portfolio(data.portfolio);
      }
      return plainToInstance(PortfolioImage, data, {
        excludeExtraneousValues: true,
      });
    });

    return { models, count };
  }

  async remove(filter: WhereOptions<PortfolioImageModel>) {
    await this.portfolioImageModel.destroy({ where: filter });
  }

  getFilter(
    options: TGetPortfolioImageFilterOptions,
  ): WhereOptions<PortfolioImageModel> {
    const filter: WhereOptions<PortfolioImageModel> = {};

    if (options.id != null) filter.id = options.id;
    if (options.portfolioId != null) filter.portfolioId = options.portfolioId;

    return filter;
  }

  getIncludes(options: TGetPortfolioImageIncludesOptions): Includeable {
    const includes: Includeable = {};

    if (options.portfolio !== null) {
      includes.model = PortfolioModel;
    }

    return includes;
  }
}
