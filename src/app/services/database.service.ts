import { Injectable } from '@angular/core';
import { Account} from '../models/Account';
import { reject } from 'q';
import * as fs from "fs";
import { from } from 'rxjs/observable/from';
import { AccountType } from '../models/AccountType';
import { WorkItem } from '../models/WorkItem';
import { JiraAccount } from '../models/JiraAccount';
import { YouTrackAccount } from '../models/YouTrackAccount';
import { Board } from '../models/Board';
import { Issue } from '../models/Issue';
import { Project } from '../models/Project';
import { Priority } from '../models/Priority';
import { resolve } from 'path';

const sqlite3 = require('sqlite3').verbose()
const path = require('path')

type Callback = (model: any) => any;

@Injectable()
export class DatabaseService {
 
  public db
  constructor(
  ) {
    var folder = this.createTrecFolder();
    var dbPath = path.resolve(folder, 'database')
    this.initDatabase(dbPath);
  }

  public dbInit = () => {
    let that = this;
    this.db.serialize(() => {
      this.db.get("")
      this.db.run(that.getAccountDefinittion(), () => {
          console.log("account created")
          that.db.run(that.getBoardsDefinition(), () => {
            console.log("boards created")

            that.db.run(that.getTasksDefinition());
            that.db.run(that.getRecordsDefinition())
            that.db.run(that.getVariablesDefinition());
            that.db.run(that.getProjectsDefinition());
            that.db.run(that.getPrioritiesDefinition());
          });
      });
    })
  }


  private getAccountDefinittion(): string {
    return "CREATE TABLE IF NOT EXISTS `account` \
          (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, \
           `name` TEXT, \
           `url` TEXT, \
           `youtrackToken` TEXT, \
           `jiraConsumerKey` TEXT,\
           `jiraAccessToken` TEXT, \
           `jiraAccessTokenSecret` TEXT, \
           `jiraConsumerSecret` TEXT, \
           `type` INTEGER, \
           `current` INTEGER)"
  }

  private getBoardsDefinition(): string {
    return "CREATE TABLE IF NOT EXISTS `boards` ( \
              id INTEGER NOT NULL PRIMARY KEY,  \
              `accountId` INTEGER, \
              `name` TEXT, \
              `timeTrackerId` TEXT, \
              `projectId` TEXT , \
              `isChecked` INTEGER, \
              `isHide` INTEGER, \
             FOREIGN KEY (`accountId`) \
                REFERENCES `account(id)` \
                ON DELETE CASCADE)    \
              "
  }
  
  private getTasksDefinition() : string {
    return "CREATE TABLE IF NOT EXISTS `tasks` ( \
              id INTEGER NOT NULL PRIMARY KEY,  \
              `timeTrackerId` TEXT,  \
              `boardId` INT,  \
              `visibleId` TEXT, \
              `summary` TEXT, \
              `sprint` TEXT,  \
              `numberOfComments` INT, \
              `description` TEXT,  \
              `state` TEXT,  \
              `priority` TEXT, \
              `type` TEXT, \
              `url` TEXT, \
              `estimation` TEXT, \
              FOREIGN KEY (`boardId`) \
              REFERENCES `boards(id)` \
              ON DELETE CASCADE )   \
            "
  }

  private getRecordsDefinition() : string {
    return "CREATE TABLE IF NOT EXISTS `records` ( \
              id INTEGER NOT NULL PRIMARY KEY,  \
              `startDate` TEXT,  \
              `endDate` TEXT, \
              `issueId` INT, \
              `timeTrackerId` TEXT,  \
              `comment` TEXT,  \
              `lastUpdate` TEXT, \
              `duration` INT)"
  }

  private getVariablesDefinition(): string {
    return "CREATE TABLE IF NOT EXISTS `variables` ( \
              id INTEGER NOT NULL PRIMARY KEY,  \
              `name` TEXT, \
              `value` INTEGER)"
  }

  private getProjectsDefinition() : string {
    return "CREATE TABLE IF NOT EXISTS `projects` ( \
              id INTEGER NOT NULL PRIMARY KEY, \
              `name` TEXT, \
              `accountId` TEXT, \
              `timeTrackerId` TEXT, \
              FOREIGN KEY (accountId) \
              REFERENCES account(id) \
              ON DELETE CASCADE)    \
            "
              ;
  }
  
  private getPrioritiesDefinition(): string {
    return "CREATE TABLE IF NOT EXISTS `priorities` ( \
              id INTEGER NOT NULL PRIMARY KEY, \
              `name` TEXT, \
              `projectId` INT, \
              `accountId` TEXT , \
              `hexColor` TEXT,   \
              FOREIGN KEY (projectId) \
              REFERENCES projects(id) \
              ON DELETE CASCADE)    \
            "
  }

