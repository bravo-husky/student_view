export default function delParams(params) {
  for (let i in params) {
    if (
      !params[i] &&
      typeof params[i] !== "boolean" &&
      typeof params[i] !== "number"
    ) {
      delete params[i];
    }
  }
  return params;
}
