import test from 'node:test';
import { strict as assert } from 'node:assert';

import { mergeObjectsByKeys } from "../index.js"
test("merge source objects to target objects", (t) => {
    const mergedObjects = mergeObjectsByKeys([{ key: 1, score: 1 }, { key: 2, score: 2 }],
        [{ key: 2, score: 5 }, { key: 2, score: 6 }], ["key"])
    assert.deepEqual(mergedObjects, [{ key: 1, score: 1 }, { key: 2, score: 6 }])
})

test("merge multiple source objects to target objects - merged object length will alway equal target objects", (t) => {
    const targetObjects = [{ key: 1, score: 1 }, { key: 2, score: 2 }, { key: 3, score: 2 }]
    const sourceObjects = [{ key: 2, score: 5 }, { key: 2, score: 6 }, { key: 3, score: 1 }, { key: 4, score: 1 }]
    const mergedObjects = mergeObjectsByKeys(targetObjects, sourceObjects, ["key"])
    assert.deepEqual(mergedObjects, [{ key: 1, score: 1 }, { key: 2, score: 6 }, { key: 3, score: 1 }])
    assert.equal(mergedObjects.length, targetObjects.length)
})


test("merge multiple source objects to target objects by multiple keys", (t) => {
    const mergedObjects = mergeObjectsByKeys([{ key: 1, key2: "aa", score: 1 }, { key: 2, key2: "2", score: 2 }, { key: 3, score: 2 }],
        [{ key: 2, key2: "2", score: 5 }, { key: 2, key2: 2, score: 6 }, { key: 3, score: 4 }, { key: 3, key2: "cc", score: 1 }], ["key", "key2"])
    assert.deepEqual(mergedObjects, [{ key: 1, key2: "aa", score: 1 }, { key: 2, key2: "2", score: 5 }, { key: 3, score: 4 }])
})