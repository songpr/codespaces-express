import test from 'node:test';
import { strict as assert } from 'node:assert';

import { mergeObjects } from "../index.js"
test("merge source objects to target objects", (t) => {
    const mergedObjects = mergeObjects([{ key: 1, score: 1 }, { key: 2, score: 2 }],
        [{ key: 2, score: 5 }, { key: 2, score: 6 }], ["key"])
    assert.deepEqual(mergedObjects, [{ key: 1, score: 1 }, { key: 2, score: 13 }])
})