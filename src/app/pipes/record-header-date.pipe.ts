import { Pipe, PipeTransform } from '@angular/core';
import { DateService } from '../services/date.service';
@Pipe({
  name: 'recordHeaderDate'
})
export class RecordHeaderDate implements PipeTransform {

    constructor(private dateService: DateService) {
        
    }

  transform(date: string): any {
    var today = new Date(Date.now());
    var inputDate = new Date(date);
    var duration = this.dateService.getDurationInDays(today, inputDate);

    if(duration === 0){
        return "TODAY"
    } else if(duration === 1) {
        return "YESTERDAY";
    } else if( duration > 1 && duration < 7) {
        return duration.toString() + " DAYS AGO"
    } else {
        return date;
    }
  }
}