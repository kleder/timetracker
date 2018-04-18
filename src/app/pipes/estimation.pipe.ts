import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estimation'
})
export class EstimationPipe implements PipeTransform {

  transform(minutes:number): any {
    let str = ``
    let d = minutes / 480
    if (minutes !== undefined) {
      if (d > 1) {
        str += `${Math.floor(d)}d`
        minutes -= Math.floor(d)*480
      }
      let h = minutes / 60
      if (h >= 1) {
        str += ` ${Math.floor(h)}h`
        minutes -= Math.floor(h)*60
      }
     if (minutes) {
       str += ` ${minutes}m`
     } 
    }
    return str
  }

}
