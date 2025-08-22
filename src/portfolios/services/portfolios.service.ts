import { Includeable, WhereOptions } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable, NotFoundException } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';

import { PortfolioModel } from '@/portfolios/models/portfolio.model';
import { PaginationDbHelper } from '@/common/helper/pagination.helper';
import { PortfolioImageModel } from '@/portfolios/models/portfolio-image.model';
import { FilesService } from '@/files/files.service';
import { PortfolioPageDto } from '@/portfolios/dto/portfolio-page.dto';
import {
  IGetOnePortfolioOptions,
  IPortfolioDataCreation,
  IPortfolioDataUpdate,
  TGetPortfolioFilterOptions,
  TGetPortfolioIncludesOptions,
} from '@/portfolios/interfaces/portfolio.service.interfaces';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectModel(PortfolioModel) private portfolioModel: typeof PortfolioModel,
    private readonly filesService: FilesService,
  ) {}

  async create(data: IPortfolioDataCreation) {
    const portfolio = await this.portfolioModel.create<PortfolioModel>(data);
    return plainToInstance(PortfolioModel, portfolio.get({ plain: true }), {
      excludeExtraneousValues: true,
    });
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

    const plainModels = rows.map((row) =>
      plainToInstance(PortfolioModel, row.get({ plain: true }), {
        excludeExtraneousValues: true,
      }),
    );

    const models = instanceToPlain(plainModels, {
      excludeExtraneousValues: true,
    });

    return { models, count };
  }

  async findOne(options: IGetOnePortfolioOptions) {
    const filter = this.getFilter(options);
    const includes = this.getIncludes(options.includes);
    const portfolio = await this.portfolioModel.findOne({
      where: filter,
      include: includes,
    });
    if (!portfolio) throw new NotFoundException('Portfolio not found');

    return plainToInstance(PortfolioModel, portfolio.get({ plain: true }), {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number, userId: number) {
    const portfolio = await this.findOne({
      id,
      userId,
      includes: { images: true },
    });

    if (portfolio.images && portfolio.images.length > 0) {
      for (const image of portfolio.images) {
        await this.filesService.deleteFile(image.fileName);
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
