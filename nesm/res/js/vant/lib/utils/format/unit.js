"use strict";

exports.__esModule = true;
exports.addUnit = addUnit;
exports.unitToPx = unitToPx;

var _ = require("..");

var _number = require("../validate/number");

function addUnit(value) {
  if (!(0, _.isDef)(value)) {
    return undefined;
  }

  value = String(value);
  return (0, _number.isNumeric)(value) ? value + "px" : value;
}

function convertRem(value) {
  var rootStyle = window.getComputedStyle(document.documentElement);
  var rootFontSize = parseFloat(rootStyle.fontSize);
  value = value.replace(/rem/g, '');
  return +value * rootFontSize;
}

function unitToPx(value) {
  if (typeof value === 'number') {
    return value;
  }

  if (value.indexOf('rem') !== -1) {
    return convertRem(value);
  }

  return parseFloat(value);
}