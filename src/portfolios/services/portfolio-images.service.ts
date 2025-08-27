import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { plainToInstance } from 'class-transformer';
import {
  FindOptions,
  Includeable,
  InferAttributes,
  WhereOptions,
} from 'sequelize';

import { PortfolioImageModel } from '@/portfolios/models/portfolio-image.model';
import { PaginationDbHelper } from '@/common/helper/pagination.helper';
import { PortfolioModel } from '@/portfolios/models/portfolio.model';
import { PortfoliosService } from '@/portfolios/services/portfolios.service';
import { PortfolioImagesPageDto } from '@/portfolios/dto/portfolio-images-page.dto';
import {
  IGetOnePortfolioImageOptions,
  IPortfolioDataRemoving,
  TGetPortfolioImageFilterOptions,
  TGetPortfolioImageIncludesOptions,
  TImageDataCreation,
} from '@/portfolios/interfaces/portfolio-images.service.interfaces';
import { MinioService } from '@/minio/minio.service';
import { IMinioConfig } from '@/configs/minio.config';

@Injectable()
export class PortfolioImagesService {
  constructor(
    @InjectModel(PortfolioImageModel)
    private portfolioImageModel: typeof PortfolioImageModel,
    private readonly portfoliosService: PortfoliosService,
    private readonly storage: MinioService,
    private readonly configService: ConfigService,
  ) {}

  async create(data: TImageDataCreation, file: Express.Multer.File) {
    await this.portfoliosService.findOne({
      id: data.portfolioId,
      userId: data.userId,
    });
    const fileName = await this.storage.uploadFile({ file });
    const url = this.getPath(fileName);
    const image = await this.portfolioImageModel.create<PortfolioImageModel>({
      ...data,
      fileName,
      url,
    });
    return image.toJSON();
  }

  async findOne(options: IGetOnePortfolioImageOptions) {
    const findOneOptions: FindOptions<InferAttributes<PortfolioImageModel>> =
      {};
    findOneOptions.where = this.getFilter(options);
    if (options.include) {
      findOneOptions.include = this.getIncludes(options.include);
    }
    const image = await this.portfolioImageModel.findOne(findOneOptions);
    if (!image) throw new NotFoundException('Image not found');
    return image.get({ plain: true });
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

  async remove(options: IPortfolioDataRemoving) {
    const { portfolioId, imageId } = options;
    const include = { portfolio: true };
    const image = await this.findOne({ id: imageId, portfolioId, include });

    if (image.portfolio.userId !== options.userId)
      throw new ForbiddenException('Permissions error');

    await Promise.all([
      this.storage.deleteFile(image.fileName),
      this.portfolioImageModel.destroy({ where: { id: imageId } }),
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

  private getPath(key: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const minioConfig: IMinioConfig = this.configService.get<IMinioConfig>(
      'minio',
      {
        infer: true,
      },
    );

    return `${minioConfig.endpoint}/${minioConfig.bucketName}/${key}`;
  }
}
