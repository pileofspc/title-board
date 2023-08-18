const colors = ["red", "green", "blue", "indigo", "amber"] as const;
export const useColors = () => useState<typeof colors>("colors", () => colors);
// TODO: Поменять везде цвета на primary, secondary и тд
export type Color = (typeof colors)[number];
