import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { ScrollbarService } from '../scrollbar.service';
import { BarComponent } from '../bar/bar.component';
import { addUnit, GAP } from '../util';

@Component({
  selector: 'app-scrollbar',
  templateUrl: './scrollbar.component.html',
  styleUrls: ['./scrollbar.component.scss'],
  providers: [ScrollbarService]
})
export class ScrollbarComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('scrollbar', { static: false }) scrollbar!: ElementRef;
  @ViewChild('view', { static: false }) view!: ElementRef;
  @ViewChild('wrap', { static: false }) wrap!: ElementRef;
  @ViewChild('bar', { static: false }) bar!: BarComponent;

  // 滚动条高度
  @Input() height?: number | string;
  // 滚动条最大高度
  @Input() maxHeight?: number | string;
  // 包裹容器的自定义样式
  @Input() wrapClass: string | undefined;
  // 滚动条是否总是显示
  @Input() always: boolean = false;
  // 滚动条最小尺寸
  @Input() minSize: number = 20;
  // 不响应容器尺寸变化，如果容器尺寸不会发生变化，最好设置它可以优化性能
  @Input() noresize: boolean = false;
  // 滚动视图样式
  @Input() scrollbarViewClass: string = '';

  sizeWidth = '0';
  sizeHeight = '0';
  ratioX = 1;
  ratioY = 1;

  wrapSizeObserve?: ResizeObserver;
  viewSizeObserve?: ResizeObserver;

  constructor(
    private scrollbarService: ScrollbarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.update();
    }, 0);

    this.scrollbarService.scrollbarContextKey = {
      scrollbarElement: this.scrollbar.nativeElement,
      wrapElement: this.wrap.nativeElement
    };
    // 监听wrap尺寸变化
    if (!this.noresize) {
      this.wrapSizeObserve = new ResizeObserver(e => {
        this.update();
      });
      this.wrapSizeObserve?.observe(this.wrap.nativeElement);
    }
    // 监听子元素高度变化，重绘滚动条
    this.viewSizeObserve = new ResizeObserver(e => this.update());
    this.viewSizeObserve?.observe(this.view.nativeElement);
  }

  ngOnChanges(): void {
    this.update();
  }

  ngOnDestroy() {
    this.viewSizeObserve?.disconnect();
    this.wrapSizeObserve?.disconnect();
  }

  wrapStyle() {
    const style: Partial<CSSStyleDeclaration> = {};
    if (this.height) style.height = addUnit(this.height);
    if (this.maxHeight) style.maxHeight = addUnit(this.maxHeight);
    return style;
  }

  handleScroll() {
    if (this.wrap) {
      this.bar.handleScroll(this.wrap.nativeElement);
    }
  }

  update() {
    if (!this.wrap) return;
    const offsetHeight = this.wrap.nativeElement.offsetHeight - GAP;
    const offsetWidth = this.wrap.nativeElement.offsetWidth - GAP;

    const originalHeight = offsetHeight ** 2 / this.wrap.nativeElement.scrollHeight;
    const originalWidth = offsetWidth ** 2 / this.wrap.nativeElement.scrollWidth;
    const height = Math.max(originalHeight, this.minSize);
    const width = Math.max(originalWidth, this.minSize);

    this.ratioY = originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height));
    this.ratioX = originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width));

    this.sizeHeight = height + GAP < offsetHeight ? `${height}px` : '';
    this.sizeWidth = width + GAP < offsetWidth ? `${width}px` : '';
    this.cdr.detectChanges();
  }
}
