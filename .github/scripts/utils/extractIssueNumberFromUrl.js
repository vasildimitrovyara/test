/**
 * Extracts the pull/issue number from urls like "https://api.github.com/.../pulls/6"
 */
module.exports = (url = '') => {
  const split = url.split('/');
  if (!split.length) {
    return undefined;
  }

  const lastElement = split[split.length - 1];

  if (!lastElement || isNaN(lastElement)) {
    return undefined;
  }

  return lastElement;
};
