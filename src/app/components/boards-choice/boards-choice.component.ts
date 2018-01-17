import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { DataService } from '../../services/data.service'
import { AccountService } from '../../services/account.service';
import { ApiService } from '../../services/api.service';
import { HttpService } from '../../services/http.service'
import { RemoteAccount } from 'app/models/RemoteAccount';
import { ToasterService } from '../../services/toaster.service'
import { DatabaseService } from '../../services/database.service'
import { MenuService } from '../../services/menu.service'

@Component({
  selector: 'app-boards-choice',
  templateUrl: './boards-choice.component.html',
  styleUrls: ['./boards-choice.component.scss']
})
export class BoardsChoiceComponent implements OnInit {
  public agiles: any
  private justLoggedIn: boolean
  private remoteAccount: RemoteAccount
  public accountName: string
  public wereAgilesChosen: boolean
  constructor(
    public router: Router,
    private dataService: DataService,
    private account: AccountService,
    private api: ApiService,
    public httpService: HttpService,
    public activatedRoute: ActivatedRoute,
    public toasterService: ToasterService,
    public databaseService: DatabaseService,
    public menuService: MenuService    
  ) { 
  }

  ngOnInit() {
    this.activatedRoute
    .queryParams
    .subscribe(async params => {
      this.justLoggedIn = (params['justLoggedIn']) === "true" ? true : false  
      this.accountName = (params['name'])
      this.checkAgilesChosen()        
    });
  }

  public getAllAgiles() {
    console.log('getAllAgiles()')
    this.api.getAllAgiles().then(
      data => {
        this.httpService.loader = false
        this.agiles = data
        this.agileVisibilityInit(this.agiles).then(() => {
          this.agiles.forEach(agile => {
            this.getAgileVisibility(agile.name)
          })
        })
        if (this.justLoggedIn) {
          this.toasterService.showToaster("Account " + this.accountName + " is synced!", "success")
        }
      }
    )
  }

  agilesChoose() {
    this.agiles.forEach(agile => {
      if (!agile.hasOwnProperty('checked')) {
        agile.checked = false
      }
    })
    this.dataService.sentChosenAgiles(this.agiles)
    this.setAgilesChosen()
    this.goToWorkspace()
  }

  public goToWorkspace() {
    this.menuService.enabledWorkspace(true)
    this.router.navigateByUrl('/tracking');
  }

  async agileVisibilityInit(agiles) {
    let account = await this.account.Current()
    agiles.forEach(agile => {
      this.databaseService.initBoardVisibility(account["id"], agile.name, 0)
    })
  }

  async getAgileVisibility(boardName) {
    let account = await this.account.Current()
    this.databaseService.getBoardVisibilities(account["id"], boardName).then(boardVisibility => {
      this.agiles.filter(agile => {
        if (agile.name == boardVisibility[0].boardName) {
          boardVisibility[0].visible == 1? agile.checked = true : agile.checked = false
        }
      })
    })
  }

  async agileVisibilityUpdate(agile) {
    let account = await this.account.Current()
    agile.checked == true? agile.checked = 1 : agile.checked = 0
    this.databaseService.updateBoardVisibility(account["id"], agile.name, agile.checked)
  }

  async initAgilesChosen() {
    let account = await this.account.Current()
    this.databaseService.initAgilesChosen(account["id"])
  }

  async setAgilesChosen() {
    let account = await this.account.Current()
    this.databaseService.setAgilesChosen(account["id"])
  }

  async checkAgilesChosen() {
    let account = await this.account.Current()
    this.databaseService.checkAgilesChosen(account["id"]).then(data => {
      if (data.length) {
        data["0"]["afterChoose"]? this.goToWorkspace() : this.getAllAgiles()        
      } else {
        this.initAgilesChosen()
        this.getAllAgiles()   
      }
    })
  }
  
}
