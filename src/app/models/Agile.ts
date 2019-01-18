import { JiraAccount } from "./JiraAccount";

export class Agile {
    public id: string;
    public name: string;
    
    public static createFromJira(model:any) : Agile {
        return Agile.createFromYouTrack(model);
    }

    public static createFromYouTrack(model: any) : Agile {
        var result = new Agile();
        result.id = model.id;
        result.name = model.name;
        return result;
    }
}