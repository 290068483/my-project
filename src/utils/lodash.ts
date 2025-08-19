// src/utils/lodash.ts
// 统一导出常用的Lodash函数，减小打包体积
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';
import find from 'lodash/find';
import filter from 'lodash/filter';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

// 导出常用函数
export {
  debounce,
  throttle,
  cloneDeep,
  isEmpty,
  isEqual,
  merge,
  pick,
  omit,
  uniq,
  sortBy,
  find,
  filter,
  map,
  reduce
};

// 如果需要使用完整的Lodash，也可以导出
import _ from 'lodash';
export default _;