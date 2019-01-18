export class Project {
    public id: number;
    public name: string;
    public timeTrackerId: string
    public accountId: number;


    public static createFromYouTrack(model: any) : Project {
        var result = new Project();
        result.name = model.id;
        result.timeTrackerId = model.id;
        //todo: board can be shared between projects
        return result;
    }
}