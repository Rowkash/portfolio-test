import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Req,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthGuard } from '@/auth/guards/auth.guard';
import {
  ICustomRequest,
  IRequestUser,
} from '@/common/interfaces/custom-request.interface';
import { PortfolioPageDto } from '@/portfolios/dto/portfolio-page.dto';
import { PortfolioModel } from '@/portfolios/models/portfolio.model';
import { CreatePortfolioDto } from '@/portfolios/dto/create-portfolio.dto';
import { PortfoliosService } from '@/portfolios/services/portfolios.service';
import { UpdatePortfolioDto } from '@/portfolios/dto/update-portfolio.dto';
import { instanceToPlain } from 'class-transformer';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @ApiOperation({ summary: 'Create portfolio' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns portfolio',
  })
  @Post()
  create(@Req() { user }: ICustomRequest, @Body() dto: CreatePortfolioDto) {
    const { id: userId } = user as IRequestUser;
    return this.portfoliosService.create({ ...dto, userId });
  }

  @ApiOperation({ summary: 'Update portfolio' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Patch(':id')
  update(
    @Req() { user }: ICustomRequest,
    @Param('id', ParseIntPipe) portfolioId: number,
    @Body() dto: UpdatePortfolioDto,
  ) {
    const { id: userId } = user as IRequestUser;
    return this.portfoliosService.update({ ...dto, portfolioId, userId });
  }

  @ApiOperation({ summary: 'Get portfolios page' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return portfolios page',
  })
  @Get()
  getPage(@Query() query: PortfolioPageDto) {
    return this.portfoliosService.getPage(query);
  }

  @ApiOperation({ summary: 'Get portfolio by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return portfolio by id',
    type: PortfolioModel,
  })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) portfolioId: number) {
    const portfolio = await this.portfoliosService.findOne({
      id: portfolioId,
      includes: { images: true },
    });
    return instanceToPlain(portfolio, { excludeExtraneousValues: true });
  }

  @ApiOperation({ summary: 'Delete portfolio' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Delete(':id')
  async remove(
    @Req() { user }: ICustomRequest,
    @Param('id', ParseIntPipe) portfolioId: number,
  ) {
    const { id: userId } = user as IRequestUser;

    await this.portfoliosService.remove(portfolioId, userId);
  }
}
