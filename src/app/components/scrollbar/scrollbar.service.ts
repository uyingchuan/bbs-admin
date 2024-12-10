import { Injectable } from '@angular/core';

@Injectable()
export class ScrollbarService {
  scrollbarContextKey!: ScrollbarContext;

  constructor() {}
}

export interface ScrollbarContext {
  scrollbarElement: HTMLDivElement;
  wrapElement: HTMLDivElement;
}
