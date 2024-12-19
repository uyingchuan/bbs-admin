export interface Pagination<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  list: Array<T>;
}

export interface TableColumn<T> {
  /**
   * 与数据对应的键
   */
  field: keyof T;
  /**
   * 表格表头头
   */
  header: string;
  /**
   * 导出时支持修改表头
   */
  exportHeader?: string;
  /**
   * 数据类型
   */
  type: TableColumnTypes;
  /**
   * 内容是否特殊处理
   */
  contentType?: TableColumnContentType;
  /**
   * 禁用筛选功能
   */
  disableFilter?: boolean;
  /**
   * 禁用排序功能
   */
  disableSort?: boolean;
  /**
   * 禁用列resize功能
   */
  disableResize?: boolean;
  /**
   * 禁用列拖动调整顺序功能
   */
  disableRecord?: boolean;
  /**
   * 禁止导出列
   */
  disableExport?: boolean;
  /**
   * 导出时特殊处理
   */
  exportFunction?: (data: T) => unknown;
}

/**
 * 用来给需要做特殊处理的td做条件判断的
 */
export type TableColumnContentType = null | 'simple' | 'special';

/**
 * other: 用来做条件判断，需要特殊处理的统一用这个
 */
export type TableColumnTypes = 'numeric' | 'text' | 'boolean' | 'date' | 'other';