  public dropAllTables = () => {
    let that = this
    return new Promise<any[]>((resolve, reject) => {
      this.db.serialize(() => {
        that.db.all("select name from sqlite_master where type='table'", function (err, tables) {
          tables.forEach((table) => {
            that.db.run("DROP TABLE '" + table.name + "'", function(err, tabless) {
            })
          })
          resolve([])
        });
      })
    })
  }

  public recreateDb = () => {
    this.getAccounts().then((data) => {
      let accounts = data
      this.dropAllTables().then((data) => {
        this.dbInit()
        accounts.forEach((account) => {
          this.addAccount(account)
        })
      })
    })
  }

  private initDatabase(dbPath: any) {
    this.db = new sqlite3.Database(dbPath, (data) => {
      if (data == null) {
        this.db.all("SELECT * FROM `account` LIMIT 1", (err, rows) => {
          let tmp = this.db.run ('PRAGMA foreign_keys=on');
          console.log("aaaaa")
          console.log(tmp)
          if (err) {

            this.dbInit();
          }
        });
      }
    });
  }

  private createTrecFolder() {
    var envPath = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    if (envPath == undefined) {
      envPath = __dirname;
    }
    var folder = path.resolve(envPath, '.trec');
    try {
      fs.mkdirSync(folder);
    } catch (e) { }

    return folder;
  }

  private parseBool(value: boolean){
    return value ? 1 : 0
  }

  public addTask(issue: Issue): Promise<number>  {
    let insert = `INSERT INTO \`tasks\` 
          (\`timeTrackerId\`, 
          \`boardId\`, 
          \`visibleId\`, 
          \`summary\`,
          \`sprint\`, 
          \`numberOfComments\`, 
          \`description\`, 
          \`state\`, 
          \`priority\`,
          \`type\`, 
          \`url\`, 
          \`estimation\`) 
      VALUES (
          '${issue.timeTrackerId}',
          '${issue.boardId}',
          '${issue.visibleId}', 
          '${issue.summary}', 
          '${issue.sprint}', 
          '${issue.numberOfComments}', 
          '${issue.description}', 
          '${issue.state}', 
          '${issue.priority}',
          '${issue.type}', 
          '${issue.url}', 
          '${issue.estimation}')`

    return this.getTaskByTimeTrackerId(issue.timeTrackerId).then(issue => {

       
        return issue === undefined ? this.insert(insert) : this.updateTask(issue);
    });

   // return this.insert(insert);
  }

  private updateTask(issue:Issue) : Promise<number> {
    let statement = 
        `UPDATE \`tasks\` SET
              \`boardId\` =  '${issue.boardId}',
              \`visibleId\` = '${issue.visibleId}',
              \`summary\` = '${issue.summary}',
              \`sprint\` = '${issue.sprint}', 
              \`numberOfComments\` = '${issue.numberOfComments}', 
              \`description\` = '${issue.description}', 
              \`state\` =  '${issue.state}', 
              \`priority\` = '${issue.priority}',
              \`type\` = '${issue.type}', 
              \`url\` = '${issue.url}', 
              \`estimation\` = '${issue.estimation}' 
          WHERE \`timeTrackerId\` = '${issue.timeTrackerId}'`;

    return this.update(statement).then(() => new Promise<number>(resolve => resolve(issue.id)));
  }

  public addProject(project: Project) : Promise<number> {
   let statement =  
   `INSERT INTO \`projects\` 
        (\`name\`,
         \`timeTrackerId\`, 
         \`accountId\`) 
      VALUES (
        '${project.name}',
        '${project.timeTrackerId}', 
        '${project.accountId}')`
    
    return this.insert(statement);
  }

  public addPriority(priority: Priority, accountId: string, projectId: number): Promise<number> {
    let statement = 
    `INSERT INTO \`priorities\` 
        (\`name\`, 
        \`hexColor\`, 
        \`accountId\` , 
        \`projectId\`) 
      VALUES (
        '${priority.name}',
        '${priority.hexColor}', 
        '${accountId}', 
        '${projectId}')`

    return this.insert(statement);
  }

  public addWorkItem(workItem: WorkItem): Promise<number> {
    let statement =  
    `INSERT INTO \`records\` 
        (\`startDate\`, 
          \`issueId\`,
          \`timeTrackerId\`,
          \`comment\`,
          \`endDate\`,
          \`duration\`) 
        VALUES (
          '${workItem.startDate.getTime()}',
          '${workItem.issueId}', 
          '${workItem.timeTrackerId}', 
          '${workItem.comment}', 
          '0',
          '0')`
    
     return this.insert(statement);
  }

