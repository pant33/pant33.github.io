import { isDef } from '..';
import { isNumeric } from '../validate/number';
export function addUnit(value) {
  if (!isDef(value)) {
    return undefined;
  }

  value = String(value);
  return isNumeric(value) ? value + "px" : value;
}

function convertRem(value) {
  var rootStyle = window.getComputedStyle(document.documentElement);
  var rootFontSize = parseFloat(rootStyle.fontSize);
  value = value.replace(/rem/g, '');
  return +value * rootFontSize;
}

export function unitToPx(value) {
  if (typeof value === 'number') {
    return value;
  }

  if (value.indexOf('rem') !== -1) {
    return convertRem(value);
  }

  return parseFloat(value);
}