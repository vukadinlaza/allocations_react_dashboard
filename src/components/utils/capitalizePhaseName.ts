export default function capitalizePhaseName(phase: string): string {
  return phase
    .split('-')
    .reduce((acc, str) => {
      const capitalizedStr = str[0].toUpperCase() + str.slice(1);
      acc.push(capitalizedStr);
      return acc;
    }, [] as string[])
    .join('-');
}
