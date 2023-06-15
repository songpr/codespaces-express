function validationForBasicOperations(target, source) {
  if (source === undefined) return target
}
const basicOperations = {
  sum: (target, source) => {
    return (target == null ? 0 : target) + (source == null ? 0 : source)
  },
  max: (target, source) => {
    if (source === undefined) return target
    if (target === undefined) return source
    return source > target ? source : target
  },
  min: (target, source) => {
    if (source === undefined) return target
    if (target === undefined) return source
    return source < target ? source : target
  },
  preserve: (target, source) => {
    if (source === undefined) return target
    if (target === undefined) return source
    if (Array.isArray(target) && Array.isArray(source)) {
      return [...target, ...source]
    } else if (Array.isArray(target)) {
      return [...target, source]
    } else if (Array.isArray(source)) {
      return [target, ...source]
    }
    return [target, source]
  }
}
const mergeFunctionGenerator = (operations) => {
  if (typeof (operations) === "function") return operations
  if (typeof (operations) === "object") {
    return (target, source) => {
      if (target === undefined) throw Error("target object cannot be undefined")
      if (source === undefined) return target
      const mergedObject = {}
      //use set to get unique keys from both objects
      new Set([...(Object.keys(target)), ...(Object.keys(source))]).forEach(key => {
        if (key in operations) {
          mergedObject[key] = (typeof (operations[key]) === "function") ? operations[key](target[key], source[key]) : basicOperations[operations[key]](target[key], source[key])
        } else {
          //replace only if source[key] is not undefined
          mergedObject[key] = source[key] !== undefined ? source[key] : target[key]
        }
      })
      return mergedObject
    }
  }
  //default merge function
  return (target, source) => Object.assign(target, source)
}

/**
 * merge sources objects to target objects using based on the same keys
 * target objects will not be merged e.g. target objects [{key:1,score:4},key:1,score:5}] with keys = ["key"], both key:1 will be kept
 *
 * @param {Array<Object>} targets - targets objects for source objects to be merged into
 * @param {Array<Object>} sources - sources objects to be merged into targets
 * @param {Array<String>} keys - keys to use to determine which objects to be merged together, all values of keys must be supported JSON.stringify otherwise, error will be throwed
 * @param {Function||Object} operations used to determine how to merge objects, if operations is a function, it will be called with (target,source) and return the merged object, 
 *  if operations is an object, it will be used as key -> merge function map, if key is found in operations, the merge function will be called with (target,source) and return the merged value of the key of the object.
 *  if operations is not provided, the source object will be merged into target object using Object.assign(target,source)
 * 
 * @returns {Array<Object>} merged objects - the length of merged objects will always equal to the length of target objects
 */
function mergeObjectsByKeys(targets, sources, keys, operations) {
  if (!Array.isArray(targets) || targets.length < 1 || typeof (targets[0]) !== "object") throw Error("target objects must be array of objects")
  if (!Array.isArray(sources) || sources.length < 1 || typeof (sources[0]) !== "object") throw Error("sources objects must be array of objects")
  if (!Array.isArray(keys) || keys.length < 1 || typeof (keys[0]) !== "string") throw Error("keys must be array of object property name (String)")
  if (operations && typeof (operations) !== "function" && typeof (operations) !== "object") throw Error("operations must be function or object")
  const mergedFunction = mergeFunctionGenerator(operations)
  const keysGenerator = (object) => {
    const freezedKeys = Object.freeze(keys)
    const keysString = Object.keys(object).filter(key => freezedKeys.includes(key))
      .map((filterKey) => JSON.stringify(object[filterKey])).join(",")
    return keysString
  }
  const sourcesMapByKeys = new Map()
  for (const source of sources) {
    const key = keysGenerator(source)
    if (sourcesMapByKeys.has(key)) {
      //map earlier source with the same key to the latest source sorted by index of array
      sourcesMapByKeys.set(key, mergedFunction(sourcesMapByKeys.get(key), source))
      continue
    }
    sourcesMapByKeys.set(key, source)
  }
  return targets.map(target => {
    const key = keysGenerator(target)
    return mergedFunction(target, sourcesMapByKeys.get(key))
  })
}


export { mergeObjectsByKeys }