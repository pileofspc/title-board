const statuses = ["watched", "not-watched", "want-to-watch"] as const;
export type Status = (typeof statuses)[number];
export const useStatuses = () =>
    useState<typeof statuses>("statuses", () => statuses);
