import { Component, OnInit, NgZone } from '@angular/core';
import { DatabaseService } from '../../../services/database.service'
import { TimerService } from '../../../services/timer.service'
import { DataService } from '../../../services/data.service'
import { ApiService } from '../../../services/api/api.service'
import { WorkItem } from 'app/models/WorkItem';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service'
import { AccountService } from '../../../services/account.service'
import { ToasterService} from '../../../services/toaster.service'
import { DatePipe } from '@angular/common';
import { SpinnerService } from '../../../services/spinner.service'
import { ApiProviderService } from '../../../services/api/api-provider.service';
import { ApiInitService } from '../../../services/api/api-init.service';
import { RecordCollectionService } from '../../../services/record-collection.service';
import { DateService } from '../../../services/date.service';
import { DbMemoryCacheService } from '../../../services/db-memory-cache.service';
import { TrecOnInit } from '../../TrecOnInit';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent extends TrecOnInit {
  private unstoppedItem: any
  private db: any
  public preparedTimes: Array<any>
  public editingItem: WorkItem;
  public records: Map<string, WorkItem[]> = new Map<string, WorkItem[]>();
  public anyRecordsExists: boolean;

  constructor(
    public databaseService: DatabaseService,
    private timerService: TimerService,
    private dataService: DataService,
    protected apiProviderService: ApiProviderService,
    public router: Router,
    public httpService: HttpService,
    public accountService: AccountService,
    public toasterService: ToasterService,
    public spinnerService: SpinnerService,
    protected apiInitService: ApiInitService,
    private recordCollectionService: RecordCollectionService,
    private dateService: DateService,
    private dbMemoryCacheService: DbMemoryCacheService,
    private zone: NgZone
  ) {
    super(apiProviderService, apiInitService, accountService);
  }

  async ngOnInit() {
    this.spinnerService.visible = true;
    await super.ngOnInit();

    this.init();
  }

  async init() {
    var current = await this.accountService.Current();
    this.api = this.apiProviderService.getInstance();
    let workItems = this.dbMemoryCacheService.getWorkItems();
    this.recordCollectionService.init(workItems);
    var allRecordsFromDb = this.recordCollectionService.getRecords();
    this.zone.run(()=> this.records = allRecordsFromDb)
    this.zone.run(() => this.anyRecordsExists = workItems.length > 0);
    this.spinnerService.visible = false;

  }

  
  
  public getIssueName(workItem: WorkItem) : string {
      return this.getTask(workItem).summary;
  }

  public getBoardName(workItem: WorkItem) : string {
    let task = this.getTask(workItem);
    return this.dbMemoryCacheService.getBoard(task.boardId).name;
  }

  private getTask(workItem: WorkItem) {
    return this.dbMemoryCacheService.getTask(workItem.issueId);
  }

  async getIssueAndStart(issueId) {
    let account = await this.accountService.Current()    
    return new Promise(resolve => {
      this.api.getIssue(issueId).then(issue => {
        var newIssue : WorkItem;
        this.timerService.startItem(newIssue)
      })
    })
  }

  public sendWorkItems = (issueId, item) => {
    this.timerService.stopItem().then(      
      (data)  => {
          this.dataService.timeSavedNotification('Your tracking has been saved!')
          this.dataService.timeSavedNotification('')
         
          this.init()
      }, (err) =>{
          this.dataService.timeSavedNotification('An error occured.')
          this.dataService.timeSavedNotification('')
      }
    )
  }


  public editWorkItem() {
    let that = this;
    this.api.editWorkItem(this.editingItem).then((data => {
      that.databaseService.updateWorkItem(that.editingItem).then(() => {
        this.init()
        this.hideEditIssueModal();
        this.toasterService.success("Work item has been updated successfuly")
      });
      
    }))
  }

  public deleteWorkItem(item: WorkItem) {
    let that = this;
 
    this.api.deleteWorkItem(item).then(() => {
      that.databaseService.deleteWorkItem(item).then(() => {
        this.dbMemoryCacheService.forceSync();
        this.toasterService.success("Work item has been deleted") 
      })
    })
  }

  public getTimeSpend(workItem: WorkItem) : number {
      return this.dateService.getDurationInSeconds(workItem.startDate, workItem.endDate);
  }

  public getSpendInAllDay(day: string) : number {

    let sum = 0;
    var rec = this.records.get(day);
    rec.forEach(workItem => {
        sum += this.getTimeSpend(workItem);
    })

    return sum;
  }


  public showEditIssueModal(item: WorkItem) {
    this.editingItem = item;
    document.getElementById('editIssue').style.display = 'block'
  }

  public hideEditIssueModal() {
    document.getElementById('editIssue').style.display = 'none'
  }

  public async goToBoards() {
    let acc = this.accountService.Current()
    this.router.navigate(['../workspace'], { queryParams: { name: "aaaa", accountId :acc.id} });
  }
}