import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class DateService {

    private _MS_PER_DAY = 1000 * 60 * 60 * 24;

    public getDurationInSeconds(d1: Date, d2: Date) : number {
        return Math.ceil(Math.abs(d1.getTime() - d2.getTime())/ 1000.0);
    }

    public getDurationInMinutes(d1: Date, d2: Date) : number {
        return Math.ceil(this.getDurationInSeconds(d1, d2) / 60.0);
    }

    public getDurationInDays(d1: Date, d2: Date) : number {
        var utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
        var utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
      
        return Math.abs(Math.floor((utc2 - utc1) / this._MS_PER_DAY));
    }

}
