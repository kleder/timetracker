import { Board } from "../../../models/Board";
import { Issue } from "../../../models/Issue";

export class BoardVm {
    public details: Board
  
    public tasks: Map<string, Issue> = new Map<string, Issue>();
  }