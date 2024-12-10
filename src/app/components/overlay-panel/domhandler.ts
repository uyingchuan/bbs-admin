import { Alignment } from '@components/overlay-panel/overlaypanel';
import { SafeAny } from '@interfaces/global';

export class DomHandler {
  public static getWindowScrollTop(): number {
    const doc = document.documentElement;
    return (window.scrollY || doc.scrollTop) - (doc.clientTop || 0);
  }

  public static getWindowScrollLeft(): number {
    const doc = document.documentElement;
    return (window.scrollX || doc.scrollLeft) - (doc.clientLeft || 0);
  }

  public static getViewport(): SafeAny {
    const win = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      w = win.innerWidth || e.clientWidth || g.clientWidth,
      h = win.innerHeight || e.clientHeight || g.clientHeight;

    return { width: w, height: h };
  }

  public static isIOS() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window['MSStream'];
  }

  public static findSingle(element: SafeAny, selector: string): SafeAny {
    return this.isElement(element) ? element.querySelector(selector) : null;
  }

  public static appendChild(element: SafeAny, target: SafeAny) {
    if (this.isElement(target)) target.appendChild(element);
    else if (target && target.el && target.el.nativeElement) target.el.nativeElement.appendChild(element);
    else throw 'Cannot append ' + target + ' to ' + element;
  }

  public static isElement(obj: SafeAny) {
    return typeof HTMLElement === 'object'
      ? obj instanceof HTMLElement
      : obj && typeof obj === 'object' && true && obj.nodeType === 1 && typeof obj.nodeName === 'string';
  }

  public static isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  public static getOffset(el: SafeAny) {
    const rect = el.getBoundingClientRect();

    return {
      top: rect.top + (window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0),
      left: rect.left + (window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0),
    };
  }

  public static addClass(element: SafeAny, className: string): void {
    if (element && className) {
      if (element.classList) element.classList.add(className);
      else element.className += ' ' + className;
    }
  }

  public static absolutePosition(
    element: SafeAny,
    target: SafeAny,
    gutter = true,
    align: Alignment = Alignment.bottom,
  ): void {
    const elementDimensions = element.offsetParent
      ? {
          width: element.offsetWidth,
          height: element.offsetHeight,
        }
      : this.getHiddenElementDimensions(element);
    /**
     * 弹窗元素宽高
     */
    const elementOuterHeight = elementDimensions.height;
    const elementOuterWidth = elementDimensions.width;
    /**
     * 目标元素宽高
     */
    const targetOuterHeight = target.offsetHeight;
    const targetOuterWidth = target.offsetWidth;
    /**
     * 目标元素宽高及定位
     */
    const targetOffset = target.getBoundingClientRect();
    /**
     * 窗口滚动偏移量
     */
    const windowScrollTop = this.getWindowScrollTop();
    const windowScrollLeft = this.getWindowScrollLeft();
    /**
     * 视口
     */
    const viewport = this.getViewport();

    // 最终结果
    let top: number, left: number;

    if (align === Alignment.bottom) {
      // 弹窗元素底部溢出视口的情况
      if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
        // 将弹窗元素定位变成left top定位，弹窗元素底部对齐目标元素顶部
        top = targetOffset.top + windowScrollTop - elementOuterHeight;
        element.style.transformOrigin = 'bottom';

        // 考虑顶部空间也不够的情况，变成顶部对齐视口顶部
        if (top < 0) {
          top = windowScrollTop;
        }
      } else {
        // 弹窗元素底部空间足够则：弹窗元素顶部对齐目标元素底部
        top = targetOuterHeight + targetOffset.top + windowScrollTop;
        element.style.transformOrigin = 'top';
      }

      // 目标元素右侧空间不够放下弹窗元素的情况
      if (targetOffset.left + elementOuterWidth > viewport.width)
        // 变成弹窗元素左对齐视口左侧或右边对齐目标元素右边
        left = Math.max(0, targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth);
      // 右边空间足够，目标元素和弹窗元素左对齐
      else left = targetOffset.left + windowScrollLeft;
    } else {
      // 弹窗元素底部溢出视口的情况
      if (targetOffset.top + elementOuterHeight > viewport.height) {
        // 将弹窗元素定位变成right bottom定位，弹窗元素底部对齐目标元素顶部
        top = targetOffset.top + targetOuterHeight + windowScrollTop - elementOuterHeight;
        element.style.transformOrigin = 'bottom';

        // 考虑顶部空间也不够的情况，变成顶部对齐视口顶部
        if (top < 0) {
          top = viewport.height - elementOuterHeight;
        }
      } else {
        // 弹窗元素底部空间足够则：弹窗元素顶部对齐目标元素顶部
        top = targetOffset.top + windowScrollTop;
        element.style.transformOrigin = 'top';
      }

      // 目标元素右侧空间不够放下弹窗元素的情况
      if (targetOffset.left + targetOuterWidth + elementOuterWidth > viewport.width)
        // 变成弹窗元素左对齐视口左侧或右边对齐目标元素右边
        left = Math.max(0, targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth);
      // 右边空间足够，目标元素和弹窗元素右对齐
      else left = targetOffset.left + windowScrollLeft + targetOuterWidth;
    }

    element.style.top = top + 'px';
    element.style.left = left + 'px';
    gutter &&
      (element.style.marginTop =
        origin === 'bottom' ? 'calc(var(--p-anchor-gutter) * -1)' : 'calc(var(--p-anchor-gutter))');
  }

  public static getHiddenElementDimensions(element: SafeAny): SafeAny {
    const dimensions: SafeAny = {};
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    dimensions.width = element.offsetWidth;
    dimensions.height = element.offsetHeight;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return dimensions;
  }
}
