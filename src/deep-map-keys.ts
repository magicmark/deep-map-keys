import WeakMap = require('es6-weak-map');
import { isArray, isObject } from 'lodash';

interface NonPrimitive extends Object {
  [key: string]: any;
  [index: number]: any;
}

export interface MapFn {
  (key: string, value: any): string;
}

export interface Opts {
  thisArg?: any;
}

export class DeepMapKeys {

  private cache = new WeakMap<NonPrimitive, any>();

  constructor(
    private mapFn: MapFn,
    private opts: Opts
  ) { }

  public map(value: any): any {
    return isArray(value) ? this.mapArray(value) :
      isObject(value) ? this.mapObject(value) :
      value;
  }

  private mapArray(arr: any[]): any[] {
    if (this.cache.has(arr)) {
      return this.cache.get(arr);
    }

    let length = arr.length;
    let result: any[] = [];
    this.cache.set(arr, result);

    for (let i = 0; i < length; i++) {
      result.push(this.map(arr[i]));
    }

    return result;
  }

  private mapObject(obj: NonPrimitive): NonPrimitive {
    if (this.cache.has(obj)) {
      return this.cache.get(obj);
    }

    let {mapFn, opts: {thisArg}} = this;
    let result: NonPrimitive = {};
    this.cache.set(obj, result);

    for (let key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        result[mapFn.call(thisArg, key, obj[key])] = this.map(obj[key]);
      }
    }

    return result;
  }
}
