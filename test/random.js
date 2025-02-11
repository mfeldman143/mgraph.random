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
