function validationForBasicOperations(target, source) {
  if (source === undefined) return target
}
const basicOperationsGenerator = {
  sum: () => {
    return (target, source) => {
      return (target == null ? 0 : target) + (source == null ? 0 : source)
    }
  },
  max: () => {
    return (target, source) => {
      if (source === undefined) return target
      if (target === undefined) return source
      return source > target ? source : target
    }
  },
  min: () => {
    return (target, source) => {
      if (source === undefined) return target
      if (target === undefined) return source
      return source < target ? source : target
    }
  },
  /**
   * count the number of merged objects
   * @returns {Number} count of merged objects
   */
  count: () => {
    const countInfoMap = new Map()
    return (target, source, key) => {
      if (!countInfoMap.has(key)) countInfoMap.set(key, { count: 1 }) //initialize countInfo
      const countInfo = countInfoMap.get(key)
      countInfo.count += 1
      return countInfo.count
    }
  },
  /**
   * count of value merged objects that are not undefined or null
   * @returns {Number} count of value merged objects that are not undefined or null
   */
  countNotNull: () => {
    const countInfoMap = new Map()
    return (target, source, key) => {
      if (!countInfoMap.has(key)) countInfoMap.set(key, { count: (target != null ? 1 : 0) }) //initialize countInfo
      const countInfo = countInfoMap.get(key)
      if (source != null) countInfo.count += 1
      return countInfo.count
    }
  },

  /**
 * count of unique value merged objects that are not undefined or null
 * @returns {Number} count of value merged objects that are not undefined or null
 */
  countUniqueValue: () => {
    const countInfoMap = new Map()
    return (target, source, key) => {
      if (!countInfoMap.has(key)) countInfoMap.set(key, { count: (target != null ? 1 : 0), valueMap: target != null ? new Map([[target, true]]) : new Map() }) //initialize countInfo
      const countInfo = countInfoMap.get(key)
      if (source != null && !countInfo.valueMap.has(source)) {
        countInfo.valueMap.set(source, true)
        countInfo.count += 1

      }
      return countInfo.count
    }
  },
  /**
   * preserve of property value of merged objects, if target is array, source will be pushed to target array
   * if source is array, target will be pushed to source array
   * if both is array, arrays will be merged
   * @returns {Array} array of merged objects
   */
  preserve: () => {
    return (target, source) => {
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
}
const mergeFunctionGenerator = (operations, keys) => {
  if (typeof (operations) === "function") return operations
  if (typeof (operations) === "object") {
    //each merged function will be generated for each key
    const operationsKeysFunction = Object.fromEntries(Object.keys(operations).map(operationKey => {
      if (typeof (operations[operationKey]) === "function") return [operationKey, operations[operationKey]]
      if (basicOperationsGenerator[operations[operationKey]] === undefined) throw Error("operation " + operations[operationKey] + " is not supported")
      return [operationKey, basicOperationsGenerator[operations[operationKey]]()]
    }))
    return (target, source, objectsKey) => {
      if (target === undefined) throw Error("target object cannot be undefined")
      if (source === undefined) return target
      const mergedObject = {}
      //use set to get unique keys from both objects
      new Set([...(Object.keys(target)), ...(Object.keys(source))]).forEach(propertyName => {
        if (propertyName in operations) {
          //for operations, pass target[key], source[key] and key to the function
          mergedObject[propertyName] = (typeof (operations[propertyName]) === "function") ?
            operations[propertyName](target[propertyName], source[propertyName]) :
            operationsKeysFunction[propertyName](target[propertyName], source[propertyName], objectsKey)
        } else {
          //replace only if source[key] is not undefined
          mergedObject[propertyName] = source[propertyName] !== undefined ? source[propertyName] : target[propertyName]
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
 *  built-in operations are:
 *    "sum" - sum the values of the key of the objects
 *    "max" - get the max value of the key of the objects
 *    "min" - get the min value of the key of the objects
 *    "count" - count of merged objects
 *    "countNotNull" - count of merged objects that are not undefined or null
 *    "countUniqueValue" - count of unique value merged objects that are not undefined or null
 * @returns {Array<Object>} merged objects - the length of merged objects will always equal to the length of target objects
 */
function mergeObjectsByKeys(targets, sources, keys, operations) {
  if (!Array.isArray(targets) || targets.length < 1 || typeof (targets[0]) !== "object") throw Error("target objects must be array of objects")
  if (!Array.isArray(sources) || sources.length < 1 || typeof (sources[0]) !== "object") throw Error("sources objects must be array of objects")
  if (!Array.isArray(keys) || keys.length < 1 || typeof (keys[0]) !== "string") throw Error("keys must be array of object property name (String)")
  if (operations && typeof (operations) !== "function" && typeof (operations) !== "object") throw Error("operations must be function or object")
  const mergedFunction = mergeFunctionGenerator(operations, keys)
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
      //push sourcees with the same key to the array
      sourcesMapByKeys.get(key).push(source)
      continue
    }
    //keep sourcees with the same key in an array
    sourcesMapByKeys.set(key, [source])
  }
  return targets.map(target => {
    const key = keysGenerator(target)
    if (!sourcesMapByKeys.has(key)) return target
    const sources = sourcesMapByKeys.get(key)
    for (const source of sources) {
      //merge source to target
      target = mergedFunction(target, source, key)
    }
    return target
  })
}


export { mergeObjectsByKeys }