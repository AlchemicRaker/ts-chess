import { runTerminal } from "./term";

runTerminal();

// import { cacheGame, gameTurnAnalyze, GameTurnAnalyzeMode, moveToString, restoreGameFromMoves, stringToMove, stringToMoveGuarantee } from "./game";
// import { BoardDef, FILES, GameDef, INITIAL_BOARD, PositionDef, RANKS, SquareDef } from "./model";
// import { renderGame } from "./render";



// const myGame: GameDef = {
//   moves: [
//     "c2c4~c3", "d7d5~d6",
//     "c4c5", "b7b5~b6", // stop here to check en passant
//     "d2d3", "d8d6",
//     "d1c2", "h7h6",
//     "c1e3", "g7g6", // move bishop so it's blocking queen
//     // "c1f4", "g7g6", // move bishop so it is captured by queen
//     "b1a3", "h8h7", //stop here to check castling
//     "f2f4~f3", "d6f4", //stop here to check castling and king threat
//     // "e1d1", "e8d8", //move kings
//     // "d1e1", "d8e8", //move kings back, no more castling
//     "e1c1xa1!d1", // castle!
//   ].map(stringToMoveGuarantee),
// };
// const myGame = restoreGameFromMoves([
//     "c2c4", "d7d5",
//     "c4c5", "b7b5", // stop here to check en passant
//     "d2d3", "d8d6",
//     "d1c2", "h7h6",
//     "c1e3", "g7g6", // move bishop so it's blocking queen
//     // "c1f4", "g7g6", // move bishop so it is captured by queen
//     "b1a3", "h8h7", //stop here to check castling
//     "f2f3", "d6f4", //stop here to check castling and king threat
//     // "e1d1", "e8d8", //move kings
//     // "d1e1", "d8e8", //move kings back, no more castling
//     "e1c1", "f4e3", // castle! check!
//     "c1b1", "b8a6",

//     // go for pawn promotion
//     "c5c6", "a8b8",
//     "h2h4", "b8b7",
//     "c6b7", "g6g5",
//     "b7b8=Q", "a6b4",
//     "b8c8",
// ]);
// const myGame = restoreGameFromMoves([
//     "c4", "d5",
//     "c5", "b5",
//     "d3", "Qd6",
//     "Qc2", "h6",
//     "Be3", "g6",
//     "Na3", "Rh7",
//     "f3", "Qf4",
//     "O-O-O", "Qe3",
//     "Kb1", "Na6",
//     "c6", "Rb8",
//     "h4", "Rb7",
//     "b7", "g5",
//     "c8=Q",
// ]);

// if (typeof myGame === "string") {
//   console.log(myGame);
//   process.exit();
// }

// // console.log(renderGame(myGame));

// // console.log('caching...')
// // const cachedGame: GameDef = cacheGame(myGame);
// // console.log('cached')
// // cachedGame.moves.push(stringToMoveGuarantee("b1c3"))

// console.log(renderGame(myGame));

// const state = gameTurnAnalyze(myGame, GameTurnAnalyzeMode.THREATS_AND_MOVES);
// state.messages.forEach(message => console.log(message));
// console.log('possible next moves:');
// console.log(state.moves.map(moveToString));
