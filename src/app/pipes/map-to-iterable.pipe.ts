import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'mapToIterable'
})
export class MapToIterable implements PipeTransform {
  transform(dict: Map<any,any>): any {
    var a:any[] = [];
    if(typeof dict.keys === "function"){
      for (let key of Array.from(dict.keys())) {
        a.push({key: key, val: dict.get(key)});
      }
    }
   
    
    return a;
  }
}