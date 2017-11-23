import { Injectable } from '@angular/core';
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const dbPath = path.resolve(__dirname, 'database')


@Injectable()
export class DatabaseService {
  public loader = false
  public db = new sqlite3.Database(dbPath)
  constructor(
  ) {}

  public getAllItems = () => {
    let that = this
    console.log("dbPath", dbPath)
    return new Promise(resolve => {
      this.loader = true
      this.db.serialize(() => {
        this.db.all('SELECT * FROM `tasks`', function(err, rows) {
          that.loader = false
          resolve(rows)
          if (err) {
              that.loader = false   
              console.log("err: ", err)
              resolve(err)
            }
        })
      })
    })
  }

  public startItem = (issue, date) => {
    let status = "start"
    let duration = 0
    this.db.serialize(function() {
      let stmt = this.db.prepare("INSERT INTO `tasks` (`published`, `agile`, `issueid`, `status`, `date`, `duration`, `lastUpdate`) VALUES (0, '" + issue.agile + "', '" + issue.id + "', '" + status + "', '" + date + "', " + duration + ", " + date + ")");
      stmt.run()
      stmt.finalize()
      console.log("item started ", stmt)
    });
  }

  public updateDuration = (duration, date) => {
    console.log("UPDATE // duration: ", duration)
    console.log("date", date)
    new Promise(resolve => {
      this.db.serialize(() => {
        let stmt = this.db.prepare("UPDATE `tasks` SET `duration` = '" + duration + "', `lastUpdate` = '" + Date.now() + "' WHERE `date` = " + date)
        stmt.run()
        stmt.finalize()
        console.log("item duration updated ", duration)
      })
      resolve(true)
    })
  }

  public stopItem = (duration, date) => {
    let lastUpdate = Date.now()
    this.db.serialize(function() {
      let stmt = this.db.prepare("UPDATE `tasks` SET `status` = 'stop', `duration` = " + duration + ", `lastUpdate` = " + lastUpdate + " WHERE `date` = " + date)
      stmt.run()
      stmt.finalize()
      console.log("item stopped ", stmt)
    });
  }

  public setIsPublished = (date) => {
    this.db.serialize(function() {
      let stmt = this.db.prepare("UPDATE `tasks` SET `published` = '1' WHERE `date` = " + date)
      stmt.run()
      stmt.finalize()
      console.log("set `published` to 1", stmt)
    });
  }

  public setIsStopped = (date) => {
    this.db.serialize(function() {
      let stmt = this.db.prepare("UPDATE `tasks` SET `status` = 'stop' WHERE `date` = " + date)
      stmt.run()
      stmt.finalize()
      console.log("set `status` to 'stop'", stmt)
    });
  }

  public deleteItem = (item) => {
    new Promise(resolve => {
      this.db.serialize(() => {
        let stmt = this.db.prepare("DELETE FROM `tasks` WHERE `date` = " + item.date)
        stmt.run()
        stmt.finalize()
      })
    })
  }

}

