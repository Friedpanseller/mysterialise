export type VariableType =
  // Array
  "A" |
  // Date
  "D" |
  // RegExp 
  "R" |
  // Buffer
  "B" |
  // string
  "s" |
  // number
  "n" |
  // boolean
  "b" |
  // object
  "o" |
  // null
  "l" |
  // undefined 
  "u"
  ;

export type MysteryType = {
  "t": VariableType,
  "d": any,
  "n"?: string | null
};

function serialise(variable: any, name: string | null): MysteryType {
  if (variable === null) {
    return {
      "t": "l",
      "d": null,
      ...(name ? { n: name } : {})
    };
  } else if (variable === undefined) {
    return {
      "t": "u",
      "d": undefined,
      ...(name ? { n: name } : {})
    };
  } else if (variable.constructor === Array) {
    return {
      "t": "A",
      "d": variable.map(v => serialise(v, null)),
      ...(name ? { n: name } : {})
    };
  } else if (variable.constructor === Date) {
    return {
      "t": "D",
      "d": variable.toISOString(),
      ...(name ? { n: name } : {})
    }
  } else if (variable.constructor === RegExp) {
    return {
      "t": "R",
      "d": variable.toString(),
      ...(name ? { n: name } : {})
    }
  } else if (variable.constructor === Buffer) {
    return {
      "t": "B",
      "d": JSON.parse(JSON.stringify(variable)).data,
      ...(name ? { n: name } : {})
    }
  } else if (typeof variable === "string") {
    return {
      "t": "s",
      "d": variable,
      ...(name ? { n: name } : {})
    }
  } else if (typeof variable === "number") {
    return {
      "t": "n",
      "d": variable,
      ...(name ? { n: name } : {})
    }
  } else if (typeof variable === "boolean") {
    return {
      "t": "b",
      "d": variable,
      ...(name ? { n: name } : {})
    }
  } else if (typeof variable === "object") {
    return {
      "t": "o",
      "d": Object.entries(variable).map(
        ([n, d]) => serialise(d, n)
      ),
      ...(name ? { n: name } : {})
    }
  }
  throw ("Cannot mysterise data type");
}

function deserialise(variable: MysteryType) {
  if (variable["t"] === "l") {
    return null;
  } else if (variable["t"] === "u") {
    return undefined;
  } else if (variable["t"] === "A") {
    return variable["d"].map((d: MysteryType) => deserialise(d));
  } else if (variable["t"] === "D") {
    return new Date(variable["d"]);
  } else if (variable["t"] === "R") {
    const parts = /\/(.*)\/(.*)/.exec(variable["d"]);
    if (parts) {
      return new RegExp(parts[1], parts[2]);
    } else {
      return null;
    }
  } else if (variable["t"] === "B") {
    return Buffer.from(variable["d"]);
  } else if (variable["t"] === "s") {
    return variable["d"];
  } else if (variable["t"] === "n") {
    return variable["d"];
  } else if (variable["t"] === "b") {
    return variable["d"];
  } else if (variable["t"] === "o") {
    let obj = {};
    variable["d"].forEach((v: MysteryType) => {
      if (v !== null && v !== undefined) {
        if (v["n"]) {
          obj = { ...obj, [v["n"]]: deserialise(v) };
        }
      }
    })
    return obj;
  }
  return;
}

function Uint8Array2String(u8a: Uint8Array) {
  var hex = [];
  for (var i = 0; i < u8a.length; i++) {
    hex.push(u8a[i].toString(36));
  }
  return hex.join(",");
}

function String2Uint8Array(str: string) {
  return str.split(",").map(s => parseInt(s, 36));
}

export function mystify(variable: any): string {
  return JSON.stringify(serialise(variable, null));
}

export function clarify(variable: string) {
  return deserialise(JSON.parse(variable));
}