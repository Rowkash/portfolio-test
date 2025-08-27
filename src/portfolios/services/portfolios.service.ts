import {
  FindOptions,
  Includeable,
  InferAttributes,
  WhereOptions,
} from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PortfolioModel } from '@/portfolios/models/portfolio.model';
import { PaginationDbHelper } from '@/common/helper/pagination.helper';
import { PortfolioImageModel } from '@/portfolios/models/portfolio-image.model';
import { PortfolioPageDto } from '@/portfolios/dto/portfolio-page.dto';
import {
  IGetOnePortfolioOptions,
  IPortfolioDataCreation,
  IPortfolioDataUpdate,
  TGetPortfolioFilterOptions,
  TGetPortfolioIncludesOptions,
} from '@/portfolios/interfaces/portfolio.service.interfaces';
import { MinioService } from '@/minio/minio.service';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectModel(PortfolioModel) private portfolioModel: typeof PortfolioModel,
    private readonly storage: MinioService,
  ) {}

  async create(data: IPortfolioDataCreation) {
    const portfolio = await this.portfolioModel.create<PortfolioModel>(data);
    return portfolio.toJSON();
  }

  async update(data: IPortfolioDataUpdate) {
    const { userId, portfolioId, ...updateData } = data;
    await this.findOne({ id: portfolioId, userId });
    await this.portfolioModel.update(updateData, {
      where: { id: portfolioId },
    });
  }

  async getPage(options: PortfolioPageDto) {
    const pagination = new PaginationDbHelper(options);
    const includes = this.getIncludes({ images: true });
    const { rows, count } = await this.portfolioModel.findAndCountAll({
      order: pagination.orderBy,
      limit: pagination.limit,
      offset: pagination.offset,
      include: includes,
      distinct: true,
    });

    const models = rows.map((row) => row.get({ plain: true }));

    return { models, count };
  }

  async findOne(options: IGetOnePortfolioOptions) {
    const findOneOptions: FindOptions<InferAttributes<PortfolioModel>> = {};
    findOneOptions.where = this.getFilter(options);
    if (options.includes) {
      findOneOptions.include = this.getIncludes(options.includes);
    }
    const portfolio = await this.portfolioModel.findOne(findOneOptions);
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    return portfolio.get({ plain: true });
  }

  async remove(id: number, userId: number) {
    const portfolio = await this.findOne({
      id,
      userId,
      includes: { images: true },
    });

    if (portfolio.images && portfolio.images.length > 0) {
      for (const image of portfolio.images) {
        await this.storage.deleteFile(image.fileName);
      }
    }

    await this.portfolioModel.destroy({ where: { id } });
  }

  getFilter(options: TGetPortfolioFilterOptions): WhereOptions<PortfolioModel> {
    const filter: WhereOptions<PortfolioModel> = {};

    if (options.id != null) filter.id = options.id;
    if (options.userId != null) filter.userId = options.userId;

    return filter;
  }

  getIncludes(options: TGetPortfolioIncludesOptions | undefined): Includeable {
    const includes: Includeable = {};

    if (options?.images !== null) {
      includes.model = PortfolioImageModel;
    }

    return includes;
  }
}
