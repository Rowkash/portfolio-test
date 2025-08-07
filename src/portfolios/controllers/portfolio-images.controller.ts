import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFile,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@/auth/guards/auth.guard';
import { FilesService } from '@/files/files.service';
import {
  ICustomRequest,
  IRequestUser,
} from '@/common/interfaces/custom-request.interface';
import { PortfoliosService } from '@/portfolios/services/portfolios.service';
import { FileImageValidationPipe } from '@/common/pipes/file.validation.pipe';
import { CreatePortfolioImageDto } from '@/portfolios/dto/create-portfolio-image.dto';
import { PortfolioImagesService } from '@/portfolios/services/portfolio-images.service';

@ApiTags('Portfolio Images')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('portfolios')
export class PortfolioImagesController {
  constructor(
    private readonly portfoliosService: PortfoliosService,
    private readonly filesService: FilesService,
    private readonly portfolioImagesService: PortfolioImagesService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Portfolio image name' },
        description: {
          type: 'string',
          description: 'Portfolio image description',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post(':id/images')
  async uploadImage(
    @Req() { user }: ICustomRequest,
    @Param('id', ParseIntPipe) portfolioId: number,
    @UploadedFile(new FileImageValidationPipe()) file: Express.Multer.File,
    @Body() dto: CreatePortfolioImageDto,
  ) {
    const { id: userId } = user as IRequestUser;
    const portfolioFilter = this.portfoliosService.getFilter({
      id: portfolioId,
      userId,
    });
    const portfolio = await this.portfoliosService.findOne(portfolioFilter);
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    const fileName = await this.filesService.saveFile(file);
    return await this.portfolioImagesService.create({
      ...dto,
      portfolioId,
      fileName,
    });
  }

  @Delete(':portfolioId/images/:imageId')
  async deleteImage(
    @Req() { user }: ICustomRequest,
    @Param('portfolioId', ParseIntPipe) portfolioId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    const { id: userId } = user as IRequestUser;
    const imageFilter = this.portfolioImagesService.getFilter({
      id: imageId,
      portfolioId,
    });
    const image = await this.portfolioImagesService.findOne(imageFilter);
    if (!image) throw new NotFoundException('Portfolio not found');
    if (image.portfolio.userId !== userId)
      throw new ForbiddenException('Permissions error');
    await Promise.all([
      this.portfolioImagesService.remove(imageFilter),
      this.filesService.deleteFile(image.fileName),
    ]);
  }
}
