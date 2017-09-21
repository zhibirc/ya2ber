/**
 * Test optimization level.
 */

'use strict';

const v8  = require('v8-natives'),
    debug = require('debug')('test');

if ( !v8.isNative() ) {
    debug('You must run this with the --allow-natives-syntax command line.');
    process.exit(0);
}

debug(`Node is using v8 version: ${v8.helpers.getV8Version()}`);


class TestSuit {
    /**
     * @constructor
     *
     * @param {Object[]} functions functions for testing
     */
    constructor ( functions ) {
        this.functions = functions;
    }

    /**
     * Test common program characteristics as Heap usage and GC impact.
     *
     * @static
     */
    static testCommons () {
        debug(`Heap usage before GC: ${v8.helpers.getHeapUsage()}`);
        debug(`Collect garbage... ${v8.helpers.collectGarbage()}`);
        debug(`Heap usage after GC: ${v8.helpers.getHeapUsage()}`);
    }


    /**
     * Get the function optimization result.
     *
     * @param {function} fn function which optimization status must be checked
     * @param {string} [fnName] function name
     */
    getOptimizationStatus ( fn, fnName ) {
        if ( fn ) {
            v8.helpers.printStatus(fn, fnName || fn.name);
        } else if ( this.functions ) {
            this.functions.forEach(fn => {
                v8.helpers.printStatus(fn, fn.name);
            });
        } else {
            debug('No functions for test!');
        }
    }


    /**
     * Test ability for v8 engine to optimize the function.
     *
     * @param {function} fn function for test optimization
     * @param {string} [fnName] function name
     */
    testOptimization ( fn, fnName ) {
        v8.helpers.testOptimization(fn, fnName || fn.name);
    }


    /**
     * Benchmarking given function.
     *
     * @param {number} count amount of iterations
     * @param {function} fn function for benchmark
     * @param {Object[]} [params] function parameters
     */
    createBenchmark ( count, fn, params ) {
        v8.helpers.benchmark(count, fn, params);
    }
}


module.exports = TestSuit;
