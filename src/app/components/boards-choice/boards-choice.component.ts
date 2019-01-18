import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { DataService } from '../../services/data.service'
import { AccountService } from '../../services/account.service';
import { HttpService } from '../../services/http.service'
import { Account } from 'app/models/Account';
import { ToasterService } from '../../services/toaster.service'
import { DatabaseService } from '../../services/database.service'
import { MenuService } from '../../services/menu.service'
import { SpinnerService } from '../../services/spinner.service';
import { ApiProviderService } from '../../services/api/api-provider.service';
import { ApiService } from '../../services/api/api.service';
import { AccountType } from '../../models/AccountType';
import { Board } from '../../models/Board';
import { Project } from '../../models/Project';
import { Priority } from '../../models/Priority';
import { TrecOnInit } from '../TrecOnInit';
import { ApiInitService } from '../../services/api/api-init.service';

@Component({
  selector: 'app-boards-choice',
  templateUrl: './boards-choice.component.html',
  styleUrls: ['./boards-choice.component.scss']
})
export class BoardsChoiceComponent extends TrecOnInit {
  
  public agiles: any
  private justLoggedIn: boolean
  private remoteAccount: Account
  public accountName: string
  public wereAgilesChosen: boolean
  private accountId: number;

  constructor(
    public router: Router,
    private dataService: DataService,
    protected accountService: AccountService,
    public httpService: HttpService,
    public activatedRoute: ActivatedRoute,
    public toasterService: ToasterService,
    public databaseService: DatabaseService,
    public menuService: MenuService,
    public spinnerService: SpinnerService,
    protected apiServiceProvider: ApiProviderService,
    protected apiInitService: ApiInitService
  ) {
    super(apiServiceProvider, apiInitService, accountService);
  }

  async ngOnInit() {
    await super.ngOnInit();
    this.activatedRoute
    .queryParams
    .subscribe(async params => {
      this.accountName = (params['name'])
      this.accountId = params['accountId'];
      this.init()        
    });
  }


  private init(){
      let that = this;
      this.spinnerService.visible = true;

      this.databaseService.getAllBoards(this.accountId).then(
        data => {
            if(data.length > 0) {
              that.goToWorkspace();
            } else {
              that.getAllBoardsFromTimeTracker();
            }
        });
  }
  public getAllBoardsFromTimeTracker() {
    this.spinnerService.visible = true;
    let that = this;

    this.api.getAllBoards().then(
      data => {
        this.agiles = data
        this.toasterService.success("Account is synced!")
        this.spinnerService.visible = false;
      }
    )
  }

  async agilesChoose() {
    await this.saveChoosenBoardsInDb(this.agiles);
    this.goToWorkspace()
  }

  public goToWorkspace() {
    this.menuService.enabledWorkspace(true)
    this.router.navigate(['/workspace'], {queryParams: {accountId: this.accountId}});
  }

  private async saveChoosenBoardsInDb(boards: Board[]) {
    let that = this;
    let uniqueProjectsToAdd = this.getAllUniqueProjects(boards);

    await this.addProjectsToDb(uniqueProjectsToAdd, boards, that);
    await this.addPrioritesToDb(uniqueProjectsToAdd, that);
    await this.addBoardsToDb(boards, uniqueProjectsToAdd);
  }

  private async addPrioritesToDb(uniqueProjectsToAdd: Project[], that: this) {
    await Promise.all(uniqueProjectsToAdd.map(async (project) => {
      await that.addPrioritiesToDb$(that, project);
    }));
  }

  private async addBoardsToDb(boards: Board[], uniqueProjectsToAdd: Project[]) {
    await Promise.all(boards.map(async (board) => {
      let project = uniqueProjectsToAdd.find(p => p.timeTrackerId == board.projects[0].timeTrackerId);
      board.projectId = project.id;
      await this.databaseService.addBoard(this.accountId, board);
    }));
  }

  private async addProjectsToDb(uniqueProjectsToAdd: Project[], boards: Board[], that: this) {
    await Promise.all(uniqueProjectsToAdd.map(async (project) => {
      project.accountId = this.accountId;
      await that.databaseService.addProject(project).then(projectId => {
        project.id = projectId;
      });
    }));
  }

  private getAllUniqueProjects(boards: Board[]): Project[] {
    let result: Project[]  = [];
    boards.forEach(board => {
      board.projects.forEach(project => {
        if(result.find(p => p.timeTrackerId === project.timeTrackerId) === undefined){
          result.push(project);
        }
      })
    })

    return result;
  }

  private async addPrioritiesToDb$(that, project: Project){
    return that.api.getPriorities().then(priorites => {
      return Promise.all (priorites.map(async priority => {
        return that.databaseService.addPriority(priority, that.accountId, project.id)
      }));
    })
  }
}
