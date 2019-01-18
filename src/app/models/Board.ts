import { Project } from "./Project";

export class Board {
    public id: number;
    public name: string;
    public timeTrackerId: string
    public isHide: boolean;
    public projectId: number;
    public timeTrackerProjectId: string;
    public isChecked: boolean = false;
    public accountId: number;

    public projects: Project[];


    public static createFromJira(model:any) : Board {
        var result = new Board();
        result.name = model.name;
        result.timeTrackerId = model.id;
        return result;
    }

    public static createFromYouTrack(model: any) : Board {
        var result = new Board();
        result.name = model.name;
        result.timeTrackerId = model.id;
        result.projects = this.addProjects(model);
        //todo: board can be shared between projects 
        result.timeTrackerProjectId = model.projects[0].id
        return result;
    }

    private static addProjects(model: any): Project[] {
        let projects = []

        model.projects.forEach(project => projects.push(Project.createFromYouTrack(project)))
       
        return projects;
    }
}