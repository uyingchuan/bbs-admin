import { FilterMetadata } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { PaginatorState } from 'primeng/paginator';
import { Pagination } from '@interfaces/paginator';
import _ from 'lodash';

export class TableData<T> {
  public loading: boolean = true;
  public pageSize: number = 10;
  public pageNum: number = 0;
  public total: number = 0;
  public list: T[] = [];
  public sortField?: string | string[] | null | undefined;
  public sortOrder?: number | undefined | null;
  public filters?: {
    [s: string]: FilterMetadata | FilterMetadata[] | undefined;
  };

  constructor(pageSize = 10, pageNum = 1) {
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.total = 0;
    this.list = [];
  }

  getParams(): object {
    return {
      pageSize: this.pageSize,
      pageNum: this.pageNum,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      filters: this.filters,
      tet: 0,
    };
  }

  setParams(event: TableLazyLoadEvent) {
    this.sortOrder = event.sortOrder;
    this.sortField = event.sortField;
    this.filters = _.cloneDeep(event.filters);
    this.pageNum = 1;
  }

  setPageable(event: PaginatorState) {
    this.pageNum = event.page ? event.page + 1 : 1;
    this.pageSize = event.rows ?? 10;
  }

  setData(data: Pagination<T>) {
    this.list = data.list;
    this.total = data.total;
  }

  getOffset(): number {
    return (this.pageNum - 1) * this.pageSize;
  }
}
