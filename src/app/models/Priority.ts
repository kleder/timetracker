import { YouTrackColorDefinition } from "./YouTrackColorDefinition";

export class Priority {
    public projectId: number;
    public name: string;
    public hexColor: string;

    public static createFromYouTrack(model: any) : Priority {
        var result = new Priority();
        result.name = model.value;
        result.hexColor = YouTrackColorDefinition.get(model.colorIndex);
        //todo: board can be shared between projects
        return result;
    }
}