/**
 * Test optimization level.
 */

'use strict';

const v8  = require('v8-natives'),
    debug = require('debug')('test');


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


    testFunctions () {
        this.functions.forEach();
    }
}


module.exports = TestSuit;
