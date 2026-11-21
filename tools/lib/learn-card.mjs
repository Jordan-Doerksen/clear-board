// tools/lib/learn-card.mjs: the learn card of the Drill, for the browser gates (2c-plan C11,
// ruling LEARN-GAP, row U-28).
//
// Job U1-D shows an item one time on a learn card before its first question. The card has the hook
// data-cb="learn", and its control the hook data-cb="learn-next". A gate that waits for the first
// question presses the control while a learn card shows, and then goes on. The helper works the same
// with no learn card in the page: it then presses nothing. The smoke test (tests/browser/smoke.mjs)
// and the look harness (tools/look/look.mjs) use this one helper.
//
// Each wait is a wait on the state of the page, never on time: a card shows, or an element of
// `until` shows; after a press, the card goes, or another card or other words show.

export const LEARN_CARD = '[data-cb="learn"]';
export const LEARN_NEXT = '[data-cb="learn-next"]';

// The most cards that the helper passes. A session has 10 questions or fewer, so it has 10 new
// items or fewer. A higher count means that the control does not move the page on.
const MAX_CARDS = 40;

// Presses the control of each learn card that shows, until no card shows and an element of `until`
// shows. Returns the count of cards that the helper passed. Throws an Error with a message when the
// control does not move the page on.
//
// An element "shows" when it has a box and its visibility is not hidden. The three functions that
// run in the page each hold that test, because a function that runs in the page cannot reach a
// function of this module.
export async function passLearnCards(page, until, { card = LEARN_CARD, next = LEARN_NEXT, max = MAX_CARDS } = {}) {
  for (let passed = 0; ; passed++) {
    const state = await page.waitForFunction(([cardSelector, untilSelector]) => {
      const shows = (selector) => [...document.querySelectorAll(selector)].some((el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden');
      if (shows(cardSelector)) return 'card';
      return shows(untilSelector) ? 'until' : false;
    }, [card, until]).catch((err) => {
      throw new Error(`no learn card (${card}) and no element of ${until} showed${passed ? ` after ${passed} learn cards` : ''}: ${String(err.message).split('\n')[0]}`);
    });
    if ((await state.jsonValue()) === 'until') return passed;
    if (passed >= max) throw new Error(`more than ${max} learn cards (${card}) showed before ${until}`);
    // Keep the card that shows and its words, press its control, and wait until that card is gone,
    // or another card or other words show. A card that keeps its element and gets the words of the
    // next item counts as another card.
    await page.evaluate((cardSelector) => {
      const el = [...document.querySelectorAll(cardSelector)].find((e) => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden');
      window.__cbLearnCard = { el, words: el.innerText };
    }, card);
    await page.locator(next).filter({ visible: true }).first().click();
    await page.waitForFunction((cardSelector) => {
      const el = [...document.querySelectorAll(cardSelector)].find((e) => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden');
      const before = window.__cbLearnCard;
      return !el || el !== before.el || el.innerText !== before.words;
    }, card).catch((err) => {
      throw new Error(`the control ${next} did not move the page on: learn card ${passed + 1} still shows after the press: ${String(err.message).split('\n')[0]}`);
    });
  }
}
