interface ArrayConstructor {
    isArray(arg: ReadonlyArray<any> | any): arg is ReadonlyArray<any>;
}

type Timer = ReturnType<typeof setTimeout>;

type Expand<T> = T extends (...args: infer A) => infer R
    ? (...args: Expand<A>) => Expand<R>
    : T extends infer O
      ? { [K in keyof O]: O[K] }
      : never;
type ExpandRecursively<T> = T extends (...args: infer A) => infer R
    ? (...args: ExpandRecursively<A>) => ExpandRecursively<R>
    : T extends object
      ? T extends infer O
          ? { [K in keyof O]: ExpandRecursively<O[K]> }
          : never
      : T;
type AwaitedFix<T> = T extends PromiseLike<infer U> ? AwaitedFix<U> : T;
type Overwrite<T, U> = Omit<T, keyof U> & U;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type DeepCopy<T> = T extends string | number | boolean | null
    ? T
    : T extends (infer U)[]
      ? DeepCopy<U>[]
      : T extends Record<PropertyKey, any>
        ? {
              [K in keyof T as T[K] extends Function ? never : K]: DeepCopy<
                  T[K]
              >;
          }
        : never;

type Colors = import("~/constants").Colors;
type Color = Colors[number];
type TitleStatuses = import("~/constants").TitleStatuses;
type TitleStatus = TitleStatuses[keyof TitleStatuses];

type Tag = {
    title_uuid: string;
    uuid: string;
    color: Color;
    text: string;
};
type TagPartial = PartialBy<Tag, "uuid" | "title_uuid">;

// TODO:
// Переделать типы более осознанно и синхронизировать с бэковыми

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
    uuid: string;
    name: string;
    description: string;
    status: TitleStatus;
    rating?: number;
    poster?: TitlePoster;
    tags: Tag[];
};
type TitlePartial = Overwrite<
    PartialBy<Title, "uuid" | "id">,
    {
        tags: TagPartial[];
    }
>;

type TitleServer = {
    uuid: string;
    id: string;
    name: string;
    description: string;
    status: TitleStatus;
    rating?: number | null;
    link?: string | null;
    img?: string | null;
    pos_x?: number | null;
    pos_y?: number | null;
    tags: Tag[];
};
type TitleServerPartial = Overwrite<
    PartialBy<TitleServer, "uuid" | "id">,
    { tags: TagPartial[] }
>;

type CustomQuery<T> = import("~/server/utils/db").CustomQuery<T>;
type SqlClient = {
    query<T>(customQuery: CustomQuery<T>): Promise<T>;
    release(): void;
};
