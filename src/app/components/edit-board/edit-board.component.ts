import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../../services/database.service'
import { ToasterService } from '../../services/toaster.service'

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.scss']
})
export class EditBoardComponent implements OnInit {
  public boardName: string
  public accountId: number
  public accountName: string
  public accountUrl: string
  public boardStates: any
  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public databaseService: DatabaseService,
    public toasterService: ToasterService
  ) { }

  ngOnInit() {
    this.activatedRoute
    .queryParams
    .subscribe(params => {
      this.boardName = params['boardName']
      this.accountId = params['accountId']
      this.accountName = params['accountName']
      this.accountUrl = params['accountUrl']
    });
    console.log("this.boardName", this.boardName)
    console.log("this.accountId", this.accountId)
    this.getBoardStates(this.accountId, this.boardName)
  }

  getBoardStates(accountId, boardName) {
    this.databaseService.getBoardStates(accountId, boardName).then(data => {
      console.log("data", data)
      this.boardStates = data
    })
  }

  updateStatesColors(boardStates) {
    for (let i = 0; i < boardStates.length; i++) {
      if (!/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(boardStates[i].hexColor)) {
        this.toasterService.showToaster('It isn\'t hex format!', 'error')          
        return false        
      }
    }
    boardStates.forEach((state) => {
      this.databaseService.changeBoardStates(state.accountId, state.boardName, state.state, state.hexColor).then(data => {
        this.toasterService.showToaster('Color has been changed!', 'success')      
      })
    })
    this.goBack()
  }

  changeBackground(bgColor) {
    return { 'background-color': bgColor };
  }

  goBack() {
    this.router.navigate(['/edit-account']);        
  }

}
