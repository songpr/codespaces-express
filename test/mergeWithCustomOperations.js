import test from 'node:test';
import { strict as assert } from 'node:assert';
import { mergeObjectsByKeys } from "../index.js"



test("merge source objects to target objects with default merge for products", (t) => {
    const targetObjects = [
        { key: 1, score: 1, timestamp: "2023-01-10 00:00:00", products: { product_a: { quality: 1, price: 100 } } },
        { key: 2, score: 2, timestamp: "2023-01-10 00:00:00", products: { product_b: { quality: 3, price: 100 } } },
        { key: 3, score: 2, timestamp: "2023-03-10 00:00:00" },
        { key: 4, score: 1, timestamp: "2023-01-10 00:00:00", products: { product_d: { quality: 10, price: 500 } } }]
    const sourceObjects = [
        { key: 2, score: 5, timestamp: "2023-02-10 11:00:00", products: { product_a: { quality: 1, price: 100 }, product_b: { quality: 2, price: 200 } } },
        { key: 2, score: 6, timestamp: "2023-02-10 00:00:00", products: { product_a: { quality: 1, price: 100 }, product_c: { quality: 1, price: 300 } } },
        { key: 3, score: 1, timestamp: "2023-02-10 00:00:00", products: { product_a: { quality: 1, price: 100 }, product_c: { quality: 1, price: 300 } } },
        { key: 4, score: 1, timestamp: "2023-02-12 00:00:00" },
        { key: 5, score: 1, timestamp: "2023-02-12 00:00:00", products: { product_z: { quality: 100, price: 100 } } }]
    const mergedObjects = mergeObjectsByKeys(targetObjects, sourceObjects, ["key"], {
        score: "sum",
        timestamp: "max"
    })
    assert.deepEqual(mergedObjects, [
        { key: 1, score: 1, timestamp: "2023-01-10 00:00:00", products: { product_a: { quality: 1, price: 100 } } },
        { key: 2, score: 13, timestamp: "2023-02-10 11:00:00", products: { product_a: { quality: 1, price: 100 }, product_c: { quality: 1, price: 300 } } },
        { key: 3, score: 3, timestamp: "2023-03-10 00:00:00", products: { product_a: { quality: 1, price: 100 }, product_c: { quality: 1, price: 300 } } },
        { key: 4, score: 2, timestamp: "2023-02-12 00:00:00", products: { product_d: { quality: 10, price: 500 } } }
    ])
})

