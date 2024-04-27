import type { InvalidWordError } from "#/lib/wordle/error/invalid_word_error";

export type Char = "a"|"b"|"c"|"d"|"e"|"f"|"g"|"h"|"i"|"j"|"k"|"l"|"m"|
  "n"|"o"|"p"|"q"|"r"|"s"|"t"|"u"|"v"|"w"|"x"|"y"|"z"|"?";

export type Win = {
  status: "win";
  // score: number; soon, if y continue project after challenge
  rounds: RoundInfo[];
  //in ms
  time: number;
}

export type InvalidWord = {
  status: "invalid";
  error: InvalidWordError;
}

export type CharColor = "green"|"yellow"|"grey"|"default";

export type WordCharInfo = {
  value: Char;
  position: number;
  color: CharColor;
}

export type RoundInfo = {
  chars: WordCharInfo[];
}

export type Round = {
  status: "round";
  rounds: RoundInfo[];
  chars: Record<Char, CharColor>;
}

export type Lose = {
  status: "lose";
  rounds: RoundInfo[];
  wordToFind: string;
}

export type InternalError = {
  status: "internalError";
  message: string;
}

export type Result = Win|InvalidWord|Round|Lose|InternalError;