// all code copy by froebel

import { λ } from "./types"

/**
 * ChatGPT:
 * 这行代码定义了一个名为 noop 的常量，其值是一个箭头函数 () => {}。
 * 这个箭头函数是一个空函数，也就是说它没有任何操作或副作用，执行它不会改变程序状态或产生任何输出。
 * 这个常量通常用于占位符或默认函数，用于在某些情况下提供一个函数参数，但不需要实际执行任何操作。
 * 例如，当你需要传递一个回调函数，但你不需要在某些情况下执行它，你可以将它设置为 noop。
 */
export const NOOP = () => { }

/**
 * ChatGPT:
 * 这行代码定义了一个名为 ident 的常量，其值是一个泛型函数。
 * 这个函数接受一个类型为 T 的参数 value，并返回类型为 T 的值。
 * 这个函数被称为 "identity" 函数，因为它不对输入值进行任何操作，只是返回输入值本身。
 * 泛型函数可以用于操作不同类型的值，而不需要为每种类型都编写一个单独的函数。
 * 在这个例子中，T 是一个类型参数，它在调用函数时根据传递给函数的值进行实例化。
 * 例如，如果你调用 ident("hello")，T 将被实例化为 string 类型，因此 ident 函数的返回类型将是 string。
 * 如果你调用 ident(42)，T 将被实例化为 number 类型，因此 ident 函数的返回类型将是 number。
 */
export const ident = <T>(value: T): T => value

const _throttleCancel = Symbol("throttle.cancel")
/**
 * 节流
 */
export const throttle = Object.assign(
  (fun: λ, ms: number, { leading = true, trailing = true } = {}) => {
    let toId: any
    let lastInvoke = -Infinity
    let lastArgs: any[] | undefined

    const invoke = () => {
      lastInvoke = performance.now()
      toId = undefined
      fun(...lastArgs!)
    }

    return Object.assign(
      (...args: any[]) => {
        if (!leading && !trailing) return
        lastArgs = args
        const dt = performance.now() - lastInvoke

        if (dt >= ms && toId === undefined && leading) invoke()
        else if (toId === undefined && trailing) {
          toId = setTimeout(invoke, dt >= ms ? ms : ms - dt)
        }
      },
      { [_throttleCancel]: () => clearTimeout(toId) },
    )
  },
  { cancel: _throttleCancel },
) as
  & (<T extends λ>(
    fun: T,
    ms: number,
    opts?: { leading?: boolean; trailing: boolean },
  ) => λ<Parameters<T>, void> & { [_throttleCancel](): void })
  & {
    cancel: typeof _throttleCancel
  }


const _debounceCancel = Symbol("debounce.cancel");
/**
 * 防抖
 */
export const debounce = Object.assign(
  (fun: λ, ms: number) => {
    let toId: any;
    return Object.assign(
      (...args: any[]) => {
        clearTimeout(toId);
        toId = setTimeout(() => fun(...args), ms);
      },
      { [_debounceCancel]: () => clearTimeout(toId) },
    ) as any;
  },
  { cancel: _debounceCancel },
) as
  & (<T extends λ>(
    fun: T,
    ms: number,
  ) => λ<Parameters<T>, void> & { [_debounceCancel](): void })
  & {
    cancel: typeof _debounceCancel;
  };

/**
 * 记忆函数 
 * @link https://github.com/MathisBullinger/froebel/blob/main/memoize.test.ts
 */
export const memoize = <T extends λ, K = string, W extends boolean = false>(
  fun: T,
  opt: {
    /**
     * How the cache key is computed. Defaults to `JSON.stringify`ing the arguments.
     */
    key?: (...args: Parameters<T>) => K;
    /**
     * The maximum number of results that can be kept in cache before discarding the oldest result.
     */
    limit?: number;
    /**
     * Store non-primitive cache keys in a WeakMap.
     */
    weak?: W;
  } = {},
): T & {
  cache: W extends false ? Map<K, ReturnType<T>> : Cache<K, ReturnType<T>>;
} => {
  opt.key ??= (...args) => JSON.stringify(args) as any;

  const cache = opt.weak
    ? new Cache<K, ReturnType<T>>()
    : new Map<K, ReturnType<T>>();

  if (!Number.isFinite(opt.limit)) opt.limit = -1;

  const hasLimit = (_cache: unknown): _cache is Map<unknown, unknown> =>
    opt.limit! > 0

  return Object.assign(
    (...args: Parameters<T>) => {
      const k = opt.key!(...args)
      if (cache.has(k)) return cache.get(k)
      if (hasLimit(cache) && opt.limit! <= cache.size) {
        const n = cache.size - opt.limit! + 1
        for (let i = 0; i < n; i++) cache.delete(cache.keys().next().value)
      }
      const res = fun(...args)
      cache.set(k, res)
      return res
    },
    {
      cache,
    },
  ) as any
};

class Cache<K, V> {
  #primitives = new Map()
  #objects = new (globalThis.WeakMap ?? Map)()

  #getMap(key: K): WeakMap<any, any> {
    if (typeof key === "object" && key !== null) return this.#objects
    return this.#primitives
  }

  delete(key: K) {
    return this.#getMap(key).delete(key)
  }

  has(key: K) {
    return this.#getMap(key).has(key)
  }

  get(key: K): V | undefined {
    return this.#getMap(key).get(key)
  }

  set(key: K, value: V) {
    this.#getMap(key).set(key, value)
  }
}

type ExcS<T extends λ> = ReturnType<T> extends void | PromiseLike<void>
  ? [except?: Exc<T>]
  : [except: Exc<T>]

type Exc<T extends λ> = λ<Parameters<T>, OptProm<ReturnType<T>>>
type OptProm<T> = T extends Promise<infer I> ? I | Promise<I> : T

export const once = <T extends λ>(fun: T, ...[except]: ExcS<T>): T => {
  let invs = 0
  return ((...args: Parameters<T>) =>
    ++invs > 1 ? except?.(...args) : fun(...args)) as T
}