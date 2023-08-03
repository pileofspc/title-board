// type Impossible<K extends keyof any> = {
//     [P in K]: never;
// };
// type NoExtraProperties<T, U extends T = T> = U &
//     Impossible<Exclude<keyof U, keyof T>>;
// type Color = "red" | "green" | "blue" | "amber" | "indigo";

declare type Color = import("~/stores/colors").Color;
declare type TitleStatus = import("~/stores/statuses").Status;

type Tag = {
    id?: string;
    color: Color;
    text: string;
};

type Position = {
    x: number;
    y: number;
};

type TitlePoster = {
    img?: string;
    link?: string;
    position?: Position;
};

type TitlePosterBlob = {
    img?: string;
    imgFileBase64?: string;
    link?: string;
    position?: Position;
};

type Title = {
    id: string;
    name: string;
    description: string;
    status: TitleStatus;
    rating: number;
    poster?: TitlePoster;
    tags: Tag[];
};
