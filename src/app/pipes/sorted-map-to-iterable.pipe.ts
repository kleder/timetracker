import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'sortedMapToIterable'
})
export class SortedMapToIterable implements PipeTransform {
  transform(dict: Map<any,any>): any {
    var a:any[] = [];
    if(typeof dict.keys === "function"){

        var keys = Array.from(dict.keys()); 

        keys.sort(function(a, b){
            var l = new Date(a).getTime();
            var r = new Date(b).getTime(); 
            if(l < r) {
                return 1;
            } 
            if(l > r){
                return -1;
            }
            return 0;
            
        })
      for (let key of keys) {
        a.push({key: key, val: dict.get(key)});
      }
    }
   
    
    return a;
  }
}