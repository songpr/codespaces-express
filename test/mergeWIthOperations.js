import test from 'node:test';
import { strict as assert } from 'node:assert';
import { mergeObjectsByKeys } from "../index.js"
const targetObjects = [{ key: 1, score: 1, timestamp: "2023-01-10 00:00:00" }, { key: 2, score: 2, timestamp: "2023-01-10 00:00:00" }
    , { key: 3, score: 2, timestamp: "2023-03-10 00:00:00" }]
const sourceObjects = [{ key: 2, score: 5, timestamp: "2023-02-10 00:00:00" }, { key: 2, score: 6, timestamp: "2023-02-10 11:00:00" }
    , { key: 3, score: 1, timestamp: "2023-02-10 00:00:00" }, { key: 4, score: 1, timestamp: "2023-02-12 00:00:00" }]

test("merge multiple source objects to target objects - sum score", (t) => {
    const mergedObjects = mergeObjectsByKeys(targetObjects,
        sourceObjects, ["key"], { score: "sum" })
    assert.deepEqual(mergedObjects, [{ key: 1, score: 1, timestamp: "2023-01-10 00:00:00" }, { key: 2, score: 13, timestamp: "2023-02-10 11:00:00" }
        , { key: 3, score: 3, timestamp: "2023-02-10 00:00:00" }])
    assert.equal(mergedObjects.length, targetObjects.length)
})

test("merge multiple source objects to target objects - sum score, with some without score, or score = null", (t) => {
    const additionSourceObjects = [{ key: 2, score: null, timestamp: "2023-02-11 00:00:00" }, { key: 2, timestamp: "2023-02-09 00:00:00" }, { key: 2, score: 20, timestamp: "2023-02-13 11:00:00" }
        , { key: 3, timestamp: "2023-04-10 00:00:00" }, { key: 4, score: null, timestamp: "2023-02-12 00:00:00" }]
    const mergedObjects = mergeObjectsByKeys(targetObjects,
        [...sourceObjects, ...additionSourceObjects], ["key"], { score: "sum" })
    assert.deepEqual(mergedObjects, [{ key: 1, score: 1, timestamp: "2023-01-10 00:00:00" }, { key: 2, score: 33, timestamp: "2023-02-13 11:00:00" }
        , { key: 3, score: 3, timestamp: "2023-04-10 00:00:00" }])
    assert.equal(mergedObjects.length, targetObjects.length)
})


test("merge multiple source objects to target objects - sum score,max timestamp", (t) => {
    const mergedObjects = mergeObjectsByKeys(targetObjects,
        sourceObjects, ["key"], { score: "sum", timestamp: "max" })
    assert.deepEqual(mergedObjects, [{ key: 1, score: 1, timestamp: "2023-01-10 00:00:00" }, { key: 2, score: 13, timestamp: "2023-02-10 11:00:00" }
        , { key: 3, score: 3, timestamp: "2023-03-10 00:00:00" }])
    assert.equal(mergedObjects.length, targetObjects.length)
})


test("merge multiple source objects to target objects - min score,min timestamp", (t) => {

    const mergedObjects = mergeObjectsByKeys(targetObjects,
        sourceObjects, ["key"], { score: "min", timestamp: "min" })
    assert.deepEqual(mergedObjects, [{ key: 1, score: 1, timestamp: "2023-01-10 00:00:00" }, { key: 2, score: 2, timestamp: "2023-01-10 00:00:00" }
        , { key: 3, score: 1, timestamp: "2023-02-10 00:00:00" }])
    assert.equal(mergedObjects.length, targetObjects.length)
})

test("merge multiple source objects to target objects - preserv score,preserv timestamp", (t) => {
    const mergedObjects = mergeObjectsByKeys(targetObjects,
        sourceObjects, ["key"], { score: "preserve", timestamp: "preserve" })
    assert.deepEqual(mergedObjects, [{ key: 1, score: 1, timestamp: "2023-01-10 00:00:00" },
    { key: 2, score: [2, 5, 6], timestamp: ["2023-01-10 00:00:00", '2023-02-10 00:00:00', '2023-02-10 11:00:00'] }
        , { key: 3, score: [2, 1], timestamp: ['2023-03-10 00:00:00', "2023-02-10 00:00:00"] }])
    assert.equal(mergedObjects.length, targetObjects.length)
})

test("merge multiple source objects to target objects - invalid operatoion", (t) => {
    assert.throws(() => {
        mergeObjectsByKeys(targetObjects,
            sourceObjects, ["key"], { score: "test", timestamp: "sum" })
    }, Error)
})


test("merge multiple source objects to target objects - count score, with some without score, or score = null", (t) => {
    const additionSourceObjects = [{ key: 2, score: null, timestamp: "2023-02-11 00:00:00" }, { key: 2, timestamp: "2023-02-09 00:00:00" }, { key: 2, score: 20, timestamp: "2023-02-13 11:00:00" }
        , { key: 3, timestamp: "2023-04-10 00:00:00" }, { key: 4, score: null, timestamp: "2023-02-12 00:00:00" }]
    const mergedObjects = mergeObjectsByKeys(targetObjects,
        [...sourceObjects, ...additionSourceObjects], ["key"], { score: "count" })
    assert.deepEqual(mergedObjects, [{ key: 1, score: 1, timestamp: "2023-01-10 00:00:00" }, { key: 2, score: 6, timestamp: "2023-02-13 11:00:00" }
        , { key: 3, score: 3, timestamp: "2023-04-10 00:00:00" }])
    assert.equal(mergedObjects.length, targetObjects.length)
})


test("merge multiple source objects to target objects - countNotNull score, with some without score, or score = null", (t) => {
    const additionSourceObjects = [{ key: 2, score: null, timestamp: "2023-02-11 00:00:00" }, { key: 2, timestamp: "2023-02-09 00:00:00" }, { key: 2, score: 20, timestamp: "2023-02-13 11:00:00" }
        , { key: 3, timestamp: "2023-04-10 00:00:00" }, { key: 4, score: null, timestamp: "2023-02-12 00:00:00" }]
    const mergedObjects = mergeObjectsByKeys(targetObjects,
        [...sourceObjects, ...additionSourceObjects], ["key"], { score: "countNotNull" })
    assert.deepEqual(mergedObjects, [{ key: 1, score: 1, timestamp: "2023-01-10 00:00:00" }, { key: 2, score: 4, timestamp: "2023-02-13 11:00:00" }
        , { key: 3, score: 2, timestamp: "2023-04-10 00:00:00" }])
    assert.equal(mergedObjects.length, targetObjects.length)
})

test("merge multiple source objects to target objects - countUniqueValue score, with some without score, or score = null", (t) => {
    const additionSourceObjects = [{ key: 2, score: null, timestamp: "2023-02-11 00:00:00" }, { key: 2, timestamp: "2023-02-09 00:00:00" }, { key: 2, score: 5, timestamp: "2023-02-13 11:00:00" }
        , { key: 3, timestamp: "2023-04-10 00:00:00" }, { key: 4, score: null, timestamp: "2023-02-12 00:00:00" }]
    const mergedObjects = mergeObjectsByKeys(targetObjects,
        [...sourceObjects, ...additionSourceObjects], ["key"], { score: "countUniqueValue" })
    assert.deepEqual(mergedObjects, [{ key: 1, score: 1, timestamp: "2023-01-10 00:00:00" }, { key: 2, score: 3, timestamp: "2023-02-13 11:00:00" }
        , { key: 3, score: 2, timestamp: "2023-04-10 00:00:00" }])
    assert.equal(mergedObjects.length, targetObjects.length)
})