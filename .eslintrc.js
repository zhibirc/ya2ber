/**
 * Main ESLint configuration file.
 * This file contains the base set of common options and may be extended in components.
 */

const OFF = 0;
const WARN = 1;
const ERROR = 2;


module.exports = {
    // stop ESLint from looking for a configuration file in parent folders
    root: true,
    env: {
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'airbnb-base'
    ],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: [],
    rules: {
        indent: [ERROR, 4],

        // code smells detection common rules
        complexity: [ERROR, { max: 10 }],
        'max-nested-callbacks': [ERROR, { max: 2 }],
        'max-depth': [ERROR, { max: 3 }],
        'max-params': [ERROR, { max: 4 }],
        'max-statements': [
            ERROR,
            { max: 10 },
            { ignoreTopLevelFunctions: false }
        ],
        'max-lines': [
            ERROR,
            { max: 150, skipBlankLines: true, skipComments: true }
        ],
        'max-len': [
            ERROR,
            { code: 100, comments: 120, ignoreUrls: true }
        ],

        'comma-dangle': [ERROR, 'never'],
        'no-multiple-empty-lines': [ERROR, { max: 2 }]
    }
};
