/**
 * Ensure Education MASCOT ECOSYSTEM (DEPRECATED & REPLACED)
 * Replaced by js/character-system.js which enforces 100% unique, non-repeating characters.
 */

function populateMascots() {
  // Clean up any stale mascot wrappers if present
  document.querySelectorAll('.mascot-wrapper').forEach(el => el.remove());
}

window.populateMascots = populateMascots;
