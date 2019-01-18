import { YouTrackAccount } from "./YouTrackAccount";
import { JiraAccount } from "./JiraAccount";
import { AccountType } from "./AccountType";

export class Account {
   public  id: number; 
   public current : boolean;
   public Youtrack : YouTrackAccount;
   public Jira : JiraAccount;
   public type : AccountType;
 }





