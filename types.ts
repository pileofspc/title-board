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

type Poster = {
    img?: string;
    link?: string;
};

type PosterBlob = {
    img?: string;
    link?: string;
    imgBlob?: File;
};

type Title = {
    id: string;
    name: string;
    description: string;
    status: TitleStatus;
    rating: number;
    poster?: Poster;
    tags: Tag[];
};
