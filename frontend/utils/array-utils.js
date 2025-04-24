/**
 * Shuffles an array in place using the Fisher-Yates (Knuth) algorithm.
 * Modifies the original array.
 * @param {Array} array The array to shuffle.
 */
export const shuffleArray = (array) => {
  if (!array || array.length <= 1) {
    return; // No need to shuffle empty or single-element arrays
  }
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
};

// Add other array utility functions here if needed in the future
