import { Injectable } from '@angular/core';
import { CustomMenu } from '../../../src/Menu'
import { AccountService } from './account.service'
import { DatabaseService } from './database.service'

const newMenu = new CustomMenu();
const {remote} = require('electron')
const {Menu, MenuItem} = remote
const app = remote.app

@Injectable()
export class MenuService {
  accounts
  constructor(
    private accountService: AccountService,
    public databaseService: DatabaseService,
    
  ) { 
  }

  public enabledWorkspace(arg:boolean) {
    // this.accounts = await this.databaseService.getAccounts();
    // console.log("this.accounts", this.accounts)
    // let isCurrentAccountExists
    // this.accounts.forEach(account => {
    //   account.current? isCurrentAccountExists = true : ''
    // })    
    var mainMenuTemplate:Array<any> = [ 
      {
        submenu: newMenu.initMenu(app, remote.getCurrentWindow())
      }
    ]
    if (process.platform == 'darwin') {
      mainMenuTemplate.push(
        {
          label: 'Edit',
          submenu: [
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'selectall'}
          ]
        }
      )
    }
    mainMenuTemplate[0].submenu[0].enabled = arg
    console.log("remote.menuitem", remote.MenuItem[0])
    remote.Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate)) 
  }
  
}
