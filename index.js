/**
 * EchoWorld - A simple echo utility
 */

/**
 * Echo function that returns the input with "World" appended
 * @param {string} input - The input string to echo
 * @returns {string} The input string with "World" appended
 */
function echoWorld(input = '') {
  return `${input} World`;
}

/**
 * Simple echo function that returns the input as-is
 * @param {string} input - The input string to echo
 * @returns {string} The input string
 */
function echo(input = '') {
  return input;
}

module.exports = {
  echoWorld,
  echo
};
