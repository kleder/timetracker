import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service'
import { ApiService } from '../../../services/api.service'
import { HttpService } from '../../../services/http.service'

import { Router, ActivatedRoute } from '@angular/router';
import { RemoteAccount } from 'app/models/RemoteAccount';
import { AccountService } from '../../../services/account.service'
import { ToasterService } from '../../../services/toaster.service'

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {
  public editingAccount: any
  public agiles: any
  public toasterText: string
  public modalText: string
  constructor(
    public databaseService: DatabaseService,
    public activatedRoute: ActivatedRoute,
    public api: ApiService,
    public httpService: HttpService,
    public router: Router,
    public account: AccountService,
    public toasterService: ToasterService
  ) { }

  ngOnInit() {
    this.getCurrentAccount()
    this.getAllAgiles()
  }

  async getCurrentAccount() {
    this.editingAccount = await this.account.Current()
  }

  public backToWorkspace() {
    this.router.navigate(['workspace'])
  }

  public getAllAgiles() {
    this.api.getAllAgiles().then(
      data => {
        this.httpService.loader = false
        this.agiles = data
        this.agiles.forEach(agile => {
          this.getAgileVisibility(agile.name)          
        })
      }
    )
  }

  editNameOrUrl(account) {
    this.databaseService.editAccount(account).then(data => {
      this.toasterService.showToaster('Account updated!', "success")
    }, err => {
      this.toasterService.showToaster('An error occured!', "error")
    })
  }

  goToChangeToken() {
    this.router.navigate(['/accounts/change-account-token'], { queryParams: {accountId: this.editingAccount.id, accountName: this.editingAccount.name, accountUrl: this.editingAccount.url } });    
  }

  editBoard(board) {
    this.router.navigate(['/edit-board'], { queryParams: {boardName: board.name, accountId: this.editingAccount.id, accountName: this.editingAccount.name, accountUrl: this.editingAccount.url, } });    
  }

  public removeAccount(id) {
    this.databaseService.deleteAccount(id).then(data => {
      this.router.navigate(['/accounts']) 
      this.toasterService.showToaster('Account removed!', "success")
    }, err => {
      this.toasterService.showToaster('An error occured!', "error")            
    })
    this.hideModal()
  }

  public showModal(text) {
    this.modalText = text
    document.getElementById('modal').style.display = "block"
  }

  public hideModal() {
    document.getElementById('modal').style.display = "none"
  }

  async getAgileVisibility(boardName) {
    this.databaseService.getBoardVisibilities(this.editingAccount.id, boardName).then(boardVisibility => {
      this.agiles.filter(agile => {
        if (agile.name == boardVisibility[0].boardName) {
          boardVisibility[0].visible == 1? agile.checked = true : agile.checked = false
        }
      })
    })
  }

  async updateAgileVisibility(agile) {
    agile.checked == true? agile.checked = 1 : agile.checked = 0
    this.databaseService.updateBoardVisibility(this.editingAccount.id, agile.name, agile.checked)
  }

  async updateAgilesVisibility() {
    this.agiles.forEach(agile => {
      agile.checked == true? agile.checked = 1 : agile.checked = 0
      this.databaseService.updateBoardVisibility(this.editingAccount.id, agile.name, agile.checked).then(data => {
        if (data) {
          this.toasterService.showToaster('Your changes have been saved!', "success")          
        }
      }, err => {
        this.toasterService.showToaster('An error occured!', "error")            
      })
    })
  }

  public saveChanges(account) {
    this.updateAgilesVisibility()
    this.editNameOrUrl(account)
    this.backToWorkspace()
  }

}
