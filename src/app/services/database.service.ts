import { Injectable } from '@angular/core';
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const dbPath = path.resolve(__dirname, 'database')


@Injectable()
export class DatabaseService {
  public loader = false
  public db = new sqlite3.Database(dbPath)
  constructor(
  ) {
    this.db.run("CREATE TABLE IF NOT EXISTS `tasks` (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `published` TEXT, `agile` TEXT, `issueid` TEXT, `status` TEXT, `date` TEXT, `duration` INTEGER, `lastUpdate` TEXT )");
  }

  public getAllItems = () => {
    let that = this
    console.log("dbPath", dbPath)
    return new Promise(resolve => {
      this.loader = true
      this.db.serialize(() => {
        that.db.all('SELECT * FROM `tasks`', function(err, rows) {
          that.loader = false
          if (err) {
              that.loader = false   
              console.log("err: ", err)
              resolve(err)
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

}

