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
    if (envPath == undefined) {
      envPath = __dirname;
    }
    var folder = path.resolve(envPath, '.trec')
    try {
      fs.mkdirSync(folder)
    } catch (e) {}

    this.db = new sqlite3.Database(path.resolve(folder, 'database'))
    let pathOfSystem = (process.platform == 'win32') ? "\\" : "/"
    const location = path.resolve('./migrations')
    let that = this

    fs.readdir(location, (err, files) => {
      const sqlMigration = ('' + files).split(',')

      that.db.run("CREATE TABLE IF NOT EXISTS `migrations`(`id` INTEGER NOT NULL PRIMARY KEY, `name` TEXT)");
      that.db.serialize(() => {
        that.db.all('SELECT `name` FROM `migrations`', (err, rows) => {
          if (err) {
            reject(err)
          }
          for (let i = 0; i < sqlMigration.length; i++) {
            fs.readFile(location + pathOfSystem + sqlMigration[i], 'utf8', function (err, data) {
              if (!rows[i]) {
                that.db.run("INSERT INTO `migrations` (`name`) VALUES ('" + sqlMigration[i] + "')");
                that.db.exec(data)
              }
            })
          }
        })
      })
    });
  }

  public async getAllItems(accountId): Promise<any[]> {
    let that = this
    return new Promise<any[]>((resolve, reject) => {
      this.loader = true
      this.db.serialize(() => {
        that.db.all("SELECT * FROM `tasks` WHERE `accountId` = '" + accountId + "'", function (err, rows) {
          that.loader = false
          if (err) {
            that.loader = false
            console.error(err)
            reject(err)
          } else {
            resolve(rows)
          }
        })
      })
    })
  }

  public startItem = (issue: WorkItemData) => {
    let that = this
    let status = "start"
    let duration = 0
    this.db.serialize(function () {
      let stmt = that.db.prepare("INSERT INTO `tasks` (`accountId`, `published`, `agile`, `issueid`, `status`, `date`, `duration`, `lastUpdate`,`summary`) VALUES ('" + issue.accountId + "', 0, '" + issue.agile + "', '" + issue.issueId + "', '" + status + "', '" + issue.date + "', '" + duration + "', '" + issue.date + "','" + issue.summary + "')");
      stmt.run()
      stmt.finalize()
    });
  }


  public getRecordedTime(issueId: string): Promise<number> {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return new Promise<number>((resolve, reject) => {
      if (issueId == undefined) {
        reject("isseId can't be blank");
      }
      this.db.serialize(() => {
        this.db.get('SELECT SUM(duration) as duration FROM `tasks` where `issueid` = \'' + issueId + "' and `date` > '" + today + "' ", function (err, row) {
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

  public updateDuration = (duration: number, date: number) => {
    let that = this
    new Promise((resolve, reject) => {
      this.db.serialize(() => {
        let stmt = that.db.prepare("UPDATE `tasks` SET `duration` = '" + duration + "', `lastUpdate` = '" + Date.now() + "' WHERE `date` = '" + date + "'")
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

  public stopItem = (duration, date) => {
    let that = this
    let lastUpdate = Date.now()
    this.db.serialize(function () {
      let stmt = that.db.prepare("UPDATE `tasks` SET `status` = 'stop', `duration` = " + duration + ", `lastUpdate` = " + lastUpdate + " WHERE `date` = " + date)
      stmt.run()
      stmt.finalize()
    });
  }

  public setIsPublished = (date) => {
    let that = this
    this.db.serialize(function () {
      let stmt = that.db.prepare("UPDATE `tasks` SET `published` = '1' WHERE `date` = " + date)
      stmt.run()
      stmt.finalize()
    });
  }

  public setIsStopped = (date) => {
    let that = this
    this.db.serialize(function () {
      let stmt = that.db.prepare("UPDATE `tasks` SET `status` = 'stop' WHERE `date` = " + date)
      stmt.run()
      stmt.finalize()
    });
  }

  public deleteItem = (date) => {
    let that = this
    new Promise(resolve => {
      this.db.serialize(() => {
        let stmt = that.db.prepare("DELETE FROM `tasks` WHERE `date` = " + date)
        stmt.run()
        stmt.finalize()
      })
    })
  }

  public getAccount(youtrack: string): Promise<RemoteAccount> {
    return new Promise<RemoteAccount>((resolve, reject) => {
      if (youtrack == undefined) {
        reject("Youtrack url can't be blank");
      }
      this.db.serialize(() => {
        this.db.get('SELECT * FROM `account` where `url` = \'' + youtrack + "'", function (err, row) {
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

  public getAccounts = (): Promise<RemoteAccount[]> => {
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

  public addAccount = (item: RemoteAccount) => {
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

  public getTimeWork() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all('SELECT * FROM `variables`', function (err, row) {
          if (err) {
            reject(err)
          } else {
            resolve(row)
          }
        })
      })
    })
  }

  public setTimeWorkAccount = (dayWork, startWorkHour = '0', startWorkMinute = '0', endWorkHour = '0', endWorkMinute = '0') => {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        let stmt1 = this.db.prepare("Update `variables` SET `value` = " + startWorkHour + " WHERE `name` = 'startWorkHour'")
        let stmt2 = this.db.prepare("Update `variables` SET `value` = " + startWorkMinute + " WHERE `name` = 'startWorkMinute'")
        let stmt3 = this.db.prepare("Update `variables` SET `value` = " + endWorkHour + " WHERE `name` = 'endWorkHour'")
        let stmt4 = this.db.prepare("Update `variables` SET `value` = " + endWorkMinute + " WHERE `name` = 'endWorkMinute'")
        let stmt5 = this.db.prepare("Update `variables` SET `value` = '" + dayWork + "' WHERE `name` = 'dayWork'")

        let err = (err) => {
          if (!err) {
            resolve(true)
          } else {
            reject(err)
          }
        }
        stmt1.run(err)
        stmt2.run(err)
        stmt3.run(err)
        stmt4.run(err)
        stmt5.run(err)

        stmt1.finalize()
        stmt2.finalize()
        stmt3.finalize()
        stmt4.finalize()
        stmt5.finalize()
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
        that.db.get('SELECT * FROM `variables`', function (err, row) {
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
        this.db.all("SELECT * FROM `boards_states` WHERE `accountId` = '" + accountId + "' AND `boardName` = '" + boardName + "'", function (err, row) {
          if (err) {
            throw (err)
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
        this.db.all("SELECT * FROM `boards_states` WHERE `accountId` = '" + accountId + "'", function (err, row) {
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
        stmt.run((err) => {
          if (!err) {
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
    return new Promise((resolve, reject) => {
      let that = this
      this.db.serialize(() => {
        let stmt = that.db.prepare("INSERT OR IGNORE INTO `boards_visibility` (`accountId`, `boardName`, `visible`) VALUES ( '" + accountId + "', '" + boardName + "','" + visibility + "')");
        stmt.run()
        stmt.finalize()
      });
    })
  }

  public getBoardVisibilities(accountId, boardName) {
    return new Promise<any[]>((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all("SELECT * FROM `boards_visibility` WHERE `accountId` = '" + accountId + "' aND `boardName` = '" + boardName + "'", function (err, row) {
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
        stmt.run((err) => {
          if (!err) {
            resolve(true)
          } else {
            reject(err)
          }
        })
        stmt.finalize()
      });
    })
  }

  public initAgilesChosen(accountId) {
    let that = this
    this.db.serialize(() => {
      let stmt = that.db.prepare("INSERT OR IGNORE INTO `boards_after_choose` (`accountId`, `afterChoose`) VALUES ( '" + accountId + "', '" + 0 + "')");
      stmt.run()
      stmt.finalize()
    });
  }

  public setAgilesChosen(accountId) {
    let that = this
    this.db.serialize(() => {
      let stmt = that.db.prepare("UPDATE `boards_after_choose` SET `afterChoose` = '" + 1 + "' WHERE `accountId` = '" + accountId + "'");
      stmt.run()
      stmt.finalize()
    });
  }

  public checkAgilesChosen(accountId) {
    return new Promise<any[]>((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all("SELECT * FROM `boards_after_choose` WHERE `accountId` = '" + accountId + "'", function (err, row) {
          if (err) {
            reject(err)
          } else {
            resolve(row)
          }
        })
      })
    })
  }

}