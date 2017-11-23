import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToTime'
})
export class SecondsToTimePipe implements PipeTransform {
  transform(seconds): any {
    let time_str= ''
    let h = Math.floor(seconds/3600)
    let m
    if (h > 0) {
      if (h >= 10) {
        time_str += h +":"
      } else {
        time_str += "0" + h + ":"
      }
      seconds -= h * 3600
    } else {
      time_str += "00:"
    }
    m = Math.floor(seconds/60)
    if (seconds >= 60) {
      if (m >= 10) {
        time_str += m + ":"
      } else {
        time_str += "0" + m + ":"
      }
      seconds -= m*60
    } else {
      time_str += "00:"
    }
    if (seconds < 60) {
      if (seconds >= 10) {
        time_str += seconds
      } else {
        time_str += "0" + seconds
      }
    }
    return time_str
  }

}
