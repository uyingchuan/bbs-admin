import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-empty',
  standalone: true,
  imports: [],
  templateUrl: './table-empty.component.html'
})
export class TableEmptyComponent {
  @Input()
  label: string = '无数据';
}
