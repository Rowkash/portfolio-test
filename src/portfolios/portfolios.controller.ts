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
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthGuard } from '@/auth/guards/auth.guard';
import {
  ICustomRequest,
  IRequestUser,
} from '@/common/interfaces/custom-request.interface';
import { PortfoliosService } from '@/portfolios/portfolios.service';
import { CreatePortfolioDto } from '@/portfolios/dto/create-portfolio.dto';
import { PortfolioPageDto } from '@/portfolios/dto/portfolio-page.dto';
import { PaginationDbHelper } from '@/common/helper/pagination.helper';
import { PortfolioModelDto } from '@/portfolios/models/portfolio.model';

@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @ApiOperation({ summary: 'Create portfolio' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns portfolio',
  })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @Post()
  create(@Req() { user }: ICustomRequest, @Body() dto: CreatePortfolioDto) {
    const { id } = user as IRequestUser;
    return this.portfoliosService.create(id, dto);
  }

  @ApiOperation({ summary: 'Get portfolios page' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return portfolios page',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  getPage(@Query() query: PortfolioPageDto) {
    const pagination = new PaginationDbHelper(query);
    return this.portfoliosService.getPage(pagination);
  }

  @ApiOperation({ summary: 'Get portfolio by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return portfolio by id',
    type: PortfolioModelDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') portfolioId: string) {
    const filter = this.portfoliosService.getFilter({ id: +portfolioId });
    return this.portfoliosService.findOne(filter);
  }

  @ApiOperation({ summary: 'Delete portfolio' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Req() { user }: ICustomRequest, @Param('id') portfolioId: string) {
    const { id: userId } = user as IRequestUser;
    const filter = this.portfoliosService.getFilter({
      id: +portfolioId,
      userId,
    });
    return this.portfoliosService.remove(filter);
  }
}
