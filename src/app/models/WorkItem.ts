export class WorkItem {
    public id: number;
    public startDate: Date;
    public timeTrackerId: string;
    public endDate: Date;
    public lastUpdate: Date;
    public issueId: number;
    public isSynced: boolean;
    public duration: number;

    public comment: string;

    constructor() {
        this.comment = "Added by T-Rec App";
    }

    public getKey() : string {
        return `${this.startDate.getUTCFullYear()}-${this.startDate.getUTCMonth() + 1}-${this.startDate.getUTCDate()}`
    }

}