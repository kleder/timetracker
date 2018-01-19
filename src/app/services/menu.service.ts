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
  mainMenuTemplate:Array<any>
  constructor(
    private accountService: AccountService,
    public databaseService: DatabaseService,
    
  ) { 
  }

  public enabledWorkspace(arg:boolean) { 
    this.mainMenuTemplate = [ 
      {
        submenu: newMenu.initMenu(app, remote.getCurrentWindow())
      }
    ]
    this.addEditMenu()
    this.mainMenuTemplate[0].submenu[0].enabled = arg
    remote.Menu.setApplicationMenu(Menu.buildFromTemplate(this.mainMenuTemplate)) 
  }

  public enabledWorkspaceAndSwitchAccount(arg:boolean) { 
    this.mainMenuTemplate = [ 
      {
        submenu: newMenu.initMenu(app, remote.getCurrentWindow())
      }
    ]
    this.addEditMenu()
    this.mainMenuTemplate[0].submenu[0].enabled = arg    
    this.mainMenuTemplate[0].submenu[1].submenu[0].enabled = arg
    remote.Menu.setApplicationMenu(Menu.buildFromTemplate(this.mainMenuTemplate)) 
  }

  public addEditMenu() {
    if (process.platform == 'darwin') {
      this.mainMenuTemplate.push(
        {
          label: 'Edit',
          submenu: [
            {role: 'undo'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'selectall'}
          ]
        }
      )
    }
  }
  
}
