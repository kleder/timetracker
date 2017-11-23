import { Injectable } from '@angular/core';
const sqlite3 = require('sqlite3')

@Injectable()
export class DatabaseService {
  public loader = false
  constructor(
  ) {}

  public getAllItems = () => {
    let that = this
    let db = new sqlite3.Database('database')
    return new Promise(resolve => {
      this.loader = true
      db.serialize(() => {
        db.all('SELECT * FROM `tasks`', function(err, rows) {
          that.loader = false
          db.close()
          resolve(rows)
          if (err) {
            that.loader = false
            db.close()       
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
    let db = new sqlite3.Database('database')
    db.serialize(function() {
      let stmt = db.prepare("INSERT INTO `tasks` (`published`, `agile`, `issueid`, `status`, `date`, `duration`, `lastUpdate`) VALUES (0, '" + issue.agile + "', '" + issue.id + "', '" + status + "', '" + date + "', " + duration + ", " + date + ")");
      stmt.run()
      stmt.finalize()
      console.log("item started ", stmt)
    });
    db.close()
  }

  public updateDuration = (duration, date) => {
    console.log("UPDATE // duration: ", duration)
    console.log("date", date)
    let db = new sqlite3.Database('database')
    new Promise(resolve => {
      db.serialize(() => {
        let stmt = db.prepare("UPDATE `tasks` SET `duration` = '" + duration + "', `lastUpdate` = '" + Date.now() + "' WHERE `date` = " + date)
        stmt.run()
        stmt.finalize()
        console.log("item duration updated ", duration)
      })
      db.close()
      resolve(true)
    })
  }

  public stopItem = (duration, date) => {
    let lastUpdate = Date.now()
    let db = new sqlite3.Database('database')
    db.serialize(function() {
      let stmt = db.prepare("UPDATE `tasks` SET `status` = 'stop', `duration` = " + duration + ", `lastUpdate` = " + lastUpdate + " WHERE `date` = " + date)
      stmt.run()
      stmt.finalize()
      console.log("item stopped ", stmt)
    });
    db.close()
  }

  public setIsPublished = (date) => {
    let db = new sqlite3.Database('database')
    db.serialize(function() {
      let stmt = db.prepare("UPDATE `tasks` SET `published` = '1' WHERE `date` = " + date)
      stmt.run()
      stmt.finalize()
      console.log("set `published` to 1", stmt)
    });
    db.close()
  }

  public setIsStopped = (date) => {
    let db = new sqlite3.Database('database')
    db.serialize(function() {
      let stmt = db.prepare("UPDATE `tasks` SET `status` = 'stop' WHERE `date` = " + date)
      stmt.run()
      stmt.finalize()
      console.log("set `status` to 'stop'", stmt)
    });
    db.close()
  }

  public deleteItem = (item) => {
    let db = new sqlite3.Database('database')
    new Promise(resolve => {
      db.serialize(() => {
        let stmt = db.prepare("DELETE FROM `tasks` WHERE `date` = " + item.date)
        stmt.run()
        stmt.finalize()
      })
      db.close()
    })
  }

}

