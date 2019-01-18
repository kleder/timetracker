import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WorkItem } from '../models/WorkItem';

@Injectable()
export class RecordCollectionService {
  private records: Map<string, WorkItem[]> = new Map<string, WorkItem[]>();
  
  public add(record: WorkItem) : void {
    let key = record.getKey();

    if(!this.records.has(key)){
        this.records.set(key, [record])
    } else {
        var recordsArray = this.records.get(key);
        this.records.set(key, [record].concat(recordsArray));
    }
  }

  public init(records: WorkItem[]): void {
      this.records = new Map<string, WorkItem[]>(); 
      records.forEach(p => this.add(p));
  }

  public getRecords() : Map<string, WorkItem[]>  {
      return this.records;
  }
}
