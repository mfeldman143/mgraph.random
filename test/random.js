// test/random.js
import { test } from "tap";
import randomAPI from "../index.js";

test("random iterator returns all items", (t) => {
  const a = [1, 2, 3, 4, 5, 6];
  const aCopy = [...a];
  const iterator = randomAPI.randomIterator(aCopy);
  const iterated = [];
  iterator.forEach((i) => {
    iterated.push(i);
    t.ok(a.indexOf(i) !== -1, `Iterator returned valid item: ${i}`);
  });
  t.equal(iterated.length, a.length, "All items are iterated");
  t.end();
});

test("can shuffle in place", (t) => {
  const a = [1, 2, 3, 4, 5, 6];
  const iterator = randomAPI.randomIterator(a);
  const previous = new Set(a);
  iterator.shuffle();
  a.forEach(x => t.ok(previous.has(x), `Shuffled array still contains ${x}`));
  t.equal(a.length, previous.size, "Array length remains unchanged after shuffle");
  t.end();
});

test("throws when random API is wrong", (t) => {
  t.throws(() => {
    randomAPI.randomIterator([], {});
  }, /next\(\) function is missing/, "Throws if custom random generator is invalid");
  t.end();
});

test("empty array iterator does not call callback", (t) => {
  randomAPI.randomIterator([]).forEach(() => {
    t.fail("Callback should not be called for empty array");
  });
  t.end();
});

test("Same seed gives same values", (t) => {
  const random1 = randomAPI.random(42);
  const random2 = randomAPI.random(42);
  t.equal(random1.next(100), random2.next(100), "Same seed produces same value");
  t.end();
});

test("it can generate gaussian", (t) => {
  const random = randomAPI.random(42);
  t.type(random.gaussian(), "number", "Gaussian returns a number");
  t.end();
});

test("it can generate levy", (t) => {
  const random = randomAPI.random(42);
  t.type(random.levy(), "number", "Levy returns a number");
  t.end();
});

test("can use function syntax", (t) => {
  const random1 = randomAPI(42);
  const random2 = randomAPI.random(42);
  t.equal(random1.nextDouble(), random2.nextDouble(), "Function syntax produces consistent generators");
  t.end();
});

test("next() validates input", (t) => {
  const random = randomAPI(42);
  t.ok(isNaN(random.next()), "Returns NaN when maxValue is undefined");
  t.ok(isNaN(random.next(0)), "Returns NaN when maxValue is 0");
  t.ok(isNaN(random.next(-5)), "Returns NaN when maxValue is negative");
  t.ok(isNaN(random.next(Infinity)), "Returns NaN when maxValue is Infinity");
  t.ok(isNaN(random.next(NaN)), "Returns NaN when maxValue is NaN");
  t.ok(isNaN(random.next("100")), "Returns NaN when maxValue is string");
  t.end();
});

test("next() returns valid integers", (t) => {
  const random = randomAPI(42);
  for (let i = 0; i < 100; i++) {
    const val = random.next(10);
    t.ok(val >= 0 && val < 10, `Value ${val} is in range [0, 10)`);
    t.ok(Number.isInteger(val), `Value ${val} is an integer`);
  }
  t.end();
});

test("levy distribution is reproducible with same seed", (t) => {
  const random1 = randomAPI(12345);
  const random2 = randomAPI(12345);
  const levy1 = random1.levy();
  const levy2 = random2.levy();
  t.equal(levy1, levy2, "Same seed produces same Lévy values");
  t.end();
});

test("gaussian distribution is reproducible with same seed", (t) => {
  const random1 = randomAPI(99);
  const random2 = randomAPI(99);
  const values1 = [random1.gaussian(), random1.gaussian(), random1.gaussian()];
  const values2 = [random2.gaussian(), random2.gaussian(), random2.gaussian()];
  t.same(values1, values2, "Same seed produces same Gaussian sequence");
  t.end();
});

test("uniform() is alias for nextDouble()", (t) => {
  const random1 = randomAPI(777);
  const random2 = randomAPI(777);
  t.equal(random1.uniform(), random2.nextDouble(), "uniform() and nextDouble() produce same values");
  t.end();
});

test("randomIterator works with seeded generator", (t) => {
  const a = [1, 2, 3, 4, 5];
  const seededRandom1 = randomAPI(42);
  const seededRandom2 = randomAPI(42);

  const iterator1 = randomAPI.randomIterator([...a], seededRandom1);
  const iterator2 = randomAPI.randomIterator([...a], seededRandom2);

  const result1 = [];
  const result2 = [];

  iterator1.forEach(x => result1.push(x));
  iterator2.forEach(x => result2.push(x));

  t.same(result1, result2, "Seeded iterators produce same random order");
  t.end();
});
