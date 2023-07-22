// type Impossible<K extends keyof any> = {
//     [P in K]: never;
// };

// type NoExtraProperties<T, U extends T = T> = U &
//     Impossible<Exclude<keyof U, keyof T>>;
// type Color = "red" | "green" | "blue" | "amber" | "indigo";

declare type Color = import("~/stores/colors").Color;

interface Tag {
    id: string;
    color: Color;
    text: string;
}

interface Title {
    id: string;
    // name: string;
    // description: string;
    // status: "watched" | "not-watched";
    rating: number;
    // img: string;
    // link: string;

    tags: Tag[];
}
