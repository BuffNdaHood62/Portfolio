/**
 * Booking calendar availability.
 *
 * The original defect: `isSlotBooked` was `((dayIndex + 2) * (slotIndex + 3)) % 5 === 0`,
 * which takes *every* slot whenever `dayIndex ≡ 3 (mod 5)`. Two of the eight days
 * rendered five struck-through, non-clickable buttons under an "Available slots"
 * heading, with no explanation and no route forward. The availability is fabricated
 * anyway, so a sold-out day could only ever turn away an enquiry.
 *
 * This clicks all eight day buttons in the real DOM and counts what each leaves
 * bookable, so the guarantee is checked at the level a visitor experiences rather
 * than in the formula alone.
 */
export default {
  name: 'booking',
  reducedMotion: true,

  async run({ evaluate, waitFor, sleep }, t) {
    await waitFor(`!!document.querySelector('#contact button[aria-pressed]')`, 'the calendar');

    // Sanity-check the harness, not the app: without reduced motion the reveals are
    // mid-flight and counts can be read before the day buttons exist.
    t.check(
      'reduced motion is active',
      t.reducedMotion === true,
      'positions and counts are deterministic',
    );

    // Identify the two button groups by shape, not index. Both carry `aria-pressed`,
    // so day buttons are told apart from slot buttons by "contains two spans"
    // (weekday + date). Index-based selection breaks the moment layout changes.
    const daySel = `[...document.querySelectorAll('#contact button[aria-pressed]')].filter((b) => b.querySelector('span'))`;
    const slotSel = `[...document.querySelectorAll('#contact button[aria-pressed]')].filter((b) => !b.querySelector('span'))`;

    const days = await evaluate(`${daySel}.length`);
    t.check('eight day buttons rendered', days === 8, `found ${days}`);
    const slots = await evaluate(`${slotSel}.length`);
    t.check('five slot buttons rendered', slots === 5, `found ${slots}`);

    const enabled = [];
    for (let i = 0; i < days; i++) {
      await evaluate(`${daySel}[${i}].click()`);
      await sleep(220);
      const row = await evaluate(`(() => ({
        bookable: ${slotSel}.filter((b) => !b.disabled).length,
        empty: document.querySelector('#contact').innerText.includes('Every slot on this day is taken'),
      }))()`);
      enabled.push(row.bookable);
      t.check(
        `day ${i + 1} offers a slot`,
        row.bookable >= 1 && !row.empty,
        `${row.bookable}/5 bookable${row.empty ? ' (empty state shown)' : ''}`,
      );
    }

    t.log(`bookable per day: ${enabled.join(', ')}`);
  },
};
