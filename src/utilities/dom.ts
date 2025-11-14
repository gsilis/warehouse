export function aspectRatioFrom(dom?: Element): number {
  if (!dom) return 1;
  return dom.clientWidth / dom.clientHeight;
}