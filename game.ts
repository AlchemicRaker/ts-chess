import { GameDef, PositionDef, SquareDef, INITIAL_BOARD, BoardDef, RANKS, FILES, MoveDef, File, Rank, positionsEqual, PieceDef, PieceType } from "./model";
import { PIECE_MAP } from "./piece";


export const traceSquare = (game: GameDef, position: PositionDef): SquareDef => {
  let tracePosition = position;
  let hasMoved: undefined | true = undefined;
  const backToMove: number = game.cache ? game.cache.move : 0;
  let promotedTo: PieceType | undefined;
  for(let i = game.moves.length - 1; i >= backToMove; i--) {
    const move = game.moves[i];
    if (positionsEqual(move.to, tracePosition)) {
      if (move.promotesTo) {
        promotedTo = move.promotesTo;
      }
      tracePosition = move.from;
      hasMoved = true;
      // console.log(`tracing ${JSON.stringify(position)} to ${JSON.stringify(tracePosition)}`);
    } else if (positionsEqual(move.from, tracePosition)) {
      return {}; // it's an empty square now
    } else if (move.capturesAt && positionsEqual(move.capturesAt, tracePosition)) {
      return {}; // this move captured the pawn or moved a rook that used to be at move.capturesAt
    } else if (move.rookAt && positionsEqual(move.rookAt, tracePosition)) {
      if (!move.capturesAt) throw new Error("Must define a capturesAt if rookAt is defined");
      const rookPiece = (game.cache ? game.cache.board : INITIAL_BOARD).rank[move.capturesAt.rank].file[move.capturesAt.file]
      if (!rookPiece.piece) throw new Error("No piece where the rook was expected for castling");
      return {piece: { ...rookPiece.piece, hasMoved: true }};
    }
  }
  const square = (game.cache ? game.cache.board : INITIAL_BOARD).rank[tracePosition.rank].file[tracePosition.file];
  if (square.piece != undefined) {
    return {
      piece: {
        side: square.piece.side,
        type: promotedTo || square.piece.type,
        hasMoved
      },
    };
  } else {
    return square;
  }
}

export const traceGame = (game: GameDef): BoardDef => {
  return { 
    rank: <any> Object.fromEntries(RANKS.map(rank => 
      [rank, { 
        file: Object.fromEntries(FILES.map(file => [file, traceSquare(game, {rank, file})])
      )}]))
  }
}

export const cacheGame = (game: GameDef): GameDef => {
  return {
    moves: game.moves,
    cache: {
      board: traceGame(game),
      move: game.moves.length,
    }
  }
}

const strMoveRegex = /^(?<fromFile>[a-h])(?<fromRank>[1-8])(?<toFile>[a-h])(?<toRank>[1-8])(x(?<capturesAtFile>[a-h])(?<capturesAtRank>[1-8]))?(~(?<enPassantAtFile>[a-h])(?<enPassantAtRank>[1-8]))?(!(?<rookAtFile>[a-h])(?<rookAtRank>[1-8]))?(=(?<promotesTo>[RNBQ]))?$/;
export const stringToMove = (str: string): MoveDef | { error: string } => {
  const matches = strMoveRegex.exec(str);
  if (!matches) return { error: "Not a valid move format" };
  const from = {
    file: matches?.groups?.fromFile as File,
    rank: matches?.groups?.fromRank as Rank,
  };
  const to = {
    file: matches?.groups?.toFile as File,
    rank: matches?.groups?.toRank as Rank,
  };
  const capturesAt = (matches?.groups?.capturesAtFile && matches?.groups?.capturesAtRank) ? {
    file: matches?.groups?.capturesAtFile as File,
    rank: matches?.groups?.capturesAtRank as Rank,
  } : undefined;
  const enPassantAt = (matches?.groups?.enPassantAtFile && matches?.groups?.enPassantAtRank) ? {
    file: matches?.groups?.enPassantAtFile as File,
    rank: matches?.groups?.enPassantAtRank as Rank,
  } : undefined;
  const rookAt = (matches?.groups?.rookAtFile && matches?.groups?.rookAtRank) ? {
    file: matches?.groups?.rookAtFile as File,
    rank: matches?.groups?.rookAtRank as Rank,
  } : undefined;
  const promotesTo = (matches?.groups?.promotesTo) ? <PieceType> matches.groups.promotesTo : undefined;
  return {
    from,
    to,
    capturesAt,
    enPassantAt,
    rookAt,
    promotesTo,
  }
}

export const stringToMoveGuarantee = (str: string): MoveDef => {
  const r = stringToMove(str);
  if ((<{error?: string}>r).error != undefined) throw new Error((<{error?: string}>r).error);
  return <MoveDef> r;
}

