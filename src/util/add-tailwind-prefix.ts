export const addTailwindPrefix = (str: string) =>
    str.replace(/(\S+)/gm, 'mm-$1');
