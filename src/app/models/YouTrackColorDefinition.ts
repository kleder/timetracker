export class YouTrackColorDefinition {
    static colors: string[] = [
        "",
        "#8d5100",
        "#ce6700",
        "#409600",
        "#0070e4",
        "#900052",
        "#0050a1",
        "#2f9890",
        "#8e1600",
        "#dc0083",
        "#7dbd36",
        "#ff7123",
        "#ff7bc3",
        "#fed74a",
        "#b7e281",
        "#d8f7f3",
        "#e6e6e6",
        "#e6f6cf",
        "#ffee9c",
        "#ffc8ea",
        "#e30000",
        "#e0f1fb",
        "#fce5f1",
        "#f7e9c1",
        "#92e1d5",
        "#a6e0fc",
        "#e0c378",
        "#bababa",
        "#25beb2",
        "#42a3df",
        "#878787",
        "#4d4d4d",
        "#246512",
        "#00665e",
        "#553000",
        "#1a1a1a" 
    ]


    public static get(index: number) : string {
        return YouTrackColorDefinition.colors[index]; 
    }
}