  public addBoard(accountId, board : Board): Promise<number> {
    let statement = 
    `INSERT INTO \`boards\` 
            (\`name\`, 
            \`accountId\`,
            \`timeTrackerId\`,
            \`projectId\`,
            \'isChecked\', 
            \`isHide\`) 
         VALUES  (
             '${board.name}', 
             '${accountId}',
             '${board.timeTrackerId}',
             '${board.projectId}', 
             '${this.parseBool(board.isChecked)}', 
             '${this.parseBool(board.isHide)}')`

    return this.insert(statement);
  }

  public addAccount(item: Account): Promise<number> {
    this.destroyCurrentAccount();

    return this.insert(this.getAddAccountStatement(item));
  } 

  private insert(stamentToExecute: string) : Promise<number>{
    let that = this;

    return new Promise<number>(resolve => {
      this.db.serialize(() => {
        let stmt = that.db.prepare(stamentToExecute).
        run(err => {
          resolve(stmt.lastID)
        })
        stmt.finalize();
      })
    })
  }

  public getTask(id: number): Promise<Issue> {

    let statement = 'SELECT * FROM `tasks` where `id` = \'' + id + "'";
    return this.get(statement);
  }

  public getTaskByTimeTrackerId(id: string): Promise<Issue> {

    let statement = 'SELECT * FROM `tasks` where `timeTrackerId` = \'' + id + "'";
    return this.get(statement);
  }

  public getBoard(id: number): Promise<Board> {

    let statement = 'SELECT * FROM `boards` where `id` = \'' + id + "'";
    return this.get(statement);
  }

  public getAccount(id: number): Promise<Account> {

    let statement = 'SELECT * FROM `account` where `id` = \'' + id + "'";
    return this.get(statement, p => this.getAccountObject(p));
  }

  private get(statement: string, creationCallback: Callback = undefined) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.get(statement, function(error, result) {
          if(error) reject(error)
          else  {
            creationCallback === undefined ? resolve(result) : resolve(creationCallback(result))
          }
        })
      })
    })
  }

  public getCurrentAccount(): Promise<Account> {

    let statement = 'SELECT * FROM `account` where `current` = \'' + 1 + "'";
    return this.get(statement, p => this.getAccountObject(p));
  }

  public getPriorities(accountId: number) : Promise<Priority[]> {
    let statement = 'SELECT * FROM `priorities` WHERE  `accountId` =  \''+ accountId + '\'';
    return this.getAll(statement);
  } 
  

  public getRecords() : Promise<WorkItem[]> {
    let statement = 'SELECT * FROM `records`';
    return this.getAll(statement, p => this.getRecord(p));
  }

  public getProjects() : Promise<Project[]> {
    let statement = 'SELECT * FROM `projects`';
    return this.getAll(statement);
  }

  private getAll(statement: string, creationCallback: Callback = undefined): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all(statement, (err, rows) => {
          if(err) reject(err);
          else if(creationCallback !== undefined) {
            let result = rows.map(element => creationCallback(element));
            resolve(result);
          } else {
            resolve(rows);
          }
        })
      });
    });
  }

  public getAccounts = (): Promise<Account[]> => {
    let statement = 'SELECT * FROM `account`';
    return this.getAll(statement, p => this.getAccountObject(p));
  }

  public getAllBoards = (accoundId): Promise<Board[]> => {
    let statement = 'SELECT * FROM `boards` WHERE \`accountId\` = ' + accoundId;
    return this.getAll(statement);
  }

  public getAllCheckedBoards = (accoundId): Promise<Board[]> => {
    let statement = 'SELECT * FROM `boards` WHERE \`isChecked\` = \'1\' AND \`accountId\` = ' + accoundId
    return this.getAll(statement);
  }

  private update(statement: string): Promise<boolean> {
    let that = this;

    return new Promise(resolve => {
      this.db.serialize(() => {
        let stmt = that.db.prepare(statement);
        stmt.run((err) => {
          if(!err) resolve(true);
        })

        stmt.finalize();
      })
    })
  }


  public deleteWorkItem(workItem: WorkItem): Promise<boolean> {
    let statement = "DELETE FROM `records` WHERE `id` = '" + workItem.id +"'";
    return this.update(statement);
  }

  public updateWorkItem(workItem: WorkItem) : Promise<boolean> {
    let statement = "UPDATE `records` SET `duration` = '" + workItem.duration + "', \
     `endDate` = '" + workItem.endDate.getTime() + "', `timeTrackerId` = '" +  workItem.timeTrackerId + "'  WHERE `id` = '" + workItem.id + "'";
    return this.update(statement);
  }


  public updateBoard(board: Board){
    let statement = "UPDATE `boards` SET `isChecked` = '" + this.parseBool( board.isChecked) + "' WHERE `timeTrackerId` = '" + board.timeTrackerId + "'";
    return this.update(statement);
  }

  public updateWorkItemLastUpdate(workItem: WorkItem){
    let statement = "UPDATE `records` SET `lastUpdate` = '" + workItem.lastUpdate.getTime()  + "' WHERE `id` = '" + workItem.id + "'";
    return this.update(statement); 
  }

  public updatePriority(priority: Priority, accountId: string, projectId: string){
    let statement = "UPDATE `priorities` SET `hexColor` = '" + priority.hexColor + 
    "' WHERE `timeTrackerId` = '" + projectId + "' AND `accountId` = \'" + accountId + "\' AND `name` = \'" + priority.name + "\'";
    return this.update(statement);
  }

