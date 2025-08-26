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
  ParseIntPipe,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';

import { AuthGuard } from '@/auth/guards/auth.guard';
import {
  ICustomRequest,
  IRequestUser,
} from '@/common/interfaces/custom-request.interface';
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
    private readonly portfolioImagesService: PortfolioImagesService,
  ) {}

  @ApiOperation({ summary: 'Add image to portfolio' })
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

    const image = await this.portfolioImagesService.create(
      {
        ...dto,
        portfolioId,
        userId,
      },
      file,
    );

    return instanceToPlain(image, { excludeExtraneousValues: true });
  }

  @ApiOperation({ summary: 'Delete portfolio image' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Delete(':portfolioId/images/:imageId')
  async deleteImage(
    @Req() { user }: ICustomRequest,
    @Param('portfolioId', ParseIntPipe) portfolioId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    const { id: userId } = user as IRequestUser;
    await this.portfolioImagesService.remove(imageId, portfolioId, userId);
  }
}
