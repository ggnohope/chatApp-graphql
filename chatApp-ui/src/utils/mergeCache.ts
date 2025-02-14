// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function merge(existing: any, incoming: any, { args }: any) {
  const merged = existing ? existing.slice(0) : [];
  for (let i = 0; i < incoming.length; ++i) {
    merged[args.skip + i] = incoming[i];
  }
  return merged;
}
