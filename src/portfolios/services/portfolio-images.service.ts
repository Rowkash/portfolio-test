import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { plainToInstance } from 'class-transformer';
import { Includeable, WhereOptions } from 'sequelize';

import { PortfolioImageModel } from '@/portfolios/models/portfolio-image.model';
import { FilesService } from '@/files/files.service';
import { PaginationDbHelper } from '@/common/helper/pagination.helper';
import { PortfolioModel } from '@/portfolios/models/portfolio.model';
import { PortfoliosService } from '@/portfolios/services/portfolios.service';
import { PortfolioImagesPageDto } from '@/portfolios/dto/portfolio-images-page.dto';
import {
  TGetPortfolioImageFilterOptions,
  TGetPortfolioImageIncludesOptions,
  TImageDataCreation,
} from '@/portfolios/interfaces/portfolio-images.service.interfaces';

@Injectable()
export class PortfolioImagesService {
  constructor(
    @InjectModel(PortfolioImageModel)
    private portfolioImageModel: typeof PortfolioImageModel,
    private readonly portfoliosService: PortfoliosService,
    private readonly filesService: FilesService,
  ) {}

  async create(data: TImageDataCreation, file: Express.Multer.File) {
    await this.portfoliosService.findOne({
      id: data.portfolioId,
      userId: data.userId,
    });
    const fileName = await this.filesService.saveFile(file);
    const image = await this.portfolioImageModel.create<PortfolioImageModel>({
      ...data,
      fileName,
    });
    return plainToInstance(PortfolioImageModel, image.get({ plain: true }), {
      excludeExtraneousValues: true,
    });
  }

  async findOne(filter: WhereOptions<PortfolioImageModel>) {
    const image = await this.portfolioImageModel.findOne({
      where: filter,
      include: PortfolioModel,
    });
    if (!image) throw new NotFoundException('Image not found');
    const imageData = image.get({ plain: true });

    return plainToInstance(PortfolioImageModel, imageData, {
      excludeExtraneousValues: true,
    });
  }

  async findMany(options: PortfolioImagesPageDto) {
    const pagination = new PaginationDbHelper(options);
    const include = this.getIncludes({ portfolio: true });
    const { rows, count } = await this.portfolioImageModel.findAndCountAll({
      order: pagination.orderBy,
      limit: pagination.limit,
      offset: pagination.offset,
      include,
      distinct: true,
    });

    const models = rows.map((row) => {
      const data = row.get({ plain: true });
      return plainToInstance(PortfolioImageModel, data, {
        excludeExtraneousValues: true,
      });
    });

    return { models, count };
  }

  async remove(imageId: number, portfolioId: number, userId: number) {
    const imageFilter = this.getFilter({
      id: imageId,
      portfolioId,
    });
    const image = await this.findOne(imageFilter);
    if (image.portfolio.userId !== userId)
      throw new ForbiddenException('Permissions error');
    await Promise.all([
      this.filesService.deleteFile(image.fileName),
      this.portfolioImageModel.destroy({ where: imageFilter }),
    ]);
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
