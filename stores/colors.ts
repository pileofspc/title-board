const colors = ["red", "green", "blue", "indigo", "amber"] as const;
export type Color = (typeof colors)[number];
export const useColors = () => useState<typeof colors>("colors", () => colors);
// TODO: Поменять везде цвета на primary, secondary и тд
