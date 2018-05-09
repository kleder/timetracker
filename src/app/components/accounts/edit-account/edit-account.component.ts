import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service'
import { ApiService } from '../../../services/api.service'
import { HttpService } from '../../../services/http.service'

import { Router, ActivatedRoute } from '@angular/router';
import { RemoteAccount } from 'app/models/RemoteAccount';
import { AccountService } from '../../../services/account.service'
import { ToasterService } from '../../../services/toaster.service'
import { versions } from '../../../../environments/versions'
import { WorkHoursInfo, Week } from '../../../models/RemoteAccount'
import { shell } from 'electron';
import { DecimalPipe } from '@angular/common';
import { DataService } from '../../../services/data.service'
import { BoardsComponent } from '../../workspace/boards/boards.component'

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
  public isNew = false;
  public version = {name:'', published_at:'', body:''};
  public week: Week = new Week(true, true, true, true, true, false, false);
  public workHoursInfo: WorkHoursInfo = new WorkHoursInfo('9', '10', '17', '10', this.week)
  public hourDay = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  public minuteHour = [0, 15, 30, 45];

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
    this.getTimeWork()
    this.getCurrentAccount()
    this.getAllAgiles()
    this.api.getVersionInfo().then(data => {
      this.version = data;
      if (data.tag_name != undefined && data.tag_name.replace("v","") !== versions.version){
        this.isNew = true
      }
    })
  } 

  public getTimeWork() {
    this.databaseService.getTimeWork().then(data => {
      for (let index in data) {
        if (data[index].name === 'startWorkHour') {
          this.workHoursInfo.timeStartHour = data[index].value
        }
        else if (data[index].name === 'startWorkMinute') {
          this.workHoursInfo.timeStartMinute = data[index].value
        }
        else if (data[index].name === 'endWorkHour') {
          this.workHoursInfo.timeEndHour = data[index].value
        }
        else if (data[index].name === 'endWorkMinute') {
          this.workHoursInfo.timeEndMinute = data[index].value
        }
        else if (data[index].name === 'dayWork') {
          for (let item in JSON.parse(data[index].value)) {
            this.week[item] = JSON.parse(data[index].value)[item]
          }
        }
      }
    })
  }

  public setTimeWork() {
    let dayWork = {}
    for (let item in this.week) {
      dayWork[item] = this.week[item] ? 1 : 0
    }
    this.databaseService.setTimeWorkAccount(JSON.stringify(dayWork), this.workHoursInfo.timeStartHour, this.workHoursInfo.timeStartMinute, this.workHoursInfo.timeEndHour, this.workHoursInfo.timeEndMinute)
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
        this.agiles = data
        this.agiles.forEach(agile => {
          this.getAgileVisibility(agile.name)          
        })
      }
    )
  }

  public async openInBrowser(url : string){
    shell.openExternal(url);
  }

  editNameOrUrl(account) {
    this.databaseService.editAccount(account).then(data => {
      this.toasterService.success('Account updated!')
    }, err => {
      this.toasterService.error('An error occured!')
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
      this.toasterService.success('Account removed!')
    }, err => {
      this.toasterService.error('An error occured!')            
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
          this.toasterService.success('Your changes have been saved!')          
        }
      }, err => {
        this.toasterService.error('An error occured!')            
      })
    })
  }

  public saveChanges(account) {
    this.updateAgilesVisibility()
    this.editNameOrUrl(account)
    this.backToWorkspace()
    this.setTimeWork()
  }

}
