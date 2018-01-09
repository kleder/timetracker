import { Injectable } from '@angular/core';
import { RemoteAccount, WorkItemData } from '../models/RemoteAccount';
import { reject } from 'q';
import * as fs from "fs";
import { from } from 'rxjs/observable/from';
const sqlite3 = require('sqlite3').verbose()
const path = require('path')


@Injectable()
export class DatabaseService {
  public loader = false
  public db 
  constructor(
  ) {
    var envPath = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    if (envPath == undefined){
      envPath= __dirname;
    }
    var folder = path.resolve(envPath, '.trec')
    try{
      fs.mkdirSync(folder)
    } catch(e){
    }
    var dbPath = path.resolve(folder,'database')
    this.db = new sqlite3.Database(dbPath, (data) => {
      if (data == null){
        this.db.run("CREATE TABLE IF NOT EXISTS `tasks` (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `published` TEXT, `agile` TEXT, `issueid` TEXT, `status` TEXT, `date` INTEGER, `duration` INTEGER, `lastUpdate` TEXT )");
        this.db.run("CREATE TABLE IF NOT EXISTS `account` (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `name` TEXT, `url` TEXT, `token` TEXT, `current` INTEGER)");
        this.db.run("CREATE TABLE IF NOT EXISTS `variables` (id INTEGER NOT NULL PRIMARY KEY, `name` TEXT UNIQUE, `value` INTEGER)");     
        this.db.run("CREATE TABLE IF NOT EXISTS `boards_states` (id INTEGER NOT NULL PRIMARY KEY, `accountId` INT, `boardName` TEXT, `state` TEXT, `hexColor` TEXT)");   
        this.db.run("CREATE UNIQUE INDEX BOARDS_INDEX ON boards_states (accountId, boardName, state)");
        this.db.run("CREATE TABLE IF NOT EXISTS `boards_visibility` (id INTEGER NOT NULL PRIMARY KEY, `accountId` INT, `boardName` TEXT, `visible` INTEGER)");        
        this.db.run("CREATE UNIQUE INDEX BOARDS_CHOOSE ON boards_visibility (accountId, boardName)");        
        this.variablesInit()
      } 
      this.db.run("ALTER TABLE `tasks` ADD COLUMN Summary TEXT;");  
      this.db.run("ALTER TABLE `account` ADD COLUMN current INTEGER;");     
    })
  }

  public async getAllItems() : Promise<any[]> {
    let that = this
    return new Promise<any[]>((resolve, reject) => {
      this.loader = true
      this.db.serialize(() => {
        that.db.all('SELECT * FROM `tasks`', function(err, rows) {
          that.loader = false
          if (err) {
              that.loader = false   
              console.log("err: ", err)
              reject(err)
            } else {
              resolve(rows)
            }
        })
      })
    })
  }

  public startItem = (issue : WorkItemData) => {
    let that = this
    let status = "start"
    let duration = 0
    this.db.serialize(function() {
      let stmt = that.db.prepare("INSERT INTO `tasks` (`published`, `agile`, `issueid`, `status`, `date`, `duration`, `lastUpdate`,`summary`) VALUES (0, '" + issue.agile + "', '" + issue.issueId + "', '" + status + "', '" + issue.date + "', '" + duration + "', '" + issue.date + "','"+ issue.summary +"')");
      stmt.run()
      stmt.finalize()
    });
  }


   public getRecordedTime(issueId : string): Promise<number> {
      var now = new Date();
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return new Promise<number>((resolve, reject) => {
      if (issueId == undefined){
        reject("isseId can't be blank");
      }
      this.db.serialize(() => {
        this.db.get('SELECT SUM(duration) as duration FROM `tasks` where `issueid` = \''+ issueId + "' and `date` > '" + today +"' ", function(err, row) {
          if (err) {
              reject(err)
            } else {
              if (row)
                resolve(row['duration'])
              resolve(0)
            }
        })
      })
    })
  }

