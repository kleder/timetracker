import { Injectable } from '@angular/core';
import { Account } from '../../models/Account';
import { WorkItem } from '../../models/WorkItem';
import { Issue } from '../../models/Issue';
import { Board } from '../../models/Board';
import { Priority } from '../../models/Priority';


export interface ApiService {
  useAccount(remoteAccount?: Account): void;
  getAllProjects() : Promise<any>;
  getCommandSuggestions(id: string, command: any) : Promise<any>;
  executeCommand(id: string, command: any) : Promise<any>;
  createIssueOnBoard(data: Issue, board: Board) : Promise<void>;
  getAllBoards() : Promise<any>;
  getIssuesByProject(id) : Promise<any>;
  getIssuesByAgile(board: Board): Promise<any>;
  getIssue(id): Promise<any>;
  getSprintInfo(agile): Promise<any>;
  createWorkItem(data: WorkItem) : Promise<string>;
  getWorkItems(issueId) : Promise<any>;
  editWorkItem(workItem: WorkItem);
  deleteWorkItem(workItem: WorkItem);
  getTimeTrackingWorkTypes(projectId);
  getCurrentUser(remoteAccount: Account);
  getPriorities(projectId): Promise<Priority[]>;

}
