import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service'
import { ApiService } from '../../../services/api/api.service'
import { HttpService } from '../../../services/http.service'

import { Router, ActivatedRoute } from '@angular/router';
import { Account } from 'app/models/Account';
import { AccountService } from '../../../services/account.service'
import { ToasterService } from '../../../services/toaster.service'
import { versions } from '../../../../environments/versions'
import { shell } from 'electron';
import { SpinnerService } from '../../../services/spinner.service';
import { ApiProviderService } from '../../../services/api/api-provider.service';
import { Board } from '../../../models/Board';
import { Project } from '../../../models/Project';
import { TrecOnInit } from '../../TrecOnInit';
import { ApiInitService } from '../../../services/api/api-init.service';


@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent extends TrecOnInit {
  accountId: any;
  public editingAccount: any;
  public toasterText: string
  public modalText: string
  public modalType: string
  public isNew = false;
  public version = {name:'', published_at:'', body:''};
  public boards: Board[];

  public projects: Project[];

  constructor(
    public databaseService: DatabaseService,
    public activatedRoute: ActivatedRoute,
    public httpService: HttpService,
    public router: Router,
    protected accountService: AccountService,
    public toasterService: ToasterService,
    public spinnerService: SpinnerService,
    protected apiProviderService: ApiProviderService,
    protected apiInitService: ApiInitService

  ) {
    super(apiProviderService, apiInitService, accountService);
  }

  async ngOnInit() {
    await super.ngOnInit();

    this.getCurrentAccount()
    let that = this;
    this.databaseService.getProjects().then(projects => {
      that.projects = projects;
    })
  }

  async getCurrentAccount() {
    let that = this;
    this.activatedRoute.queryParams.subscribe(async (params) => {
      that.accountId = params["accountId"];
      that.databaseService.getAccount(that.accountId).then(account => {
        that.editingAccount = account;
        that.getAllAgiles();
      })
    });
  }

  public backToWorkspace() {
    this.router.navigate(['workspace'], {queryParams: {accountId: this.accountId}})
  }

  public getAllAgiles() {
    this.spinnerService.visible = true;
    let that = this;
    this.api.getAllBoards().then(boards => {
        this.databaseService.getAllBoards(this.accountId).then(dbBoards => {
          that.boards = boards;
          that.setBoardsVisibility(that, dbBoards);
          that.spinnerService.visible = false;
        })
    })
  }

  private setBoardsVisibility(that: this, dbBoards: Board[]) {
    that.boards.forEach(board => {
      var dbBoard = dbBoards.find(dbBoard => dbBoard.timeTrackerId === board.timeTrackerId);
      if (dbBoard !== undefined) {
        board.isChecked = dbBoard.isChecked;
      }
    });
  }

  public async openInBrowser(url : string){
    shell.openExternal(url);
  }

  editNameOrUrl(account) {
    this.databaseService.updateAccount(account).then(data => {
      this.toasterService.success('Account updated!')
    }, err => {
      this.toasterService.error('An error occured!')
    })
  }

  goToChangeAccountSettings() {
  this.router.navigate(['/accounts/add-youtrack'], { queryParams: {accountId: this.editingAccount.id, changeAccountSettings: true } });    
  }

  editProject(project) {
   this.router.navigate(['/edit-project'], { queryParams: {projectName: project.name, projectId: project.timeTrackerId , accountId: this.editingAccount.id } });    
  }

  public removeAccount(id) {
    this.databaseService.deleteAccount(id).then(data => {
      this.router.navigate(['/accounts']) 
      this.toasterService.success('Account removed!')
    }, err => {
      this.toasterService.error('An error occured!')            
    })
    this.hideModal()
  }

  public showModal(text, action) {
    this.modalType = action
    this.modalText = text
    document.getElementById('modal').style.display = "block"
  }

  public hideModal() {
    document.getElementById('modal').style.display = "none"
  }


  private updateChosenBoards(){
    this.boards.forEach(board => {
      this.databaseService.updateBoard(board);
    })
  }

  public saveChanges(account) {
    this.updateChosenBoards();
    this.backToWorkspace()
  }

  public resetApplication() {
    this.databaseService.recreateDb()
    this.hideModal()
  }

}
