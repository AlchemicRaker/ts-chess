
// renders the square as a single character

import { traceGame } from "./game";
import { SquareDef, BoardDef, RANKS, FILES, GameDef } from "./model";

// capitals are black, lower case are white
export const renderSquare = (square: SquareDef): string => {
  if (!square.piece) {
    return ".";
  }
  if (square.piece.side == 'white') {
    return square.piece.type.toLowerCase();
  } else {
    return square.piece.type.toUpperCase();
  }
}

// render black on top
export const renderSquares = (board: BoardDef): string[][] => {
  const renderLines: string[][] = [];
  for(let rankNum = RANKS.length - 1; rankNum >= 0; rankNum--) {
    const rank = RANKS[rankNum];
    const renderLine: string[] = [];
    for(let fileNum = 0; fileNum < FILES.length; fileNum++) {
      const file = FILES[fileNum];
      // console.log(`rendering ${rank}, ${file}`);
      const square = board.rank[rank].file[file];
      renderLine.push(renderSquare(square));
    }
    renderLines.push(renderLine);
  }
  return renderLines;
}

export const renderBoard = (board: BoardDef): string => {
  let render = renderSquares(board);
  // add spaces and headers to all of this

  // insert rank numbers at the beginnings of lines
  for(let rankNum = 0; rankNum < RANKS.length; rankNum++) {
    const rank = RANKS[RANKS.length-rankNum-1];
    render[rankNum].unshift(rank);
  }

  // add a line at the top with the files
  render.unshift([' ', ...FILES]);

  return render.map(line => line.join(" ")).join("\n");
}

export const renderGame = (game: GameDef): string => {
  return renderBoard(traceGame(game));
}
