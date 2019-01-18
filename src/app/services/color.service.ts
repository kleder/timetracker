import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DatabaseService } from './database.service';
import { Color } from '../models/Color';
import { Priority } from '../models/Priority';

@Injectable()
export class ColorService {
    private prorities: Priority[];

  
    constructor(private databaseService: DatabaseService) {
    }

    public async init(accountId: number)  {
        let that = this;
       await this.databaseService.getPriorities(accountId).then(priorities => {
            that.prorities = priorities;
        });
    }

    public getColor(projectId: number, priorityName: string){
      return this.prorities.find(p => p.name == priorityName);
    }

}
