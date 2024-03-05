export type Colors = typeof colors;
export const colors = ["red", "green", "blue", "indigo", "amber"] as const;
// TODO: Поменять везде цвета на primary, secondary и тд

export type TitleStatuses = typeof titleStatuses;
export const titleStatuses = {
    NOT_WATCHED: "NOT_WATCHED",
    WATCHED: "WATCHED",
    WANT_TO_WATCH: "WANT_TO_WATCH",
} as const;

export const statuses = {
    [titleStatuses.NOT_WATCHED]: {
        display: "Не просмотрено",
        color: "blue-grey",
    },
    [titleStatuses.WATCHED]: {
        display: "Просмотрено",
        color: "green",
    },
    [titleStatuses.WANT_TO_WATCH]: {
        display: "Хочу посмотреть",
        color: "orange",
    },
} as const;

// TODO: Убрать все захардкоженные строки, связанные с цветами и статусами

export const apiEndpoints = {
    titles: "http://localhost:3000/api/titles",
} as const;

export const mockTitle: Title = {
    id: "5",
    uuid: "86ec4dfb-7b8a-41cd-a7c4-32c67404a260",
    name: "asd",
    description: "Описание нового тайтла",
    status: "NOT_WATCHED",
    poster: {},
    tags: [],
};
