/**
 * Accessibility invariants that no static gate covers.
 *
 * eslint-plugin-jsx-a11y catches markup problems at build time, but it cannot see
 * the rendered document: heading order after composition, whether a focused control
 * actually shows a focus indicator, or whether every button has an accessible name.
 * These are cheap to assert and silently regress.
 *
 * Deliberately asserts only things that are *currently true*, so the suite documents
 * the standard rather than inventing one. If a check here starts failing, either the
 * markup regressed or the standard changed — both worth knowing.
 */
export default {
  name: 'a11y',
  reducedMotion: true,

  async run({ evaluate, waitFor }, t) {
    await waitFor(`!!document.querySelector('h1')`, 'the h1');

    const outline = await evaluate(
      `[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
         .map((h) => h.tagName + '  ' + h.innerText.replace(/\\s+/g, ' ').trim().slice(0, 46))`,
    );
    t.log('heading outline, document order:');
    for (const line of outline) t.log('   ' + line);

    const h1Index = await evaluate(
      `[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].findIndex((h) => h.tagName === 'H1')`,
    );
    t.check(
      'the h1 is the first heading in document order',
      h1Index === 0,
      `h1 found at index ${h1Index}`,
    );

    const h1Count = await evaluate(`document.querySelectorAll('h1').length`);
    t.check('exactly one h1', h1Count === 1, `found ${h1Count}`);

    // Nav and Footer were landmarks from the start, but the content between them was
    // not, so "skip to main content" had nowhere to land. jsx-a11y does not require a
    // main landmark, which is why nothing caught it.
    const mainCount = await evaluate(`document.querySelectorAll('main').length`);
    t.check('exactly one main landmark', mainCount === 1, `found ${mainCount}`);

    // Not currently a live bug — there is no <form> in the app — but the implicit
    // type="submit" becomes one the moment anything is wrapped in a form.
    const noType = await evaluate(
      `[...document.querySelectorAll('button')].filter((b) => !b.hasAttribute('type')).length`,
    );
    t.check('every button declares a type', noType === 0, `${noType} missing`);

    const noName = await evaluate(
      `[...document.querySelectorAll('button')]
         .filter((b) => !b.innerText.trim() && !b.getAttribute('aria-label')).length`,
    );
    t.check('every button has an accessible name', noName === 0, `${noName} without`);

    // A disabled control that announces only its label leaves the user guessing why it
    // cannot be used. The calendar's booked slots were carried by `line-through` alone —
    // a CSS decoration no assistive technology reports — and the word "booked" appeared
    // nowhere in the card.
    const disabledSlots = await evaluate(
      `[...document.querySelectorAll('button[disabled]')]
         .map((b) => b.textContent.replace(/\\s+/g, ' ').trim())`,
    );
    // Assert there is something to examine first. `isSlotBooked` is deterministic, so the
    // default day always has exactly one booked slot; if that ever changes, the check
    // below would pass without looking at anything and read as coverage.
    t.check(
      'the calendar offers a disabled slot to examine',
      disabledSlots.length > 0,
      `${disabledSlots.length} disabled control(s)`,
    );
    // Derived, not hardcoded: any disabled control whose entire text is just a label
    // fails, whatever that label happens to be.
    const unexplained = disabledSlots.filter((text) => /^\d{2}:\d{2}$/.test(text));
    t.check(
      'every disabled slot explains why it is unavailable',
      unexplained.length === 0,
      `${unexplained.length} with no reason${unexplained.length ? `: ${unexplained.join(', ')}` : ''}`,
    );

    const focus = await evaluate(`(() => {
      const b = document.querySelector('button');
      b.focus();
      const s = getComputedStyle(b);
      return { outlineStyle: s.outlineStyle, outlineWidth: s.outlineWidth, visible: b.matches(':focus-visible') };
    })()`);
    t.check(
      'a focused button keeps a visible outline',
      focus.outlineStyle !== 'none' || !focus.visible,
      `outline ${focus.outlineStyle} ${focus.outlineWidth}, :focus-visible ${focus.visible}`,
    );
  },
};
