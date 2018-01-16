import { MenuItemConstructorOptions, app, shell } from "electron";


export class CustomMenu {

  initMenu(app, mainWindow) {
    let template : MenuItemConstructorOptions[] = [
      {
        label: 'Workspace',
        click() {
          mainWindow.webContents.executeJavaScript('window.location="#/tracking"')
        }
      },
      {
        label: 'Accounts',
        submenu: [
          {
            label: 'Add Account',
            click() {
              mainWindow.webContents.executeJavaScript('window.location="#/add-account?firstAccount=false"')
            }
          },
          { 
            label: 'Accounts',
            click() {
              mainWindow.webContents.executeJavaScript('window.location="#/accounts"')
            }
          }
        ]
      },
      {
        label: 'About',
        click() {
          mainWindow.webContents.executeJavaScript('window.location="#/about-trec"')
        }
      },
      {
        label: 'Licences',
        click() {
          mainWindow.webContents.executeJavaScript('window.location="#/licenses"')
        }
      },
      {
        label: 'Report an issue',
        click() {
          shell.openExternal('https://github.com/kleder/timetracker/issues/new');          
        }
      },
      { type:'separator' },
      {
        label: 'Quit',
        click() {
          app.quit()
        }
      }
    ]
    return template
  }

}