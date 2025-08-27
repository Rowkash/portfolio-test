import { PortfolioImageModel } from '@/portfolios/models/portfolio-image.model';

export interface TImageDataCreation
  extends Pick<PortfolioImageModel, 'name' | 'description' | 'portfolioId'> {
  userId: number;
}

export type TGetPortfolioImageFilterOptions = Partial<
  Pick<PortfolioImageModel, 'id' | 'portfolioId'>
>;

export type TGetPortfolioImageIncludesOptions = {
  portfolio?: boolean;
};

export interface IGetOnePortfolioImageOptions
  extends Partial<PortfolioImageModel> {
  include?: TGetPortfolioImageIncludesOptions;
}

export interface IPortfolioDataRemoving {
  imageId: number;
  userId: number;
  portfolioId: number;
}
