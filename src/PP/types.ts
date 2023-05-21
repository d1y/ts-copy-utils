export type λ<TA extends any[] = any[], TR = any> = (...args: TA) => TR

export type MakeProm<T> = Promise<T extends PromiseLike<infer I> ? I : T>;

/**
 * T 如果是 string 就返回 string, 如果是 number 就返回 number
 * 不然就返回 T
 */
type Widen<T> = T extends string ? string : T extends number ? number : T;

/** Any list of the `n`-first elements of `T`. */
export type PartialList<T extends any[]> = T extends [infer L, ...infer R]
  ? [] | [Widen<L>] | [Widen<L>, ...PartialList<R>]
  : [];