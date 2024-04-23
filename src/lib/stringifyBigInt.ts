export const jsonStringifyBigIntToString = (key, value) => {
  if (typeof value === "bigint") {
    return value.toString();
  } else {
    return value;
  }
};
