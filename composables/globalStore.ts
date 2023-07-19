export const useColor = () => useState<string>("color", () => "blue-grey");
export const useColors = () =>
    useState<string[]>("colors", () => [
        "red",
        "green",
        "blue",
        "indigo",
        "amber",
    ]);
