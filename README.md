README.md

# mgraph.random

Operation with seeded random numbers for mgraph.*.
This library provides seeded pseudorandom number generation along with utilities for array shuffling, Gaussian, and Lévy distributions.
It is a modern port of the original [ngraph.random](https://github.com/anvaka/ngraph.random) library.

## Install

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/mgraph.random/dist/mgraph.random.js"></script>
The library will be accessible via the global variable mgraphRandom.

Via npm
bash
Copy
npm install mgraph.random
Then import it in your project:

// ES module usage:
import mgraphRandom from 'mgraph.random';

// CommonJS usage:
// const mgraphRandom = require('mgraph.random');
Usage
Random Number Generation
Create a generator (seeded with 42):

const randomGenerator = mgraphRandom(42);

// Generates a random double in [0, 1)
console.log(randomGenerator.nextDouble());

// Generates a random integer in [0, 100)
console.log(randomGenerator.next(100)); // Reproducible with the same seed
Note: next() always requires a maxValue. If omitted, it will return NaN.

Array Shuffling
Shuffle an array in random order:

const originalArray = [0, 1, 2, 3, 4, 5];
const iterator = mgraphRandom.randomIterator(originalArray);

// Iterate over the array in random order:
iterator.forEach(x => console.log(x));

// To re-shuffle the array in place:
iterator.shuffle();
For seeded shuffling, pass a seeded random generator:

const seededGenerator = mgraphRandom.random(42);
mgraphRandom.randomIterator(originalArray, seededGenerator);
Distributions
Gaussian Distribution

const generator = mgraphRandom(42);
// Returns a random number from a Gaussian distribution (mean 0, standard deviation 1)
console.log(generator.gaussian());
Lévy Distribution


const generator = mgraphRandom(42);
console.log(generator.levy());
See an example on Twitter.

Build
To create browser builds, run:

npm run build
This will generate both unminified and minified UMD bundles in the dist/ folder.

