
const compose = (...fns) => fns.reduce(compose2);

const compose2 = (f, g) => async (...args) => f(await g(...args));

export { compose };