import { OrderSortEnum, PageDto } from '@/common/dto/page.dto';
import { Order } from 'sequelize';

export class PaginationDbHelper {
  readonly page: number;
  readonly itemsPerPage: number;
  readonly sortBy: string;
  readonly orderSort: string;

  constructor({
    page = 1,
    itemsPerPage = 10,
    sortBy = 'createdAt',
    orderSort = OrderSortEnum.ASC,
  }: Partial<PageDto>) {
    this.page = page;
    this.itemsPerPage = itemsPerPage;
    this.orderSort = orderSort;
    this.sortBy = sortBy;
  }

  get offset(): number {
    return (this.page - 1) * this.itemsPerPage;
  }

  get limit(): number {
    return this.itemsPerPage;
  }

  get orderBy(): Order {
    const allowedFields = ['createdAt', 'userId'];
    const sortField = allowedFields.includes(this.sortBy)
      ? this.sortBy
      : 'createdAt';
    return [[sortField, this.orderSort]];
  }
}
