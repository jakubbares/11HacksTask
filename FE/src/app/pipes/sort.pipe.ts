import {Pipe, PipeTransform} from "@angular/core";
import {firstBy} from 'thenby';

@Pipe({
  name: 'playerSortBy',
  pure: false
})
export class PlayerSortPipe implements PipeTransform {
  transform(players: any[], field: string, order: boolean): any {
    if (order) {
      if (field.indexOf('notes') != -1) {
        field = field.replace('notes.','');
        return players.sort((a, b) => {return a['notes'][field] -  b['notes'][field]});
      } else {
        return players.sort((a, b) => {
          return a[field] -  b[field]
        });
      }
    } else {
      if (field.indexOf('notes') != -1) {
        field = field.replace('notes.','');
        return players.sort((a, b) => {return b['notes'][field] - a['notes'][field]});
      } else {
        return players.sort((a, b) => {
          return b[field] - a[field]
        });
      }
    }

  }
}

@Pipe({
  name: 'sortBy',
  pure: false
})
export class SortPipe implements PipeTransform {
  transform(items: any[], field: string): any {
    return items.sort((a, b) => {return b[field] -  a[field]});
  }
}

@Pipe({
  name: 'sortByString',
  pure: false
})
export class SortStringPipe implements PipeTransform {
  transform(items: any[], field: string): any {
    return items.sort((a,b) => {
      if (a[field] < b[field])
        return -1;
      if ( a[field] > b[field])
        return 1;
      return 0
    });
  }
}

@Pipe({
  name: 'sortByMulString',
  pure: false
})
export class SortMulStringPipe implements PipeTransform {
  transform(items: any[], field: string, field2: string): any {
    return items.sort(
      firstBy(function (a, b) {
        if (a[field] < b[field])
          return -1;
        if ( a[field] > b[field])
          return 1;
        return 0
      })
        .thenBy(function (a, b) {
      if (a[field2] < b[field2])
        return -1;
      if ( a[field2] > b[field2])
        return 1;
      return 0
    }));
  }
}
