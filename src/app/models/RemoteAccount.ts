export class RemoteAccount {
  public url : string;
  public token : string;
}

export class UserData {
  public fullName?: string;
  public email?: string;
}

export class Tasks {
  
}

export class IssueDetails {
  public id: string
  public entityId: string
  public comment: any
  public field: Array<FieldValue> 
  public tag: any
  public jiraId?: string
}

class FieldValue {
  public name: string
  public value: any
}

export class WorkItemData {
  public date: number
  public duration: number
  public issueId: string
  public summary: string
  public agile?: string
  public recordedTime = 0
  public startDate = Date.now();
}