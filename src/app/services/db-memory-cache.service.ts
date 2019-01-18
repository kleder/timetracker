import { Injectable } from "@angular/core";
import { Issue } from "../models/Issue";
import { DatabaseService } from "./database.service";
import { ApiProviderService } from "./api/api-provider.service";
import { ApiService } from "./api/api.service";
import { Subscription, BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/Observable";
import { Board } from "../models/Board";
import { WorkItem } from "../models/WorkItem";

@Injectable()
// todo: maybe better idea is to use sqlite in-memory
// add :memory: to db file name on open
// optimize!! to not store all records in memory :(
export class DbMemoryCacheService {
    private api: ApiService;
    private timerObserver: Subscription;
    private accountId: number;

    private timerBehaviour = new BehaviorSubject<void>(null);
    onTasksUpdate = this.timerBehaviour.asObservable();

    private tasks: Map<number, Issue[]> = new Map<number, Issue[]>();
    private tasks2: Map<number, Issue> = new Map<number, Issue>();
    private boards: Map<number, Board> = new Map<number, Board>();
    private workItems: WorkItem[] = [];


    constructor(
        private databaseService: DatabaseService, 
        private apiProviderService: ApiProviderService) {

    }

    public init(accountId: number) : Promise<void> {
        this.accountId = accountId;
        this.api = this.apiProviderService.getInstance();

        this.startTimer();

        return this.sync(this)
    }
    private clear(): void {
        this.tasks = new Map<number, Issue[]>();
        this.boards = new Map<number, Board>(); 
        this.workItems = [];
    }

    public getTasks(boardId: number): Issue[] {
        return this.tasks.get(boardId);
    }

    public getTask(id: number) : Issue {
        return this.tasks2.get(id);
    }

    public getBoards() : Board[] {
        return Array.from(this.boards.values());
    }

    public getWorkItems(): WorkItem[] {
        return this.workItems;
    }

    public getBoard(id: number) : Board {
        return this.boards.get(id);
    }

    public getTimeSpentTodayOnTask(issueId: number) : number {
        return this.workItems.filter(p => p.duration != 0).reduce((a, b) => a + b.duration, 0)
    }

    private startTimer(): void {
        const TIMEOUT = 10000;
        let that = this;
        let timer = Observable.timer(TIMEOUT, TIMEOUT);
        this.timerObserver = timer.subscribe(() => this.sync(that))
    }

    public forceSync(){
        this.sync(this);
    }

    private async sync(that) {
        let tmp: Issue[] = []

        await this.databaseService.getAllCheckedBoards(that.accountId).then(async boards => {
           return Promise.all(boards.map(async board => {
                that.boards.set(board.id, board);
                return that.api.getIssuesByAgile(board).then(async tasks => {

                        await that.updateDb(tasks, board, that);
                        that.tasks.set(board.id, tasks);
                        if(tasks.length > 0) {
                            tasks.forEach(element => {
                                that.tasks2.set(element.id, element);
                        });
                    }
                    
                })
            }));
        })
        await this.syncWorkItems(that);
        this.timerBehaviour.next(null);
    }

    private syncWorkItems(that) {
       return this.databaseService.getRecords().then(records => {
            that.workItems = records;
        })
    }

    private updateDb(tasks: Issue[], board: Board, that){
       return Promise.all(tasks.map(async task => {
          task.boardId = board.id;
          await that.databaseService.addTask(task).then(id => {
            task.id = id;
          })
        }))
    
      }

}