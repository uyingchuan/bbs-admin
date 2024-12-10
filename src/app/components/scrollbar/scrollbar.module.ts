import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollbarComponent } from './scrollbar/scrollbar.component';
import { BarComponent } from './bar/bar.component';
import { ThumbComponent } from './thumb/thumb.component';

@NgModule({
  declarations: [ScrollbarComponent, BarComponent, ThumbComponent],
  exports: [ScrollbarComponent],
  imports: [CommonModule]
})
export class ScrollbarModule {}
