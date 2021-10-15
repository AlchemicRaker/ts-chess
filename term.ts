import { terminal } from "terminal-kit"
import { gameTurnAnalyze, GameTurnAnalyzeMode, restoreGameFromMoves } from "./game";
import { GameDef } from "./model";
import { renderGame } from "./render";

export async function runTerminal() {
  terminal.fullscreen(true);

  // start a fresh game
  let game = <GameDef> restoreGameFromMoves([]);
  let analysis = gameTurnAnalyze(game, GameTurnAnalyzeMode.THREATS_AND_MOVES);
  let message = "";

  while (true) {
    terminal.moveTo(1, 1);
    terminal("How about a nice game of chess?");

    // draw the board
    terminal.moveTo(2, 3);
    terminal.wrapColumn({width: null, x: 2});
    terminal.wrap(renderGame(game));

    
    terminal.moveTo(4, 13);
    terminal.eraseLine();
    terminal.eraseLine(message);

    terminal.moveTo(1, 15);

    if (analysis.checkmate) {
      terminal.eraseLine(`game over, press enter to continue...`);
      await terminal.inputField().promise;
      game = <GameDef> restoreGameFromMoves([]);
      analysis = gameTurnAnalyze(game, GameTurnAnalyzeMode.THREATS_AND_MOVES);
      message = "";
      continue;
    }

    terminal.eraseLine(`${analysis.turn}'s move: `);
    const input = await terminal.inputField().promise;

    if (input == undefined || input == "") continue;

    if (['q', 'quit', 'exit', 'end'].includes(input)) {
      break;
    }

    // try reading the input like a move
    const tryMove = restoreGameFromMoves([input], game);

    if (typeof tryMove == 'string') {
      message = tryMove;
      continue;
    }

    game = tryMove;
    analysis = gameTurnAnalyze(game, GameTurnAnalyzeMode.THREATS_AND_MOVES);
    message = analysis.messages.join(", ");
  }
  // terminal.waitFor()
  terminal.fullscreen(false);
  process.exit();
}