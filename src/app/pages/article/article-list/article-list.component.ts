import { Component } from '@angular/core';
import { TableData } from '@utils/table.util';
import { Pagination, TableColumn } from '@interfaces/paginator';
import { HttpService } from '@services/http.service';
import { environment } from '@environment';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { Button } from 'primeng/button';
import { NgForOf, NgIf } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { TableEmptyComponent } from '@components/table-empty/table-empty.component';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [Button, NgForOf, NgIf, Paginator, PrimeTemplate, TableEmptyComponent, TableModule],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
})
export class ArticleListComponent {
  tableData = new TableData<ArticleInfo>();
  tableCols: TableColumn<ArticleInfo>[] = [];

  constructor(private http: HttpService) {
    this.initTableCols();
  }

  initTableCols() {
    this.tableCols = [
      {
        field: 'title',
        header: '文章标题',
        type: 'text',
      },
      {
        field: 'categoryId',
        header: '文章分类',
        type: 'text',
      },
      {
        field: 'summary',
        header: '文章简介',
        type: 'text',
      },
    ];
  }

  getTableData() {
    this.tableData.loading = true;
    this.http.doPost<Pagination<ArticleInfo>>(
      environment.server.bbsServer + environment.urls.article.list,
      this.tableData.getParams(),
      (res) => {
        this.tableData.setData(res);
        this.tableData.loading = false;
      },
      () => {
        this.tableData.loading = false;
      },
    );
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.tableData.setParams(event);
    this.getTableData();
  }

  onPageChange(event: PaginatorState) {
    this.tableData.setPageable(event);
    this.getTableData();
  }
}

interface ArticleInfo {
  userId: string;
  id: string;
  categoryId: string;
  title: string;
  summary: string;
}
