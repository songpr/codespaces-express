/**
 * merge sources objects to target objects using based on the same keys
 * target objects will not be merged e.g. target objects [{key:1,score:4},key:1,score:5}] with keys = ["key"], both key:1 will be kept
 *
 * @param {Array<Object>} targets - targets objects for source objects to be merged into
 * @param {Array<Object>} sources - sources objects to be merged into targets
 * @param {Array<String>} keys - keys to use to determine which objects to be merged together, all values of keys must be supported JSON.stringify otherwise, error will be throwed
 * @param {*} operations 
 */
function mergeObjects(targets, sources, keys, operations) {
  if (!Array.isArray(targets) || targets.length < 1 || typeof (targets[0]) !== "object") throw Error("target objects must be array of objects")
  if (!Array.isArray(sources) || sources.length < 1 || typeof (sources[0]) !== "object") throw Error("sources objects must be array of objects")
  if (!Array.isArray(keys) || keys.length < 1 || typeof (keys[0]) !== "string") throw Error("keys must be array of object property name (String)")
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
      sourcesMapByKeys.set(key, Object.assign(sourcesMapByKeys.get(key), source))
      continue
    }
    sourcesMapByKeys.set(key, source)
  }
  return targets.map(target => {
    const key = keysGenerator(target)
    return Object.assign(target, sourcesMapByKeys.get(key))
  })
}

export { mergeObjects }