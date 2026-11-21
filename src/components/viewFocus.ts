// viewFocus.ts: focus on the heading of the view (2c-plan C7; R5 A11Y-22, A11Y-23). The shell uses it
// after a change of route and after a "Try again"; the look-up dialog uses it when the control that
// opened it is gone.
//
// Focus goes to the first h2 of the view. The heading gets tabindex="-1", so that a script can
// focus it. Each station draws its heading with React (Wave 2c). When the view has no h2 yet,
// focus is on the view, and it moves to the heading when the heading comes, if it is still on the
// view. The return value stops the wait.
export function focusViewHeading(main: HTMLElement): () => void {
  const toHeading = (heading: HTMLElement) => {
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    heading.focus();
  };
  const now = main.querySelector('h2');
  if (now) { toHeading(now); return () => {}; }
  main.focus();
  const wait = new MutationObserver(() => {
    if (document.activeElement !== main) { wait.disconnect(); return; }
    const heading = main.querySelector('h2');
    if (heading) { wait.disconnect(); toHeading(heading); }
  });
  wait.observe(main, { childList: true, subtree: true });
  return () => wait.disconnect();
}