test("merge source objects to target objects with normal merge for products", (t) => {
    const targetObjects = [
        { key: 1, score: 1, timestamp: "2023-01-10 00:00:00", products: { product_a: { quality: 1, price: 100 } } },
        { key: 2, score: 2, timestamp: "2023-01-10 00:00:00", products: { product_b: { quality: 3, price: 100 } } },
        { key: 3, score: 2, timestamp: "2023-03-10 00:00:00" },
        { key: 4, score: 1, timestamp: "2023-01-10 00:00:00", products: { product_d: { quality: 10, price: 500 } } }]
    const sourceObjects = [
        { key: 2, score: 5, timestamp: "2023-02-10 11:00:00", products: { product_a: { quality: 1, price: 100 }, product_b: { quality: 2, price: 200 } } },
        { key: 2, score: 6, timestamp: "2023-02-10 00:00:00", products: { product_a: { quality: 1, price: 100 }, product_c: { quality: 1, price: 300 } } },
        { key: 3, score: 1, timestamp: "2023-02-10 00:00:00", products: { product_a: { quality: 1, price: 100 }, product_c: { quality: 1, price: 300 } } },
        { key: 4, score: 1, timestamp: "2023-02-12 00:00:00" },
        { key: 5, score: 1, timestamp: "2023-02-12 00:00:00", products: { product_z: { quality: 100, price: 100 } } }]
    const mergedObjects = mergeObjectsByKeys(targetObjects, sourceObjects, ["key"], {
        score: "sum",
        timestamp: "max",
        products: (target, source, key, targetParent, sourceParent) => {
            //if both target and source are undefined, return undefined othewise return the one that is not undefined
            if (target === undefined) {
                return source === undefined ? undefined : source
            }
            return source !== undefined ? source : target
        }

    })
    assert.deepEqual(mergedObjects, [
        { key: 1, score: 1, timestamp: "2023-01-10 00:00:00", products: { product_a: { quality: 1, price: 100 } } },
        { key: 2, score: 13, timestamp: "2023-02-10 11:00:00", products: { product_a: { quality: 1, price: 100 }, product_c: { quality: 1, price: 300 } } },
        { key: 3, score: 3, timestamp: "2023-03-10 00:00:00", products: { product_a: { quality: 1, price: 100 }, product_c: { quality: 1, price: 300 } } },
        { key: 4, score: 2, timestamp: "2023-02-12 00:00:00", products: { product_d: { quality: 10, price: 500 } } }
    ])
})
test("merge source objects to target objects with merge products", (t) => {
    const targetObjects = [
        { key: 1, score: 1, timestamp: "2023-01-10 00:00:00", products: { product_a: { quality: 1, price: 100 } } },
        { key: 2, score: 2, timestamp: "2023-01-10 00:00:00", products: { product_b: { quality: 3, price: 100 } } },
        { key: 3, score: 2, timestamp: "2023-03-10 00:00:00" },
        { key: 4, score: 1, timestamp: "2023-01-10 00:00:00", products: { product_d: { quality: 10, price: 500 } } }]
    const sourceObjects = [
        { key: 2, score: 5, timestamp: "2023-02-10 11:00:00", products: { product_a: { quality: 1, price: 100 }, product_b: { quality: 2, price: 200 } } },
        { key: 2, score: 6, timestamp: "2023-02-10 00:00:00", products: { product_a: { quality: 1, price: 100 }, product_c: { quality: 1, price: 300 } } },
        { key: 3, score: 1, timestamp: "2023-02-10 00:00:00", products: { product_a: { quality: 1, price: 100 }, product_c: { quality: 1, price: 300 } } },
        { key: 4, score: 1, timestamp: "2023-02-12 00:00:00" },
        { key: 5, score: 1, timestamp: "2023-02-12 00:00:00", products: { product_z: { quality: 100, price: 100 } } }]
    const mergedObjects = mergeObjectsByKeys(targetObjects, sourceObjects, ["key"], {
        score: "sum",
        timestamp: "max",
        products: (target, source, key, targetParent, sourceParent) => {
            //if both target and source are undefined, return undefined othewise return the one that is not undefined
            if (target === undefined) {
                return source === undefined ? undefined : source
            }
            if (source === undefined) return target
            for (const [product, productInfo] of Object.entries(source)) {
                if (target[product] === undefined) {
                    target[product] = productInfo
                } else {
                    //sum the quality
                    target[product].quality += productInfo.quality
                    //use the latest price
                    target[product].price = productInfo.price ? productInfo.price : target[product].price
                }
            }
            return target
            //both target and source are defined
        }

    })
    console.log(mergedObjects)
    assert.deepEqual(mergedObjects, [
        { key: 1, score: 1, timestamp: "2023-01-10 00:00:00", products: { product_a: { quality: 1, price: 100 } } },
        { key: 2, score: 13, timestamp: "2023-02-10 11:00:00", products: { product_a: { quality: 2, price: 100 }, product_b: { quality: 5, price: 200 }, product_c: { quality: 1, price: 300 } } },
        { key: 3, score: 3, timestamp: "2023-03-10 00:00:00", products: { product_a: { quality: 1, price: 100 }, product_c: { quality: 1, price: 300 } } },
        { key: 4, score: 2, timestamp: "2023-02-12 00:00:00", products: { product_d: { quality: 10, price: 500 } } }
    ])
})

