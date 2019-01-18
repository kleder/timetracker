export class JiraAccount {
    constructor(public name: string, 
      public url: string, 
      public consumerKey: string, 
      public accessToken: string, 
      public accessTokenSecret: string, 
      public consumerSecret: string){
    }
  }