export const posToString = (pos: PositionDef): string => {
  return `${pos.file}${pos.rank}`;
}

export const moveToString = (move: MoveDef): string => {
  const capturesAt = move.capturesAt ? `x${posToString(move.capturesAt)}` : '';
  const enPassantAt = move.enPassantAt ? `~${posToString(move.enPassantAt)}` : '';
  const rookAt = move.rookAt ? `!${posToString(move.rookAt)}` : '';
  const promotion = move.promotesTo ? `=${move.promotesTo}` : '';
  return `${posToString(move.from)}${posToString(move.to)}${capturesAt}${enPassantAt}${rookAt}${promotion}`;
}

function mapEachSquare<T>(board: BoardDef, fn: (position: PositionDef, square: SquareDef) => T): T[] {
  const output: T[] = [];
  Object.keys(board.rank)
  .forEach(rank => Object.keys(board.rank[<Rank> rank].file)
  .forEach(file => output.push(fn({rank: <Rank>rank, file: <File>file}, board.rank[<Rank>rank].file[<File>file]))));
  return output;
}

export enum GameTurnAnalyzeMode {
  THREATS_AND_MOVES, // look at the enemy's threats and my possible moves for my turn
  ONLY_THREATS, // look at the enemy's threats during my turn
  REVERSE_THREATS, // for looking ahead and checking the enemy's threats during their turn
}

export function findPiece(game: GameDef, piece: PieceDef): PositionDef | undefined {
  const board = traceGame(game);
  for (const rankKey in board.rank) {
    if (Object.prototype.hasOwnProperty.call(board.rank, rankKey)) {
      const rank = board.rank[<Rank> rankKey];

      for (const fileKey in rank.file) {
        if (Object.prototype.hasOwnProperty.call(rank.file, fileKey)) {
          const square = rank.file[<File> fileKey];

          if (!square.piece) continue;
          if (square.piece.side == piece.side && square.piece.type == piece.type) {
            return {
              rank: <Rank> rankKey,
              file: <File> fileKey,
            };
          }
          
        }
      }
      
    }
  }
  return undefined;
}

export const gameTurnAnalyze = (game: GameDef, mode: GameTurnAnalyzeMode): {moves:MoveDef[], threats:PositionDef[], messages:string[], inCheck: boolean, checkmate: boolean, turn: 'white' | 'black'} => {
  //who's turn is it?
  const turn = game.moves.length % 2 == 0 ? 'white' : 'black';
  const board = traceGame(game);
  const enPassantAt = game.moves.length > 0 ? game.moves[game.moves.length-1].enPassantAt : undefined;
  const enPassantCapturesAt = enPassantAt ? game.moves[game.moves.length-1].to : undefined;
  const threatSide: (side: 'white' | 'black') => boolean = mode != GameTurnAnalyzeMode.REVERSE_THREATS ? s => s == turn : s => s != turn;
  const messages: string[] = [];
  let inCheck: boolean = false;
  
  //get the opponent's threats
  const threats: PositionDef[] = mapEachSquare(board, (position, square) => {
    if (!square.piece || threatSide(square.piece.side)) return undefined;
    const piece = PIECE_MAP[square.piece.type];
    const status = piece.status(square.piece, position, game, {});
    return status.threatenedSquares;
  })
  .flatMap(maybeThreats => maybeThreats || [])
  // deduplicate threatened positions:
  .reduce((acc, pos) => acc.filter(apos => positionsEqual(apos, pos)).length > 0 ? acc : [...acc, pos], <PositionDef[]>[]);

  if (mode == GameTurnAnalyzeMode.ONLY_THREATS || mode == GameTurnAnalyzeMode.REVERSE_THREATS) {
    return {threats, moves:[], messages, inCheck: false, checkmate: false, turn};
  }

  //then calculate player's moves (limited by enemy's threats)
  const moves = mapEachSquare(board, (position, square) => {
    if (!square.piece || square.piece.side != turn) return ;
    const piece = PIECE_MAP[square.piece.type];
    const status = piece.status(square.piece, position, game, {threats, enPassantAt, enPassantCapturesAt});
    return status.possibleMoves;
  }).flatMap(maybeMoves => maybeMoves || []);

  // remove any moves that end with our king being threatened
  // if no moves remain, it is because we are in checkmate
  
  const kingPos = findPiece(game, {side: turn, type: 'K'});
  if (kingPos) {
    const kingThreats = threats.filter(threatPos => positionsEqual(threatPos, kingPos));
    inCheck = kingThreats.length > 0;
  }

  function moveEndsInThreat(move: MoveDef): boolean {
    const nextTurn: GameDef = {moves: [...game.moves, move], cache: game.cache};
    
    const kingPos = findPiece(nextTurn, {side: turn, type: 'K'});

    // there is no king left, king can't be threatened?
    if (kingPos == undefined) return false;
    
    const { threats } = gameTurnAnalyze(nextTurn, GameTurnAnalyzeMode.REVERSE_THREATS);
    return threats.filter(threatPos => positionsEqual(threatPos, kingPos)).length > 0;
  }

  const safeMoves = moves.filter(move => !moveEndsInThreat(move));

  const checkmate = safeMoves.length == 0;

  if (checkmate) {
    messages.push("Checkmate!");
  } else if (inCheck) {
    messages.push("Check!");
  }

  return {moves: safeMoves, threats, messages, inCheck, checkmate, turn};
}

