export function useViewTransition() {
  return function transitionTo(fn: () => void): void {
    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(fn);
    } else {
      fn();
    }
  };
}
