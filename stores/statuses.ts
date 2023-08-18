const statuses = {
    NOT_WATCHED: {
        name: "NOT_WATCHED",
        display: "Не просмотрено",
        color: "blue-grey",
    },
    WATCHED: {
        name: "WATCHED",
        display: "Просмотрено",
        color: "green",
    },
    WANT_TO_WATCH: {
        name: "WANT_TO_WATCH",
        display: "Хочу посмотреть",
        color: "orange",
    },
} as const;
export const useStatuses = () =>
    useState<typeof statuses>("statuses", () => statuses);
export type Status = keyof typeof statuses;
