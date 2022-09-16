const contains = (arr, searchItem) => {
  return arr.includes(searchItem) ? "True" : "False";
};
const arr = [2, 5, 9, 6];

console.log(contains(arr, 5));
