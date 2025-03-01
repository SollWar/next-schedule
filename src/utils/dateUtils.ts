/// Количество дней в месяце
export function getDaysInMonth(year: number, month: number): number {
  // Месяцы в JavaScript начинаются с 0 (январь = 0)
  // Создаем дату следующего месяца и отнимаем 1 день
  return new Date(year, month + 1, 0).getDate()
}

/// С какого дня недели начинается месяц
export function getFirstWeekdayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 7 : day // Воскресенье становится 7
}

/// Генерация числа в диапозоне от min до max
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const MONTH: string[] = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]
