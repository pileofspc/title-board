type DeepCopy<T> = T extends string | number | boolean | null
    ? T
    : T extends (infer U)[]
    ? DeepCopy<U>[]
    : T extends Record<PropertyKey, any>
    ? { [K in keyof T as T[K] extends Function ? never : K]: DeepCopy<T[K]> }
    : never;

type Color = import("~/constants").Colors[number];
type TitleStatuses = import("~/constants").TitleStatuses;
type TitleStatus = TitleStatuses[keyof TitleStatuses];

type Tag = {
    id: string;
    color: Color;
    text: string;
};

type Position = {
    x: number;
    y: number;
};

type TitlePoster = {
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
    rating?: number;
    poster?: TitlePoster;
    tags: Tag[];
};

type ApiResponse<T> =
    | {
          success: true;
          data: T;
      }
    | {
          success: false;
      };