  public updateDuration = (duration:number, date: number) => {
    let that = this
    console.log("UPDATE // duration: ", duration)
    console.log("date", date)
    new Promise((resolve,reject) => {
      this.db.serialize(() => {
        let stmt = that.db.prepare("UPDATE `tasks` SET `duration` = '" + duration + "', `lastUpdate` = '" + Date.now() + "' WHERE `date` = '" + date + "'")
        stmt.run((err)=>{
          if (!err){
            console.log("item duration updated ", duration)
            resolve(true)
          } else {
            reject(err)
          }
        })
        stmt.finalize()
        
        
      })
      
    })
  }

  public stopItem = (duration, date) => {
    let that = this
    let lastUpdate = Date.now()
    this.db.serialize(function() {
      let stmt = that.db.prepare("UPDATE `tasks` SET `status` = 'stop', `duration` = " + duration + ", `lastUpdate` = " + lastUpdate + " WHERE `date` = " + date)
      stmt.run()
      stmt.finalize()
      console.log("item stopped ", stmt)
    });
  }

  public setIsPublished = (date) => {
    let that = this
    this.db.serialize(function() {
      let stmt = that.db.prepare("UPDATE `tasks` SET `published` = '1' WHERE `date` = " + date)
      stmt.run()
      stmt.finalize()
      console.log("set `published` to 1", stmt)
    });
  }

  public setIsStopped = (date) => {
    let that = this
    this.db.serialize(function() {
      let stmt = that.db.prepare("UPDATE `tasks` SET `status` = 'stop' WHERE `date` = " + date)
      stmt.run()
      stmt.finalize()
      console.log("set `status` to 'stop'", stmt)
    });
  }

  public deleteItem = (item) => {
    let that = this
    new Promise(resolve => {
      this.db.serialize(() => {
        let stmt = that.db.prepare("DELETE FROM `tasks` WHERE `date` = " + item.date)
        stmt.run()
        stmt.finalize()
      })
    })
  }

  public getAccount(youtrack : string) : Promise<RemoteAccount> {
    return new Promise<RemoteAccount>((resolve, reject) => {
      if (youtrack == undefined){
        reject("Youtrack url can't be blank");
      }
      this.db.serialize(() => {
        this.db.get('SELECT * FROM `account` where `url` = \''+ youtrack + "'", function(err, row) {
          if (err) {
              reject(err)
            } else {
              console.log(row);
              resolve(row)
            }
        })
      })
    })
  }

