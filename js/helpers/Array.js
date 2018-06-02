//Array functions
//get the set of values that are in both arrays
export function arrayIntersection(a, b) {
  const setB = new Set(b);

  return [...new Set(a)].filter(x => setB.has(x));
}

export function arrayHasIntersection(a, b) {
  const setB = new Set(b);

  return [...new Set(a)].some(x => setB.has(x));
}

//does array 2 contain all the same values as array 1
export function arrayContainsAll (arr1, arr2) {
  return arr2.every(arr2Item => arr1.includes(arr2Item));
}

//Does these two arrays contain all the same data (non-order specific)
export function arraySameMembers (arr1, arr2) {
  return arrayContainsAll(arr1, arr2) && arrayContainsAll(arr2, arr1);
}

//will return items in arr1 that are not present in arr2
export function arrayDifference(arr1, arr2) {
  arr1 = [...new Set(arr1)];//putting into a set removes duplicates
  let set = new Set(arr2);//putting into set allows faster value lookup

  //turn a into an array, then filter to only include stuff that's not in arr2
  return arr1.filter(x => !set.has(x));
}

//Doesn't deal with negative ranges, etc
export function arrayRange(start, end) {
  const length = end - start;
  const arr = new Array(length);

  for(let i = 0; i < length; ++i) {
    arr[i] = start + i;
  }

  return arr;
}

export function arrayRemove(arr, item) {
  const index = arr.indexOf(item);

  if(index === -1) {
    return arr;
  } else {
    const newArr = [...arr];

    newArr.splice(index, 1);

    return newArr;
  }
}

export function uniqueArray(a) {
   return Array.from(new Set(a));
}
