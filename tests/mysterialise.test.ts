import { mystify, clarify } from "../src";

test("Arrays serialised and unserialised correctly", () => {
  const obj = ["One", 1, "Two", 22];
  const result = JSON.stringify(clarify(mystify(obj))) === JSON.stringify(obj);
  expect(result).toBe(true);
});

test("Dates serialised and unserialised correctly", () => {
  const obj = new Date();
  const result = JSON.stringify(clarify(mystify(obj))) === JSON.stringify(obj);
  expect(result).toBe(true);
});

test("Regular Expressions serialised and unserialised correctly", () => {
  const obj = /test/g;
  const result = JSON.stringify(clarify(mystify(obj))) === JSON.stringify(obj);
  expect(result).toBe(true);
});

test("Buffers serialised and unserialised correctly", () => {
  const obj = Buffer.from([16, 32, 64]);
  const result = JSON.stringify(clarify(mystify(obj))) === JSON.stringify(obj);
  expect(result).toBe(true);
});

test("Strings serialised and unserialised correctly", () => {
  const obj = "test😀";
  const result = JSON.stringify(clarify(mystify(obj))) === JSON.stringify(obj);
  expect(result).toBe(true);
});

test("Numbers serialised and unserialised correctly", () => {
  const obj = 5;
  const result = JSON.stringify(clarify(mystify(obj))) === JSON.stringify(obj);
  expect(result).toBe(true);
});

test("True serialised and unserialised correctly", () => {
  const obj = true;
  const result = JSON.stringify(clarify(mystify(obj))) === JSON.stringify(obj);
  expect(result).toBe(true);
});

test("False serialised and unserialised correctly", () => {
  const obj = false;
  const result = JSON.stringify(clarify(mystify(obj))) === JSON.stringify(obj);
  expect(result).toBe(true);
});

test("Objects serialises and unserialises correctly", () => {
  const obj = [{
    date: new Date(),
    regex: /^something/,
    array: ['⟿⟿⟿of', 747],
    nest: {
      birds: {
        birdsnest: {
          eggs: 0
        }
      },
      chickens: undefined
    }
  }, {
    date: new Date(),
    nest: {
      birds: {
        birdsnest: {
          tarts: 0
        },
        randomBuffer: Buffer.from([16, 32, 128]),
      }
    },
    nothing: null,
    nested: [{
      date: new Date(),
      regex: /^something/,
      array: ['⟿⟿⟿of', 747],
      nest: {
        birds: {
          birdsnest: {
            eggs: 0
          }
        },
        chickens: undefined
      }
    }, {
      date: new Date(),
      nest: {
        birds: {
          birdsnest: {
            tarts: 0
          },
          randomBuffer: Buffer.from([16, 32, 128]),
        }
      },
      nothing: null,
      nested: [{
        date: new Date(),
        regex: /^something/,
        array: ['⟿⟿⟿of', 747],
        nest: {
          birds: {
            birdsnest: {
              eggs: 0
            }
          },
          chickens: undefined
        }
      }, {
        date: new Date(),
        nest: {
          birds: {
            birdsnest: {
              tarts: 0
            },
            randomBuffer: Buffer.from([16, 32, 128]),
          }
        },
        nothing: null,
        nested: [{
          date: new Date(),
          regex: /^something/,
          array: ['⟿⟿⟿of', 747],
          nest: {
            birds: {
              birdsnest: {
                eggs: 0
              }
            },
            chickens: undefined
          }
        }, {
          date: new Date(),
          nest: {
            birds: {
              birdsnest: {
                tarts: 0
              },
              randomBuffer: Buffer.from([16, 32, 128]),
            }
          },
          nothing: null,
        }]
      }]
    }]
  }];
  const result = JSON.stringify(clarify(mystify(obj))) === JSON.stringify(obj);
  expect(result).toBe(true);
});

test("Null serialises and unserialises correctly", () => {
  const obj = null;
  const result = JSON.stringify(clarify(mystify(obj))) === JSON.stringify(obj);
  expect(result).toBe(true);
});

test("Undefined serialises and unserialises correctly", () => {
  const obj = undefined;
  const result = JSON.stringify(clarify(mystify(obj))) === JSON.stringify(obj);
  expect(result).toBe(true);
});