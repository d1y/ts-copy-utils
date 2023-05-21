/** Upper-case first letter of string. */
export const capitalize = <T extends string>(str: T) =>
  (str[0].toUpperCase() + str.slice(1)) as Capitalize<T>;

/** Lower-case first letter of string */
export const uncapitalize = <T extends string>(str: T) =>
  (str[0].toLowerCase() + str.slice(1)) as Uncapitalize<T>;

/** Strictly typed `String.toUpperCase()`. */
export const upper = <T extends string>(str: T) =>
  str.toUpperCase() as Uppercase<T>;

/** Strictly typed `String.toLowerCase()`. */
export const lower = <T extends string>(str: T) =>
  str.toLowerCase() as Lowercase<T>;