private getRecord(model) : WorkItem {
  let item = new WorkItem();
  item.startDate = new Date(parseInt(model.startDate));
  item.endDate = new Date(parseInt(model.endDate));
  item.lastUpdate = new Date(parseInt(model.lastUpdate));
  item.timeTrackerId = model.timeTrackerId;
  item.issueId = model.issueId;
  item.duration = model.duration;
  item.id = model.id;

  return item;
}


  private getAccountObject(model): Account {

    if(model === undefined) return model;


    var result = new Account();
    result.type = AccountType[AccountType[model.type]];
    result.id = model.id;
    result.current = model.current;

    if(model.type == AccountType.Jira){
      result.Jira = this.getJiraAccount(model);
    } else {
      result.Youtrack = this.getYouTrackAccount(model);
    }

    return result;
  }

  private getJiraAccount(model: any) : JiraAccount{
    return new JiraAccount(model.name, model.url, model.jiraConsumerKey, model.jiraAccessToken, model.jiraAccessTokenSecret, model.jiraConsumerSecret);
  }

  private getYouTrackAccount(model: any) : YouTrackAccount {
    return new YouTrackAccount(model.name, model.url, model.youtrackToken)
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

  public updateAccount(item: Account): Promise<boolean> {
    return  this.update(this.getUpdateAccountStatement(item));
  }

  private getAddAccountStatement(account : Account) : string {
    if(account.type == AccountType.YouTrack){
      return this.getYouTrackAccountInsert(account)
    }

    return this.getJiraAccountInsert(account)
  }

  private getJiraAccountInsert(account: Account): string {
    return `INSERT INTO \`account\` 
              (\`name\`, 
              \`url\`, 
              \`jiraConsumerKey\`,
              \`jiraAccessToken\`, 
              \`jiraAccessTokenSecret\`,
              \`jiraConsumerSecret\`,
              \`type\`, 
              \`current\`) 
            VALUES (
              '${account.Jira.name}', 
              '${account.Jira.url}', 
              '${account.Jira.consumerKey}', 
              '${account.Jira.accessToken}', 
              '${account.Jira.accessTokenSecret}',
              '${account.Jira.consumerSecret}',
              '${account.type}',
              '1')`;
  }

  private getYouTrackAccountInsert(account: Account): string {
    return `INSERT INTO \`account\` 
              (\`name\`, 
              \`url\`, 
              \`youtrackToken\`,
              \`type\`, 
              \`current\`) 
            VALUES (
              '${account.Youtrack.name}', 
              '${account.Youtrack.url}', 
              '${account.Youtrack.token}', 
              '${account.type}', 
              '1')`;
  }

  private getUpdateAccountStatement(account : Account) : string {
    if(account.type == AccountType.YouTrack){
      return this.getUpdateYouTrackAccount(account)
    }
    return this.getUpdateJiraAccount(account);
  }

  public deleteAccount(id: number) : Promise<boolean> {
    let statement = "DELETE FROM `account` WHERE `id` = " + id;
    return this.update(statement);
  }

  private getUpdateJiraAccount(account: Account): string {
    return `UPDATE \`account\` (
               \`name\`,
               \`url\`, 
               \`jiraConsumerKey\`, 
               \`jiraAccessToken\`, 
               \`jiraAccessTokenSecret\`, 
               \`jiraConsumerSecret\`,
               \`type\`, 
               \`current\`) 
             VALUES (
               '${account.Jira.name}', 
               '${account.Jira.url}', 
               '${account.Jira.consumerKey}', 
               '${account.Jira.accessToken}', 
               '${account.Jira.accessTokenSecret}', 
               '${account.Jira.consumerSecret}',
               '${account.type}', 
               '1')`;
  }

  private getUpdateYouTrackAccount(account: Account): string {
    return `UPDATE \`account\` SET 
              \`name\` = '${account.Youtrack.name}', 
              \`url\` = '${account.Youtrack.url}', 
              \`youtrackToken\` = '${account.Youtrack.token}', 
              \`type\` = '${account.type}' 
            WHERE \`id\` = '${account.id}' `;
  }
}