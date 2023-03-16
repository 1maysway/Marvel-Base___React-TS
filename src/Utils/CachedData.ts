type Options = {
  sessionItemKey: string;
  cacheDuration_ms: number;
  compare?: {
    key: string;
    value: any;
  };
};

/**
 * Returns the property of the passed object at the given path.
 *
 * @example const object = { 
 *    a:{ 
 *      b:{ e: 123 } c:{ d: "value" } 
 *    } 
 * }
 * 
 * const d = getValueWithMultyKey(object,"a.c.d")
 */
export const getValueWithMultyKey = (obj: Record<string, any>, key: string) => {
  const keys = key.split(".");
  let result = { ...obj };
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const res = result[key];

    result = typeof res === "object" ? { ...res } : res;
  }
  return result;
};

/**
 * Sets the passed object into the sessionStorage with passed key.
 */
export const addToCache = (
  obj: Record<string, any> | null,
  sessionItemKey: string
): boolean => {
  if (!obj) {
    return false;
  }
  sessionStorage.setItem(
    sessionItemKey,
    JSON.stringify({ ...obj, cachedTime: Date.now() })
  );
  return true;
};

/**
 * Passes values from "valuesObject" by keys into "functions" by keys.
 *
 * The function and the value to be passed in it must have the same keys.
 *
 * @example valuesObject= {
 *    value:'value'
 * }
 *
 * functions = {
 *    value: (param:string)=>{ }
 * }
 *
 * passValuesToFucntions(valuesObject,functions)
 */
export const passValuesToFunctions = async (
  valuesObject: Record<string, any>,
  functions: Record<
    string,
    ((arg0: any) => any) | ((arg0: any) => Promise<any>)
  >
) => {
  for (const key in functions) {
    if (functions[key] instanceof Promise) {
      await functions[key](valuesObject[key]);
    } else {
      functions[key](valuesObject[key]);
    }
  }
};

/**
 * Gets cached data from sessionStorage or if it null, gets data from passed "DataGetter" and cache it.
 */
const CachedData = async (
  useStateSetters: Record<string, React.Dispatch<React.SetStateAction<any>>>,
  dataGetter: () => Promise<Record<string, any> | null>,
  options: Options
): Promise<number> => {
  const cachedData = sessionStorage.getItem(options.sessionItemKey);
  const data: Record<string, any> =
    cachedData && (await JSON.parse(cachedData));

  if (
    data &&
    (options.compare
      ? getValueWithMultyKey(data, options.compare.key) ===
        options.compare.value
      : true &&
        Date.now() - parseInt(data.cachedTime) < options.cacheDuration_ms)
  ) {
    delete data.cachedTime;
    
    passValuesToFunctions(data, useStateSetters);
    return 1;
  } else if (dataGetter) {
    const newData = await dataGetter();

    addToCache(newData, options.sessionItemKey);
    return -1;
  }
  return 0;
};

export default CachedData;





