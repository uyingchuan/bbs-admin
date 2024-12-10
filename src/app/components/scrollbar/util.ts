import {ThumbComponent} from "./thumb/thumb.component";

export const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left',
  }
} as const;

export const GAP = 4;

export function addUnit(value?: string | number, defaultUnit = 'px') {
  if (!value) return '';
  if (typeof value === 'string') {
    return value;
  } else {
    return `${value}${defaultUnit}`;
  }
}

export const renderThumbStyle = ({
  move,
  size,
  bar,
}: Pick<ThumbComponent, 'move' | 'size'> & {
  bar: typeof BAR_MAP[keyof typeof BAR_MAP]
}): Partial<CSSStyleDeclaration> => ({
  [bar.size]: size,
  transform: `translate${bar.axis}(${move}%)`,
});
