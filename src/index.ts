import * as pako from 'pako';

export type VariableType = "Array" | "Date" | "RegExp" | "Buffer" | "string" | "number" | "boolean" | "object" | "null" | "undefined";

export type MysteryType = {
  "type": VariableType,
  "data": any,
  "name"?: string | null
};

function serialise(variable: any, name: string | null): MysteryType {
  if (variable === null) {
    return {
      "type": "null",
      "data": null,
      ...(name ? { name: name } : {})
    };
  } else if (variable === undefined) {
    return {
      "type": "undefined",
      "data": undefined,
      ...(name ? { name: name } : {})
    };
  } else if (variable.constructor === Array) {
    return {
      "type": "Array",
      "data": variable.map(v => serialise(v, null)),
      ...(name ? { name: name } : {})
    };
  } else if (variable.constructor === Date) {
    return {
      "type": "Date",
      "data": variable.toISOString(),
      ...(name ? { name: name } : {})
    }
  } else if (variable.constructor === RegExp) {
    return {
      "type": "RegExp",
      "data": variable.toString(),
      ...(name ? { name: name } : {})
    }
  } else if (variable.constructor === Buffer) {
    return {
      "type": "Buffer",
      "data": JSON.parse(JSON.stringify(variable)).data,
      ...(name ? { name: name } : {})
    }
  } else if (typeof variable === "string") {
    return {
      "type": "string",
      "data": variable,
      ...(name ? { name: name } : {})
    }
  } else if (typeof variable === "number") {
    return {
      "type": "number",
      "data": variable,
      ...(name ? { name: name } : {})
    }
  } else if (typeof variable === "boolean") {
    return {
      "type": "boolean",
      "data": variable,
      ...(name ? { name: name } : {})
    }
  } else if (typeof variable === "object") {
    return {
      "type": "object",
      "data": Object.entries(variable).map(
        ([name, data]) => serialise(data, name)
      ),
      ...(name ? { name: name } : {})
    }
  }
  throw ("Cannot mysterise data type");
}

function deserialise(variable: MysteryType) {
  if (variable["type"] === "null") {
    return null;
  } else if (variable["type"] === "undefined") {
    return undefined;
  } else if (variable["type"] === "Array") {
    return variable["data"].map((d: MysteryType) => deserialise(d));
  } else if (variable["type"] === "Date") {
    return new Date(variable["data"]);
  } else if (variable["type"] === "RegExp") {
    const parts = /\/(.*)\/(.*)/.exec(variable["data"]);
    if (parts) {
      return new RegExp(parts[1], parts[2]);
    } else {
      return null;
    }
  } else if (variable["type"] === "Buffer") {
    return Buffer.from(variable["data"]);
  } else if (variable["type"] === "string") {
    return variable["data"];
  } else if (variable["type"] === "number") {
    return variable["data"];
  } else if (variable["type"] === "boolean") {
    return variable["data"];
  } else if (variable["type"] === "object") {
    let obj = {};
    variable["data"].forEach((v: MysteryType) => {
      if (v !== null && v !== undefined) {
        if (v["name"]) {
          obj = { ...obj, [v["name"]]: deserialise(v) };
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
  const serializedData = JSON.stringify(serialise(variable, null));
  const compressedData = pako.deflate(serializedData, { raw: true });
  const str = Uint8Array2String(compressedData);
  return str;
}

export function clarify(variable: string) {
  const compressedData = String2Uint8Array(variable);
  const decompressedData = pako.inflate(new Uint8Array(compressedData), {
    raw: true,
    to: "string",
  });
  return deserialise(JSON.parse(decompressedData));
}