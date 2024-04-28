export const words = [
  "avion",
  "belle",
  "chien",
  "droit",
  "eclat",
  "forme",
  "givre",
  "havre",
  "ideal",
  "jouer",
  "lourd",
  "mains",
  "noyer",
  "ombre",
  "porte",
  "quite",
  "rouge",
  "sable",
  "table",
  "usure",
  "vivre",
  "wagon",
  "zebre",
];

export const randomWord = (): string => {
  return words[Math.floor(Math.random() * words.length)];
};