// index.js
class Generator {
  constructor(seed) {
    this.seed = seed;
  }

  /**
   * Generates a random double in [0, 1)
   */
  nextDouble() {
    // Robert Jenkins' 32-bit integer hash function
    let seed = this.seed;
    seed = ((seed + 0x7ed55d16) + (seed << 12)) >>> 0;
    seed = ((seed ^ 0xc761c23c) ^ (seed >>> 19)) >>> 0;
    seed = ((seed + 0x165667b1) + (seed << 5)) >>> 0;
    seed = ((seed + 0xd3a2646c) ^ (seed << 9)) >>> 0;
    seed = ((seed + 0xfd7046c5) + (seed << 3)) >>> 0;
    seed = ((seed ^ 0xb55a4f09) ^ (seed >>> 16)) >>> 0;
    this.seed = seed;
    return (seed & 0xfffffff) / 0x10000000;
  }

  /**
   * Returns a random integer in [0, maxValue)
   */
  next(maxValue) {
    if (typeof maxValue !== 'number' || maxValue <= 0 || !isFinite(maxValue)) {
      return NaN;
    }
    return Math.floor(this.nextDouble() * maxValue);
  }

  /**
   * Alias for nextDouble()
   */
  uniform() {
    return this.nextDouble();
  }

  /**
   * Returns a random number following a Gaussian distribution
   * (mean = 0, standard deviation = 1)
   */
  gaussian() {
    let x, y, r;
    do {
      x = this.nextDouble() * 2 - 1;
      y = this.nextDouble() * 2 - 1;
      r = x * x + y * y;
    } while (r >= 1 || r === 0);
    return x * Math.sqrt(-2 * Math.log(r) / r);
  }

  /**
   * Returns a random number following a Lévy distribution.
   */
  levy() {
    const u = this.gaussian();
    const v = this.gaussian();
    return u * LEVY_SIGMA / Math.pow(Math.abs(v), 2/3);
  }
}

// Gamma function approximation.
function gamma(z) {
  return Math.sqrt(2 * Math.PI / z) *
    Math.pow((1 / Math.E) * (z + 1 / (12 * z - 1 / (10 * z))), z);
}

// Cached Lévy distribution sigma value (beta = 3/2)
const LEVY_SIGMA = Math.pow(
  gamma(1 + 3/2) *
    Math.sin((Math.PI * 3/2) / 2) /
    (gamma((1 + 3/2) / 2) * 3/2 * Math.pow(2, (3/2 - 1) / 2)),
  1 / (3/2)
);

/**
 * Creates a new seeded random number generator.
 * @param {number} [inputSeed] - If not provided, current time is used.
 */
function random(inputSeed) {
  const seed = typeof inputSeed === 'number' ? inputSeed : Date.now();
  return new Generator(seed);
}

/**
 * Creates an iterator over an array that visits each element in random order.
 * The iterator provides:
 * - forEach(callback): Iterates over items in random order.
 * - shuffle(): Shuffles the array in place.
 *
 * @param {Array} array - The array to iterate over.
 * @param {Object} [customRandom] - An optional seeded generator that implements next().
 */
function randomIterator(array, customRandom) {
  const localRandom = customRandom || random();
  if (typeof localRandom.next !== 'function') {
    throw new Error("customRandom does not match expected API: next() function is missing");
  }

  return {
    forEach(callback) {
      const arr = array;
      // Fisher–Yates shuffle while calling callback:
      for (let i = arr.length - 1; i > 0; i--) {
        const j = localRandom.next(i + 1);
        const t = arr[j];
        arr[j] = arr[i];
        arr[i] = t;
        callback(t);
      }
      if (arr.length) {
        callback(arr[0]);
      }
    },
    shuffle() {
      const arr = array;
      for (let i = arr.length - 1; i > 0; i--) {
        const j = localRandom.next(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
  };
}

/*
 * For backward compatibility, we want our default export
 * to be callable as a function and also expose:
 *   random.random = random and random.randomIterator = randomIterator.
 */
const randomAPI = Object.assign(random, { random, randomIterator });
export default randomAPI;
  