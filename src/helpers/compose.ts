/* eslint-disable @typescript-eslint/no-explicit-any */

const compose: ComposeFn = (...fns: any[]) => fns.reduce(pipe);

const pipe: PipeFn =
    (f: any, g: any) => async (...args: any[]) => f(await g(...args));

export { compose };

interface ComposeFn{
    (...fns): any
}

interface PipeFn {
    (f, g): any
}