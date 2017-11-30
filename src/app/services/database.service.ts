import { Injectable } from '@angular/core';
import { RemoteAccount } from '../models/RemoteAccount';
import { reject } from 'q';
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
    var dbPath = path.resolve(folder,'database')
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (!err){
        this.db.run("CREATE TABLE IF NOT EXISTS `tasks` (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `published` TEXT, `agile` TEXT, `issueid` TEXT, `status` TEXT, `date` INTEGER, `duration` INTEGER, `lastUpdate` TEXT )");
        this.db.run("CREATE TABLE IF NOT EXISTS `account` (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `url` TEXT, `token` TEXT)");
      }
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

  public startItem = (issue, date) => {
    let that = this
    let status = "start"
    let duration = 0
    this.db.serialize(function() {
      let stmt = that.db.prepare("INSERT INTO `tasks` (`published`, `agile`, `issueid`, `status`, `date`, `duration`, `lastUpdate`) VALUES (0, '" + issue.agile + "', '" + issue.id + "', '" + status + "', '" + date + "', " + duration + ", " + date + ")");
      stmt.run()
      stmt.finalize()
      console.log("item started ", stmt)
    });
  }

  public updateDuration = (duration, date) => {
    let that = this
    console.log("UPDATE // duration: ", duration)
    console.log("date", date)
    new Promise(resolve => {
      this.db.serialize(() => {
        let stmt = that.db.prepare("UPDATE `tasks` SET `duration` = '" + duration + "', `lastUpdate` = '" + Date.now() + "' WHERE `date` = " + date)
        stmt.run()
        stmt.finalize()
        console.log("item duration updated ", duration)
      })
      resolve(true)
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

  public addAccount = (item : RemoteAccount) => {
    this.db.serialize(() => {
      let stmt = this.db.prepare("INSERT INTO `account` (`url`, `token`) VALUES ('" + item.url + "','" + item.token + "')");
      stmt.run()
      stmt.finalize()
    });
  }

  public deleteAccount = (id) => {
    this.db.serialize(() => {
      let stmt = this.db.prepare("DELETE FROM `account` WHERE `id` = " + id)
      stmt.run()
      stmt.finalize()  
    })
  }

}