  public getAccounts = () : Promise<RemoteAccount[]> => {
    return new Promise<RemoteAccount[]>((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all('SELECT * FROM `account`', (err, rows) => {
          if (err) {
              reject(err)
            } else {
              resolve(rows)
            }
        })
      })
    })
  }

  public destroyCurrentAccount = () => {
    this.db.serialize(() => {
      let stmt = this.db.prepare("UPDATE `account` SET `current` = 0");
      stmt.run()
      stmt.finalize()
    })
  }

  public setCurrentAccount = (accountId) => {
    this.db.serialize(() => {
      let stmt = this.db.prepare("UPDATE `account` SET `current` = 1 WHERE `id` = '" + accountId + "'");
      stmt.run()
      stmt.finalize()
    })
  }

  public addAccount = (item : RemoteAccount) => {
    this.db.serialize(() => {
      let stmt = this.db.prepare("UPDATE `account` SET `current` = 0");
      stmt.run()
      stmt.finalize()
      let stmt2 = this.db.prepare("INSERT INTO `account` (`name`, `url`, `token`, `current`) VALUES ('" + item.name + "','" + item.url + "','" + item.token + "', '" + 1 + "')");
      stmt2.run()
      stmt2.finalize()
    });
  }

  public editAccount = (item) => {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        let stmt = this.db.prepare("UPDATE `account` SET `name` = '" + item.name + "', `url` = '" + item.url + "' WHERE `id` = " + item.id)
        stmt.run((err) => {
          if (!err) {
            resolve(true)
          } else {
            reject(err)
          }
        })
        stmt.finalize()  
      })
    })
  }

  public changeAccountToken = (accountId, newToken) => {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        let stmt = this.db.prepare("UPDATE `account` SET `token` = '" + newToken + "' WHERE `id` = " + accountId)
        stmt.run((err) => {
          if (!err) {
            resolve(true)
          } else {
            reject(err)
          }
        })
        stmt.finalize()  
      })
    })
  }

  public deleteAccount = (id) => {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        let stmt = this.db.prepare("DELETE FROM `account` WHERE `id` = " + id)
        stmt.run((err) => {
          if (!err) {
            resolve(true)
          } else {
            reject(err)
          }
        })
        stmt.finalize()  
      })
    })
  }

  public variablesInit = () => {
    this.saveVariable({name: 'hide_hints', value: 0})    
  }

  public saveVariable = (variable) => {
    this.db.serialize(() => {
      let stmt = this.db.prepare("INSERT OR IGNORE INTO `variables` (`name`, `value`) VALUES ('" + variable.name + "','" + variable.value + "')");
      stmt.run()
      stmt.finalize()
    });
  }
  
  public updateVariable = (variable) => {
    let that = this
    this.db.serialize(() => {
      let stmt = that.db.prepare("UPDATE `variables` SET `value` = '" + variable.value + "' WHERE `name` = '" + variable.name + "'")
      stmt.run()
      stmt.finalize()
    });
  }
  
  public getVariables = () => {
    let that = this
    return new Promise<any[]>((resolve, reject) => {
      this.db.serialize(() => {
        that.db.get('SELECT * FROM `variables`', function(err, row) {
          if (err) {
              reject(err)
            } else {
              resolve(row)
            }
        })
      })
    })
  }

  public saveBoardStates(accountId, boardName, state) {
    let that = this
    this.db.serialize(() => {
      let stmt = that.db.prepare("INSERT OR IGNORE INTO `boards_states` (`accountId`, `boardName`, `state`, `hexColor`) VALUES ( '" + accountId + "', '" + boardName + "','" + state + "', '')");
      stmt.run()
      stmt.finalize()
    });
  }

  public getBoardStates(accountId, boardName) {
    return new Promise<any[]>((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all("SELECT * FROM `boards_states` WHERE `accountId` = '" + accountId + "' AND `boardName` = '" + boardName + "'", function(err, row) {
          if (err) {
            throw(err)
          } else {
            console.log("row", row)
            resolve(row)
          }
        })
      })
    })
  }

  public getAllBoardStates(accountId) {
    return new Promise<any[]>((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all("SELECT * FROM `boards_states` WHERE `accountId` = '" + accountId + "'", function(err, row) {
          if (err) {
            reject(err)
          } else {
            resolve(row)
          }
        })
      })
    })
  }

  public changeBoardStates(accountId, boardName, state, color) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        let stmt = this.db.prepare("UPDATE `boards_states` SET `hexColor` = '" + color + "' WHERE `accountId` = '" + accountId + "' AND boardName = '" + boardName + "' AND state = '" + state + "'")
        stmt.run((err)=>{
          if (!err){
            console.log("Color updated to ", color)
            resolve(true)
          } else {
            reject(err)
          }
        })
        stmt.finalize()
      });
    })
  }

  public initBoardVisibility(accountId, boardName, visibility) {
    let that = this
    this.db.serialize(() => {
      let stmt = that.db.prepare("INSERT OR IGNORE INTO `boards_visibility` (`accountId`, `boardName`, `visible`) VALUES ( '" + accountId + "', '" + boardName + "','" + visibility + "')");
      stmt.run()
      stmt.finalize()
    });
  }

  public getBoardVisibilities(accountId, boardName) {
    return new Promise<any[]>((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all("SELECT * FROM `boards_visibility` WHERE `accountId` = '" + accountId + "' aND `boardName` = '" + boardName + "'", function(err, row) {
          if (err) {
            reject(err)
          } else {
            resolve(row)
          }
        })
      })
    })
  }

  public updateBoardVisibility(accountId, boardName, visibility) {
    return new Promise<any>((resolve, reject) => {      
      let that = this
      this.db.serialize(() => {
        let stmt = that.db.prepare("UPDATE `boards_visibility` SET `visible` = '" + visibility + "' WHERE `accountId` = '" + accountId + "' AND `boardName` = '" + boardName + "'");
        stmt.run((err)=>{
          if (!err){
            resolve(true)
          } else {
            reject(err)
          }
        })
        stmt.finalize()
      });
    })
  }

}