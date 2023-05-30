export function getCurrDate(val: any) {
  let currVal = val;
  if (!currVal) {
    currVal = new Date().getTime();
  }
  const date =
    new Date(currVal).getFullYear() +
    "-" +
    (new Date(currVal).getMonth() + 1 < 10
      ? "0" + (new Date(currVal).getMonth() + 1)
      : new Date(currVal).getMonth() + 1) +
    "-" +
    (new Date(currVal).getDate() < 10
      ? "0" + new Date(currVal).getDate()
      : new Date(currVal).getDate()) +
    " " +
    (new Date(currVal).getHours() < 10
      ? "0" + new Date(currVal).getHours()
      : new Date(currVal).getHours()) +
    ":" +
    (new Date(currVal).getMinutes() < 10
      ? "0" + new Date(currVal).getMinutes()
      : new Date(currVal).getMinutes()) +
    ":" +
    (new Date(currVal).getSeconds() < 10
      ? "0" + new Date(currVal).getSeconds()
      : new Date(currVal).getSeconds());
  // 兼容safari
  return date.replace(/-/g, "/");
}
export function randomStr(type: string) {
  if (type === "numLetter") {
    return parseFloat(
      (Math.random() * 100).toString().replace(".", "")
    ).toString(32);
  } else {
    return (Math.random() * 100).toString().replace(".", "");
  }
}
export function flatArr(arr: Array<any>) {
  const returnArr = arr || [];
  return returnArr.flat();
}
/**
 * 删除html标签
 * @param {*} str
 * @returns
 */
export function delHtmlTag(str: string) {
  return str
    .replace(/<\/?.+?>/g, "")
    .replace(/&nbsp;/g, "")
    .replace(/&lt;/g, "")
    .replace(/&gt;/g, "");
}
