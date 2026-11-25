interface FinishingElement {
  /** `end` is the ISO time from the element's data-end attribute. */
  dataset: { end?: string };
  remove(): void;
}

/** Remove the elements whose end time has passed. One with no readable time stays. */
export function removeFinished(elements: Iterable<FinishingElement>, now: number): void {
  for (const element of Array.from(elements)) {
    if (Date.parse(element.dataset.end ?? "") <= now) element.remove();
  }
}
