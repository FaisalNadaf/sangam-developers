/**
 * Colour helpers.
 *
 * The two company marks and the group accent are chosen to be seen as fills —
 * a leaf green and a sky blue, both fairly light. Set as *type* on one of the
 * tinted paper surfaces they land around 4.2:1, which is under AA for the
 * small sizes the eyebrows and chips use.
 *
 * `onTint` darkens an accent toward the ink without moving its hue, so a label
 * still reads as the company's colour and still clears 4.5:1 on `canvas-2` and
 * `canvas-3`. It takes any CSS colour, so call sites can keep passing a custom
 * property and the arithmetic happens in the browser.
 */
export const onTint = (accent: string) => `color-mix(in srgb, ${accent} 84%, #0b1a10)`
