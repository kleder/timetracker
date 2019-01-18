import { Component, OnInit, Injectable, Input } from '@angular/core';
import { ApiService } from '../../../services/api/api.service'
import { TimerService } from '../../../services/timer.service';
import { DataService } from '../../../services/data.service'
import { DatabaseService } from '../../../services/database.service'
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpService } from '../../../services/http.service'
import { WorkItem } from 'app/models/WorkItem';
import { shell } from 'electron';
import { ToasterService } from '../../../services/toaster.service'
import { AccountService } from '../../../services/account.service'
import { Router, ActivatedRoute } from '@angular/router';
import { SpinnerService } from 'app/services/spinner.service';
import { AccountType } from '../../../models/AccountType';
import { JiraApiService } from '../../../services/api/jira-api.service';
import { YoutrackApiService } from '../../../services/api/youtrack-api.service';
import { ApiProviderService } from '../../../services/api/api-provider.service';
import { Issue } from '../../../models/Issue';
import { MapToIterable } from '../../../pipes/map-to-iterable.pipe'
import { Agile } from '../../../models/Agile';
import { Board } from '../../../models/Board';
import { BoardVm } from './BoardVm';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { ApiInitService } from '../../../services/api/api-init.service';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { ColorService } from '../../../services/color.service';
import { DbMemoryCacheService } from '../../../services/db-memory-cache.service';
import { TrecOnInit } from '../../TrecOnInit';

const electron = require('electron')

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
 
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ maxHeight: '1000px', transition: 'max-height .3s ease-in', overflow: 'hidden' })),
      state('hidden', style({ maxHeight: '0', transition: 'max-height .3s ease-out', overflow: 'hidden'}))
    ])
  ]
})

@Injectable()
export class BoardsComponent extends TrecOnInit {
  private currentIssueId: string
  
  public applyCommand: any
  private totalTimes: object
  private newIssue: Issue
  private currentAgile: object;
  private accountId: number;
  private currentProjectName: string;
  private currentProjectId: string;
  private boards: Map<string, BoardVm> = new Map<string, BoardVm>();
  private timerObserver: Subscription;
  
  constructor(
    public timerService: TimerService,
    public dataService: DataService,
    public databaseService: DatabaseService,
    public toasterService: ToasterService,
    public accountService: AccountService,
    public router: Router,
    public spinnerService: SpinnerService,
    protected apiProviderService: ApiProviderService,
    private activatedRoute: ActivatedRoute,
    protected apiInitService: ApiInitService,
    private colorService: ColorService,
    private dbMemoryCacheService: DbMemoryCacheService,
    private ref: ChangeDetectorRef , private zone: NgZone
  ) {
    super(apiProviderService, apiInitService, accountService);
  }

  toggle(i) {
  
  }

  async ngOnInit() {
    await super.ngOnInit();

    this.getParams();
  }

  private getParams() {
    this.activatedRoute.queryParams.subscribe(async (params) => {
      this.accountId = params["accountId"];
      await this.colorService.init(this.accountId);
      await this.dbMemoryCacheService.init(Number(this.accountId)).then(() => {
         this.initBoards();
         this.initTasks();
      })
    });
  }

  private initTasks(): void {
    let that = this;
    this.dbMemoryCacheService.onTasksUpdate.subscribe(p => this.syncTasks(that));
    this.syncTasks(this);
  }

  private syncTasks(that): void {
    let boardsCopy: Map<string, BoardVm> = new Map(that.boards);

    that.boards.forEach((boardVm, boardName) => {
       let tasks =  that.dbMemoryCacheService.getTasks(boardVm.details.id);
       let mapOfTasks = this.getMapOfTasks(tasks, that);
       boardsCopy.get(boardName).tasks = mapOfTasks;
       that.zone.run(() => that.boards = boardsCopy); 
    });
  }

  private getMapOfTasks(tasks: any, that) {
    return tasks.reduce((map, task) => { map.set(task.timeTrackerId, task);
      return map;
    }, new Map<string, Issue>());
  }

  

  private initBoards() {
    let that = this;
    let boards = this.dbMemoryCacheService.getBoards();
    let mapOfBoards = this.getMapOfBoards(boards, this);
    this.zone.run(() => this.boards = mapOfBoards);
  }

  private getMapOfBoards(boards: Board[], that: this) {
    var boardsLocal = new Map<string, BoardVm>();

    boards.forEach(board => boardsLocal.set(board.name, that.createBoardVm(board)));

    return boardsLocal;
  }

  private createBoardVm(board: Board) : BoardVm {
    let vm = new BoardVm();
    vm.details = board;

    return vm;
  }

  public showCommandModal(issue){
    this.currentAgile = undefined
    this.applyCommand = { id: issue, command:'' }
    document.getElementById('addIssue').style.display = 'block'
  }

  public showCreateIssueModal(projectName: string, projectId: string) {
    this.currentProjectId = projectId;
    this.currentProjectName = projectName;
    this.newIssue = new Issue();
    document.getElementById('addIssue').style.display = 'block'
  }

  public hideAddIssueModal() {
    this.currentAgile = undefined
    document.getElementById('addIssue').style.display = "none"
  }

  public async createIssueOnBoard(data, board) {
    let that = this;

    this.api.createIssueOnBoard(data, this.boards.get(board).details).then(() => {
      that.hideAddIssueModal();
      that.syncTasks(that);
    });
  }

  public async openBoardInBrowser(url: string){
    var account = await this.accountService.Current();
    var baseUrl = account.type == AccountType.Jira ? account.Jira.url : account.Youtrack.url;
    shell.openExternal(baseUrl + url);
  }
  
  public async openIssueInBrowser(url : string){
    var account = await this.accountService.Current();
    var baseUrl = account.type == AccountType.Jira ? account.Jira.url : account.Youtrack.url;

    shell.openExternal(baseUrl + url);
  }

  public showSuggestion(commNdItem: any){
    this.api.getCommandSuggestions(commNdItem.id,{command:commNdItem.command, max:5}).then( data => {
      this.applyCommand.suggestions = data;
    })
  }

  public executeCommand(commNdItem: any) {
    this.api.executeCommand(commNdItem.id,{command:commNdItem.command}).then( data => {
      this.applyCommand = undefined;
      document.getElementById('addIssue').style.display = "none";
    })
  }
  
  public getPriorityColor( boardId: number, issueType: string ) {
    let style = {
      'color' : this.colorService.getColor(boardId, issueType).hexColor
    }

    return style;
  }

  public startTracking(id: number, timeTrackerId: string) : void {
    let account = this.accountService.Current()
    var item = new WorkItem;
    item.startDate = new Date(Date.now());
    item.issueId = id;
 
    this.timerService.startTracking(item);
  }
}