const algebraicNotationRegex = /(?<piece>[PRNBQK])?(?<fromFile>[a-h])?(?<fromRank>[1-8])?[-x]?(?<toFile>[a-h])(?<toRank>[1-8])(=(?<promote>[RNBQ]))?/;
export function restoreGameFromMoves(moveList: string[], baseGame?: GameDef): GameDef | string {
  let game: GameDef = baseGame || {moves: []};
  let st = new Date().getMilliseconds();
  for (let turn = 0; turn < moveList.length; turn++) {
    const moveStr = moveList[turn];
    const player = game.moves.length % 2 == 0 ? 'white' : 'black';

    const algebraicNotationMatches = algebraicNotationRegex.exec(moveStr);
    const moveMatchers: ((move: MoveDef)=>boolean)[] = [];
    if (algebraicNotationMatches && algebraicNotationMatches.groups) {
      const anTo = {
        rank: <Rank> algebraicNotationMatches.groups.toRank, 
        file: <File> algebraicNotationMatches.groups.toFile,
      };
      moveMatchers.push(({to}) => positionsEqual(to, anTo));
      
      if (algebraicNotationMatches.groups.fromRank) {
        moveMatchers.push(({from: {rank}}) => rank == <Rank> algebraicNotationMatches.groups?.fromRank);
      }
      if (algebraicNotationMatches.groups.fromFile) {
        moveMatchers.push(({from: {file}}) => file == <File> algebraicNotationMatches.groups?.fromFile);
      }
      // if it's a full from, only use pieceType if its defined, otherwise can imply that it's a pawn
      if (algebraicNotationMatches.groups.piece || !algebraicNotationMatches.groups.fromRank || !algebraicNotationMatches.groups.fromFile) {
        const assertPieceType: PieceType = <PieceType> algebraicNotationMatches.groups.piece || 'P';
        
        // otherwise if it's not defined
        moveMatchers.push(({from}) => {
          const tracePiece = traceSquare(game, from);
          return tracePiece.piece != undefined && tracePiece.piece.type == assertPieceType;
        });
      }
      if (algebraicNotationMatches.groups.promote) {
        moveMatchers.push(({promotesTo}) => promotesTo == algebraicNotationMatches.groups?.promote);
      }
    } else if (moveStr == "O-O") {
      const kingRank: Rank = player == 'white' ? '1' : '8';
      const shortCastleKingFrom: PositionDef = {rank: kingRank, file: 'e'};
      const shortCastleKingTo: PositionDef = {rank: kingRank, file: 'g'}
      moveMatchers.push(({from, to})=>positionsEqual(from,shortCastleKingFrom) && positionsEqual(to,shortCastleKingTo));
    } else if (moveStr == "O-O-O") {
      const kingRank: Rank = player == 'white' ? '1' : '8';
      const longCastleKingFrom: PositionDef = {rank: kingRank, file: 'e'};
      const longCastleKingTo: PositionDef = {rank: kingRank, file: 'c'}
      moveMatchers.push(({from, to})=>positionsEqual(from,longCastleKingFrom) && positionsEqual(to,longCastleKingTo));
    }

    const { moves } = gameTurnAnalyze(game, GameTurnAnalyzeMode.THREATS_AND_MOVES);

    const matchMoves = moves.filter(move => {
      // const fullMoveStr = moveToString(move);
      // return fullMoveStr.startsWith(moveStr);
      
      // move matching is a pain.
      return moveMatchers.every(matcher => matcher(move));
    });

    if (matchMoves.length > 1) {
      return `ambiguous move "${moveStr}", could be ${matchMoves.map(moveToString).join(",")}`;
    }
    if (matchMoves.length == 0) {
      return `illegal move "${moveStr}"`;
    }

    const matchedMove = matchMoves[0];
    
    game.moves.push(matchedMove);
    game = cacheGame(game);
  }
  let et = new Date().getMilliseconds();
  // console.log(`restore time: ${et-st}`);
  return game;
}
