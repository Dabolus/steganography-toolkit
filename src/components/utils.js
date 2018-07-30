export const isPrime = (n) => {
  if (n === 1) {
    return false;
  }
  if (n === 2 || n === 3) {
    return true;
  } else if ((n % 2 === 0) || (n % 3 === 0)) {
    return false;
  } else {
    let p = 5;
    let w = 2;
    while (p * p <= n) {
      if (n % p === 0) {
        return false;
      }
      p += w;
      w = 6 - w;
    }
    return true;
  }
};

export const nextPrime = (n) => {
  if (n < 3) {
    return n + 1;
  }
  for (let currN = (n % 2) ? n + 2 : n + 1; currN < Number.MAX_SAFE_INTEGER; currN += 2) {
    if (isPrime(currN)) {
      return currN;
    }
  }
};
