import type { Message } from "discord.js";
import type { Game } from "#/lib/wordle/game";

export type DuoGame = {
  user1: {
    id: string;
    name: string;
    nextPlay: boolean;
  };
  user2: {
    id: string;
    name: string;
  };
  msg: Message;
  game: Game;
  channel: string;
}