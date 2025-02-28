// variants.ts
export const pageVariants = {
  initial: { x: 0 },
  inSettings: { x: -300 }, // экран с настройками появляется, сдвигаясь с левой стороны
  outSettings: { x: 300 }, // текущая страница уходит вправо
  inDefault: { x: 300 }, // при возврате с настроек
  outDefault: { x: -300 },
}
