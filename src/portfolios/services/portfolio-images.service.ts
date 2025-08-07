import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhereOptions } from 'sequelize';

import {
  Portfolio,
  PortfolioModelDto,
} from '@/portfolios/models/portfolio.model';
import {
  PortfolioImage,
  PortfolioImageModel,
} from '@/portfolios/models/portfolio-image.model';
import { plainToInstance } from 'class-transformer';

export type TImageDataCreation = Pick<
  PortfolioImageModel,
  'name' | 'description' | 'fileName' | 'portfolioId'
>;

export type TGetPortfolioImageFilterOptions = Partial<
  Pick<PortfolioImageModel, 'id' | 'portfolioId'>
>;

@Injectable()
export class PortfolioImagesService {
  constructor(
    @InjectModel(PortfolioImageModel)
    private portfolioImageModel: typeof PortfolioImageModel,
  ) {}

  async create(data: TImageDataCreation) {
    const image =
      await this.portfolioImageModel.create<PortfolioImageModel>(data);
    return plainToInstance(PortfolioImage, image.get({ plain: true }));
  }

  async findOne(filter: WhereOptions<PortfolioImageModel>) {
    const image = await this.portfolioImageModel.findOne({
      where: filter,
      include: Portfolio,
    });
    if (!image) return null;
    const imageData = image.get({ plain: true });
    const portfolio = new PortfolioModelDto(imageData.portfolio);
    return new PortfolioImage({
      ...imageData,
      portfolio,
    });
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
}
