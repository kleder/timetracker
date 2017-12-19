import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service'
import { ApiService } from '../../services/api.service'
import { HttpService } from '../../services/http.service'

import { Router, ActivatedRoute } from '@angular/router';
import { RemoteAccount } from 'app/models/RemoteAccount';
import { AccountService } from '../../services/account.service'
import { ToasterService } from '../../services/toaster.service'

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
    public http: HttpService,
    public router: Router,
    public accounts: AccountService,
    public toasterService: ToasterService
  ) { }

  ngOnInit() {
    this.activatedRoute
    .queryParams
    .subscribe(params => {
      this.editingAccount = {
        id: params['accountId'],
        name: params['accountName'],
        url: params['accountUrl'],
      }
      console.log("this.editingAccount", this.editingAccount)
      // console.log("params['toastText']", params['toasterText'])
      // if (params['toasterText']) {
      //   this.toasterService.showToaster(params['toasterText'], 'success')
      // }
    });
    this.getAllAgiles()
  }

  public getAllAgiles() {
    console.log('getAllAgiles()')
    this.api.getAllAgiles().then(
      data => {
        this.http.loader = false
        this.agiles = data
      }
    )
  }

  editNameOrUrl(account) {
    console.log("account", account)
    this.databaseService.editAccount(account).then(data => {
      console.log("data", data)
      this.toasterService.showToaster('Account updated!', "success")
    }, err => {
      console.log("err", err)
      this.toasterService.showToaster('An error occured!', "error")
    })
  }

  goToChangeToken(token) {
    this.router.navigate(['/change-account-token'], { queryParams: {accountId: this.editingAccount.id, accountName: this.editingAccount.name, accountUrl: this.editingAccount.url } });    
  }

  editBoard(board) {
    this.router.navigate(['/edit-board'], { queryParams: {boardName: board.name, accountId: this.editingAccount.id, accountName: this.editingAccount.name, accountUrl: this.editingAccount.url, } });    
  }

  public removeAccount(id) {
    this.databaseService.deleteAccount(id).then(data => {
      this.router.navigate(['menu'])      
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

}
