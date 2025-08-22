import { CreatePortfolioDto } from '@/portfolios/dto/create-portfolio.dto';
import { PortfolioModel } from '@/portfolios/models/portfolio.model';
import { UpdatePortfolioDto } from '@/portfolios/dto/update-portfolio.dto';

export interface IPortfolioDataCreation extends CreatePortfolioDto {
  userId: PortfolioModel['userId'];
}

export interface IPortfolioDataUpdate extends UpdatePortfolioDto {
  portfolioId: PortfolioModel['id'];
  userId: PortfolioModel['userId'];
}

export type TGetPortfolioFilterOptions = Partial<
  Pick<PortfolioModel, 'id' | 'userId'>
>;

export type TGetPortfolioIncludesOptions = {
  images?: boolean;
};

export interface IGetOnePortfolioOptions extends Partial<PortfolioModel> {
  includes?: TGetPortfolioIncludesOptions;
}
