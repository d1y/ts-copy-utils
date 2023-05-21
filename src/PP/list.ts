import { assert } from "./except";

/**
 * 切割数组为 [batchSize] 大小的二维数组(不会修改原数组)
 */
export const batch = <T>(list: T[], batchSize: number): T[][] => {
  assert(
    typeof batchSize === "number" && !Number.isNaN(batchSize) && batchSize > 0,
    "batch size must be > 0",
    RangeError,
  );

  const size = Number.isFinite(batchSize) ? batchSize : list.length;

  return [...Array(Math.ceil(list.length / size))].map((_, i) =>
    list.slice(i * size, (i + 1) * size)
  );
};


/**
 * 随机打乱数组的顺序(不会修改原数组)
 */
export const shuffle = <T>(list: T[]): T[] => {
  const shuffled = [...list];
  shuffleInPlace(shuffled);
  return shuffled;
};

const shuffleInPlace = (list: unknown[]): void => {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = list[j];
    list[j] = list[i];
    list[i] = tmp;
  }
};


/**
 * 从可迭代的 list 中获取 n 个元素，并将它们作为数组返回
 */
export const takeList = <T>(n: number, list: Iterable<T>): T[] => [
  ...takeGenerator(n, list),
];

function* takeGenerator<T>(n: number, list: Iterable<T>): Generator<T> {
  let i = 0;
  for (const el of list) {
    if (i++ >= n) return;
    yield el;
  }
}