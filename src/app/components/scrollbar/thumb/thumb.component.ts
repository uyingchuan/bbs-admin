import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BAR_MAP, renderThumbStyle } from '../util';
import { ScrollbarService } from '../scrollbar.service';

@Component({
  selector: 'app-thumb',
  templateUrl: './thumb.component.html',
  styleUrls: ['./thumb.component.scss']
})
export class ThumbComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('instance') instance!: ElementRef;
  @ViewChild('thumb') thumb!: ElementRef;

  @Input() move!: number;
  @Input() ratio!: number;
  @Input() size!: string;
  @Input() always!: boolean;
  @Input() vertical: boolean = false;

  visible = false;

  cursorDown = false;
  cursorLeave = false;

  bar!: (typeof BAR_MAP)[keyof typeof BAR_MAP];

  thumbState: Partial<Record<'X' | 'Y', number>> = {};

  originalOnSelectStart: ((this: GlobalEventHandlers, ev: Event) => unknown) | null =
    typeof window !== 'undefined' ? document.onselectstart : null;

  constructor(private scrollbarService: ScrollbarService) {}

  ngOnInit(): void {
    this.bar = BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollbarService.scrollbarContextKey.scrollbarElement.addEventListener(
        'mousemove',
        this.mouseMoveScrollbarHandler
      );
      this.scrollbarService.scrollbarContextKey.scrollbarElement.addEventListener(
        'mouseleave',
        this.mouseLeaveScrollbarHandler
      );
    }, 0);
  }

  ngOnDestroy(): void {
    this.scrollbarService.scrollbarContextKey.scrollbarElement.removeEventListener(
      'mousemove',
      this.mouseMoveScrollbarHandler
    );
    this.scrollbarService.scrollbarContextKey.scrollbarElement.removeEventListener(
      'mouseleave',
      this.mouseLeaveScrollbarHandler
    );
    this.restoreOnselectstart();
  }

  thumbStyle() {
    return renderThumbStyle({
      size: this.size,
      move: this.move,
      bar: this.bar
    });
  }

  clickTrackHandler(e: MouseEvent) {
    if (!this.thumb || !this.instance || !this.scrollbarService.scrollbarContextKey.wrapElement) return;

    const offset = Math.abs((e.target as HTMLElement).getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
    const thumbHalf = this.thumb.nativeElement[this.bar.offset] / 2;
    const thumbPositionPercentage =
      ((offset - thumbHalf) * 100 * this.offsetRatio()) / this.instance.nativeElement[this.bar.offset];

    this.scrollbarService.scrollbarContextKey.wrapElement[this.bar.scroll] =
      (thumbPositionPercentage * this.scrollbarService.scrollbarContextKey.wrapElement[this.bar.scrollSize]) / 100;
  }

  // 点击滚动条触发事件
  clickThumbHandler(e: MouseEvent) {
    // prevent click event of middle and right button
    e.stopPropagation();
    if (e.ctrlKey || [1, 2].includes(e.button)) return;

    window.getSelection()?.removeAllRanges();
    this.startDrag(e);

    const el = e.currentTarget as HTMLDivElement;
    if (!el) return;
    this.thumbState[this.bar.axis] =
      el[this.bar.offset] - (e[this.bar.client] - el.getBoundingClientRect()[this.bar.direction]);
  }

  startDrag(e: MouseEvent) {
    e.stopImmediatePropagation();
    this.cursorDown = true;
    document.addEventListener('mousemove', this.mouseMoveDocumentHandler);
    document.addEventListener('mouseup', this.mouseUpDocumentHandler);
    this.originalOnSelectStart = document.onselectstart;
    document.onselectstart = () => false;
  }

  mouseUpDocumentHandler = () => {
    this.cursorDown = false;
    this.thumbState[this.bar.axis] = 0;
    document.removeEventListener('mousemove', this.mouseMoveDocumentHandler);
    document.removeEventListener('mouseup', this.mouseUpDocumentHandler);
    this.restoreOnselectstart();
    if (this.cursorLeave) this.visible = false;
  };

  offsetRatio() {
    return (
      this.instance!.nativeElement[this.bar.offset] ** 2 /
      this.scrollbarService.scrollbarContextKey.wrapElement[this.bar.scrollSize] /
      this.ratio /
      this.thumb!.nativeElement[this.bar.offset]
    );
  }

  mouseMoveDocumentHandler = (e: MouseEvent) => {
    if (!this.instance || !this.thumb) return;
    if (!this.cursorDown) return;

    const prevPage = this.thumbState[this.bar.axis];
    if (!prevPage) return;

    const offset = -1 * (this.instance.nativeElement.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
    const thumbClickPosition = this.thumb.nativeElement[this.bar.offset] - prevPage;
    const thumbPositionPercentage =
      ((offset - thumbClickPosition) * 100 * this.offsetRatio()) / this.instance.nativeElement[this.bar.offset];
    this.scrollbarService.scrollbarContextKey.wrapElement[this.bar.scroll] =
      (thumbPositionPercentage * this.scrollbarService.scrollbarContextKey.wrapElement[this.bar.scrollSize]) / 100;
  };

  mouseMoveScrollbarHandler = () => {
    this.cursorLeave = false;
    this.visible = !!this.size;
  };

  mouseLeaveScrollbarHandler = () => {
    this.cursorLeave = true;
    this.visible = this.cursorDown;
  };

  restoreOnselectstart = () => {
    if (document.onselectstart !== this.originalOnSelectStart) document.onselectstart = this.originalOnSelectStart;
  };
}