test("merge source objects to target objects with merge products -> sum quality, avg price", (t) => {
    //keep data of each test in a separate scope to avoid side effects from other tests
    const targetObjects = [
        { key: 0, score: 1, timestamp: "2023-01-10 00:00:00", products: { product_a: { price: 100 } } },
        { key: 1, score: 1, timestamp: "2023-01-10 00:00:00", products: { product_a: { quality: 1, price: 100 } } },
        { key: 2, score: 2, timestamp: "2023-01-10 00:00:00", products: { product_b: { quality: 3, price: 100 } } },
        { key: 3, score: 2, timestamp: "2023-03-10 00:00:00" },
        { key: 4, score: 1, timestamp: "2023-01-10 00:00:00", products: { product_d: { quality: 10, price: 500 } } }]
    const sourceObjects = [
        { key: 2, score: 5, timestamp: "2023-02-10 11:00:00", products: { product_a: { quality: null, price: 100 }, product_b: { quality: 2, price: 200 } } },
        { key: 2, score: 6, timestamp: "2023-02-10 00:00:00", products: { product_a: { price: 100 }, product_c: { quality: 1, price: 300 } } },
        { key: 3, score: 1, timestamp: "2023-02-10 00:00:00", products: { product_a: { price: 100 }, product_c: { quality: 1, price: 300 } } },
        { key: 4, score: 1, timestamp: "2023-02-12 00:00:00" },
        { key: 5, score: 1, timestamp: "2023-02-12 00:00:00", products: { product_z: { quality: 100, price: 100 } } }]
    const mergedObjects = mergeObjectsByKeys(targetObjects, sourceObjects, ["key"], {
        score: "sum",
        timestamp: "max",
        products: (targetProperty, sourceProperty, key, target, source) => {
            //set default quality to 1 if it is undefined or less than 1, return productInfo
            const setDefaultQuality = (productInfo) => {
                if (productInfo == null) return productInfo
                if (productInfo.quality < 1 || productInfo.quality == null) productInfo.quality = 1
                return productInfo
            }
            console.log(targetProperty, sourceProperty, key, target, source)
            //if both target and source are undefined, return undefined othewise return the one that is not undefined
            if (targetProperty === undefined) {
                return sourceProperty === undefined ? undefined : ((source) => {
                    for (const [product, productInfo] of Object.entries(source))
                        source[product] = setDefaultQuality(productInfo)
                    return source
                })(sourceProperty)
            }
            if (sourceProperty === undefined) {
                return ((target) => {
                    for (const [product, productInfo] of Object.entries(target))
                        target[product] = setDefaultQuality(productInfo)
                    return target
                })(targetProperty)
            }
            for (const [product, productInfo] of Object.entries(sourceProperty)) {
                if (targetProperty[product] === undefined) {
                    targetProperty[product] = productInfo
                } else {
                    //default quality to 1 if it is undefined or less than 1 for both target and source
                    targetProperty[product] = setDefaultQuality(targetProperty[product])
                    sourceProperty[product] = setDefaultQuality(productInfo)
                    //calculate the avg price first before quality is summed
                    if (productInfo.price !== undefined && targetProperty[product].price !== undefined) {
                        targetProperty[product].price = (targetProperty[product].price * targetProperty[product].quality + productInfo.price * productInfo.quality) / (targetProperty[product].quality + productInfo.quality)
                    } else if (productInfo.price !== undefined) {
                        targetProperty[product].price = productInfo.price
                    } //ignore both target and source price if both are undefined
                    //sum the quality
                    targetProperty[product].quality += productInfo.quality
                }
            }
            return targetProperty
            //both target and source are defined
        }

    })
    console.log(mergedObjects)
    assert.deepEqual(mergedObjects, [
        { key: 0, score: 1, timestamp: "2023-01-10 00:00:00", products: { product_a: { price: 100 } } }, //the whole target will be not change if source of the same key is undefined
        { key: 1, score: 1, timestamp: "2023-01-10 00:00:00", products: { product_a: { quality: 1, price: 100 } } },
        //price of product_b in key 2 is 140 => (100*3+200*2)/(3+2)
        //quality of product is default to 1 if it is undefined or less than 1
        { key: 2, score: 13, timestamp: "2023-02-10 11:00:00", products: { product_a: { quality: 2, price: 100 }, product_b: { quality: 5, price: 140 }, product_c: { quality: 1, price: 300 } } },
        //quality of product_a is default to 1 if it is undefined or less than 1
        { key: 3, score: 3, timestamp: "2023-03-10 00:00:00", products: { product_a: { quality: 1, price: 100 }, product_c: { quality: 1, price: 300 } } },
        { key: 4, score: 2, timestamp: "2023-02-12 00:00:00", products: { product_d: { quality: 10, price: 500 } } }
    ])
})