const VariableType = {
  Array: 1,
  Date: 2,
  RegExp: 3,
  Buffer: 4,
  string: 5,
  number: 6,
  boolean: 7,
  object: 8,
  null: 9,
  undefined: 0
};

export type MysteryType = {
  "t": number,
  "d": any,
  "n"?: string | null
};

function serialise(variable: any, name: string | null): MysteryType {
  if (variable === null) {
    return {
      "t": VariableType.null,
      "d": null,
      ...(name ? { n: name } : {})
    };
  } else if (variable === undefined) {
    return {
      "t": VariableType.undefined,
      "d": undefined,
      ...(name ? { n: name } : {})
    };
  } else if (variable.constructor === Array) {
    return {
      "t": VariableType.Array,
      "d": variable.map(v => serialise(v, null)),
      ...(name ? { n: name } : {})
    };
  } else if (variable.constructor === Date) {
    return {
      "t": VariableType.Date,
      "d": variable.toISOString(),
      ...(name ? { n: name } : {})
    }
  } else if (variable.constructor === RegExp) {
    return {
      "t": VariableType.RegExp,
      "d": variable.toString(),
      ...(name ? { n: name } : {})
    }
  } else if (variable.constructor === Buffer) {
    return {
      "t": VariableType.Buffer,
      "d": JSON.parse(JSON.stringify(variable)).data,
      ...(name ? { n: name } : {})
    }
  } else if (typeof variable === "string") {
    return {
      "t": VariableType.string,
      "d": variable,
      ...(name ? { n: name } : {})
    }
  } else if (typeof variable === "number") {
    return {
      "t": VariableType.number,
      "d": variable,
      ...(name ? { n: name } : {})
    }
  } else if (typeof variable === "boolean") {
    return {
      "t": VariableType.boolean,
      "d": variable,
      ...(name ? { n: name } : {})
    }
  } else if (typeof variable === "object") {
    return {
      "t": VariableType.object,
      "d": Object.entries(variable).map(
        ([n, d]) => serialise(d, n)
      ),
      ...(name ? { n: name } : {})
    }
  }
  throw ("Cannot mysterise data type");
}

function deserialise(variable: MysteryType) {
  if (variable["t"] === VariableType.null) {
    return null;
  } else if (variable["t"] === VariableType.undefined) {
    return undefined;
  } else if (variable["t"] === VariableType.Array) {
    return variable["d"].map((d: MysteryType) => deserialise(d));
  } else if (variable["t"] === VariableType.Date) {
    return new Date(variable["d"]);
  } else if (variable["t"] === VariableType.RegExp) {
    const parts = /\/(.*)\/(.*)/.exec(variable["d"]);
    if (parts) {
      return new RegExp(parts[1], parts[2]);
    } else {
      return null;
    }
  } else if (variable["t"] === VariableType.Buffer) {
    return Buffer.from(variable["d"]);
  } else if (variable["t"] === VariableType.string) {
    return variable["d"];
  } else if (variable["t"] === VariableType.number) {
    return variable["d"];
  } else if (variable["t"] === VariableType.boolean) {
    return variable["d"];
  } else if (variable["t"] === VariableType.object) {
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