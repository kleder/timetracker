import { Board } from "./Board";

export class Issue {
    public id: number;

    public timeTrackerId: string;
    public boardId : number;
    public visibleId: string;
    public summary: string;
    public sprint: string;
    public numberOfComments: number;
    public todaysTime: number = 0;
    public description: string;

    public state: string;
    public priority: string;
    public type: string

    public url: string
    public estimation: string;


    get hasDescription() {
        return this.description != undefined && this.description.length > 0;
    }

    public static createFromJira(model: any) : Issue {
        var issue =  new Issue();
        issue.timeTrackerId = model.id;
        issue.visibleId = model.key;
        issue.summary = model.fields.summary;
        issue.numberOfComments = model.fields.comment.comments.length;
        issue.priority = model.fields.priority.name;
        issue.state = model.fields.status.name;
        issue.description = model.fields.description;
        issue.estimation = String(Number(model.fields.timeestimate)/60)
        issue.url = "/browse/" + issue.visibleId;
        return issue;
    }

    public static createFromYouTrack(model: any) : Issue {
        var issue =  new Issue();
        issue.timeTrackerId = issue.visibleId = model.id;
        issue.summary = this.GetValue(model, "summary");
        issue.numberOfComments = model.comment.length;
        issue.state = this.GetState(model);
        issue.priority = this.GetValue(model, "Priority")[0]
        issue.type = this.GetValue(model, "Type")[0]
        issue.description = this.GetValue(model, "description"); 
        issue.estimation = this.GetValue(model, "Estimation");
        issue.url = "/issue/" + issue.timeTrackerId;
        return issue;
    }

    public static createToYouTrack(issue: Issue, board: Board) {
        let result = { project: '', summary: '', description: ''};
        result.project = board.timeTrackerProjectId;
        result.summary = issue.summary;
        result.description = issue.description;

        return result;
    }

    private static hasValue(value: string) : boolean {
        return value != undefined && value.length > 0;
    }


    private static GetValue(model, property: string) {
        var field = model.field.find(s => s.name === property);
        if(field != undefined) return field.value;
        return undefined;
    }

    private static GetState(model){
        var state =  this.GetValue(model, "State");
        if(state != undefined) return state[0];
        var stage =  this.GetValue(model, "Stage");
        return stage[0];
    }
}