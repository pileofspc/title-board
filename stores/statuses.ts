const statuses = {
    WATCHED: {
        display: "Просмотрено",
        color: "green",
    },
    NOT_WATCHED: {
        display: "Не просмотрено",
        color: "blue-grey",
    },
    WANT_TO_WATCH: {
        display: "Хочу посмотреть",
        color: "orange",
    },
} as const;
export type Status = keyof typeof statuses;
export const useStatuses = () =>
    useState<typeof statuses>("statuses", () => statuses);
