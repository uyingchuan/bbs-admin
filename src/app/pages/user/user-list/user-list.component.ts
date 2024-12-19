import { Component } from '@angular/core';
import { HttpService } from '@services/http.service';
import { environment } from '@environment';
import { TableData } from '@utils/table.util';
import { Pagination, TableColumn } from '@interfaces/paginator';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { NgForOf, NgIf } from '@angular/common';
import { TableEmptyComponent } from '@components/table-empty/table-empty.component';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { Button } from 'primeng/button';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [TableModule, NgForOf, NgIf, TableEmptyComponent, Paginator, Button, Avatar],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  tableData = new TableData<UserInfo>();
  tableCols: TableColumn<UserInfo>[] = [];

  constructor(private http: HttpService) {
    this.initTableCols();
  }

  initTableCols() {
    this.tableCols = [
      {
        field: 'email',
        header: '用户邮箱',
        type: 'text',
      },
      {
        field: 'username',
        header: '用户名',
        type: 'text',
      },
      {
        field: 'nickName',
        header: '用户昵称',
        type: 'text',
      },
      {
        field: 'descriptor',
        header: '用户简介',
        type: 'text',
      },
      {
        field: 'fansCount',

        header: '粉丝数',
        type: 'text',
      },
    ];
  }

  getUserList() {
    this.tableData.loading = true;
    this.http.doPost<Pagination<UserInfo>>(
      environment.server.bbsServer + environment.urls.user.list,
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
    this.getUserList();
  }

  onPageChange(event: PaginatorState) {
    this.tableData.setPageable(event);
    this.getUserList();
  }
}

interface UserInfo {
  uid: number;
  email: string;
  username: string;
  avatar: string;
  nickName: string;
  descriptor: string;
  fansCount: number;
  followCount: number;
}
