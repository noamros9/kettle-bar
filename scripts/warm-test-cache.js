#!/usr/bin/env node
// Phase 31 ticket 5 (decision 311): build the test library once, before the unit tests and without coverage. Under
// coverage the whole library took ~6 min (against ~50 s plain), and every test file that found no cache yet built it
// again; with this, every file reads the cache in test-results/.cache/ (tests/helpers/library.js).
const { library, rendered } = require('../tests/helpers/library.js');
const t = Date.now();
library(); rendered();
console.log(`test cache ready in ${Math.round((Date.now() - t) / 1000)} s`);
