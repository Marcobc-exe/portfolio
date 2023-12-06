/**
 * Funciones que permiten capitalizar textos
 *
 * @param {string} str - texto a capitalizar
 * @returns retorna el texto capitalizado
 */
const capitalizeText = (str) => {
  const lowerText = str.toLowerCase();
  return str.charAt(0).toUpperCase() + lowerText.slice(1);
};

/**
 *
 * @param {string} str
 * @returns retorna cada palabra del texto en forma capitalizada
 */
const capitalizeSentence = (str) => {
  const sentence = str.toLowerCase();
  const words = sentence.split(" ");

  return words
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
};

export { capitalizeText, capitalizeSentence };
