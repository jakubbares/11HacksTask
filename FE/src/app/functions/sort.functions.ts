import {firstBy} from "thenby";

export function sortEqualsValueTop(array, field, value) {
  return array.sort(function(a, b) {
    if (a[field] !== value && b[field] === value) {
      return 1;
    } else if (a[field] === value && b[field] !== value) {
      return -1
    } else {
      if (a < b) return -1;
      else if ( a > b) return 1;
      return 0;
    }
  });
}

export function sort(array): any[] {
  return array.sort(function(a, b) {
    if (a < b) {
      return -1;
    }
    if ( a > b) {
      return 1;
    }
    return 0;
  });
}

export function sortByFieldWithOrder(array, field, order=true): any[] {
  //desc = order = true
  return array.sort(function(a, b) {
    if (a[field] < b[field])
      return order ? 1 : -1;
    if (a[field] > b[field])
      return order ? -1 : 1;
    return 0;
  });
}

export function sortByField(array, field): any[] {
  return array.sort(function(a, b) {
    if (a[field] < b[field]) {
      return -1;
    }
    if ( a[field] > b[field]) {
      return 1;
    }
    return 0;
  });
}

export function sortByTwoFields(items, field, field2) {
  return items.sort(
    firstBy(function (a, b) {
      if (a[field] < b[field])
        return -1;
      if ( a[field] > b[field])
        return 1;
      return 0;
    })
      .thenBy(function (a, b) {
        if (a[field2] < b[field2])
          return -1;
        if ( a[field2] > b[field2])
          return 1;
        return 0;
      }));
}

export function highestKeyByValue(map) {
  const tuples = Object.keys(map).map(key => { return { key: key, value: map[key]}});
  return tuples.length ? tuples.sort((a, b) => b.value - a.value)[0].key : null;
}

