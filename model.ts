

export const INITIAL_BOARD: BoardDef = {
  rank: {
    '8': {
      file: {
        'a' : {piece: {side: 'black', type: 'R'} },
        'b' : {piece: {side: 'black', type: 'N'} },
        'c' : {piece: {side: 'black', type: 'B'} },
        'd' : {piece: {side: 'black', type: 'Q'} },
        'e' : {piece: {side: 'black', type: 'K'} },
        'f' : {piece: {side: 'black', type: 'B'} },
        'g' : {piece: {side: 'black', type: 'N'} },
        'h' : {piece: {side: 'black', type: 'R'} },
      }
    },
    '7': {
      file: {
        'a' : {piece: {side: 'black', type: 'P'} },
        'b' : {piece: {side: 'black', type: 'P'} },
        'c' : {piece: {side: 'black', type: 'P'} },
        'd' : {piece: {side: 'black', type: 'P'} },
        'e' : {piece: {side: 'black', type: 'P'} },
        'f' : {piece: {side: 'black', type: 'P'} },
        'g' : {piece: {side: 'black', type: 'P'} },
        'h' : {piece: {side: 'black', type: 'P'} },
      }
    },
    '6': {
      file: {
        "a": {},
        "b": {},
        "c": {},
        "d": {},
        "e": {},
        "f": {},
        "g": {},
        "h": {},
      }
    },
    '5': {
      file: {
        "a": {},
        "b": {},
        "c": {},
        "d": {},
        "e": {},
        "f": {},
        "g": {},
        "h": {},
      }
    },
    '4': {
      file: {
        "a": {},
        "b": {},
        "c": {},
        "d": {},
        "e": {},
        "f": {},
        "g": {},
        "h": {},
      }
    },
    '3': {
      file: {
        "a": {},
        "b": {},
        "c": {},
        "d": {},
        "e": {},
        "f": {},
        "g": {},
        "h": {},
      }
    },
    '2': {
      file: {
        'a' : {piece: {side: 'white', type: 'P'} },
        'b' : {piece: {side: 'white', type: 'P'} },
        'c' : {piece: {side: 'white', type: 'P'} },
        'd' : {piece: {side: 'white', type: 'P'} },
        'e' : {piece: {side: 'white', type: 'P'} },
        'f' : {piece: {side: 'white', type: 'P'} },
        'g' : {piece: {side: 'white', type: 'P'} },
        'h' : {piece: {side: 'white', type: 'P'} },
      }
    },
    '1': {
      file: {
        'a' : {piece: {side: 'white', type: 'R'} },
        'b' : {piece: {side: 'white', type: 'N'} },
        'c' : {piece: {side: 'white', type: 'B'} },
        'd' : {piece: {side: 'white', type: 'Q'} },
        'e' : {piece: {side: 'white', type: 'K'} },
        'f' : {piece: {side: 'white', type: 'B'} },
        'g' : {piece: {side: 'white', type: 'N'} },
        'h' : {piece: {side: 'white', type: 'R'} },
      }
    },
  },
}


export type Rank = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

export const RANKS: Rank[] = ['1','2','3','4','5','6','7','8'];
export const FILES: File[] = ['a','b','c','d','e','f','g','h'];

export function positionsEqual(a: PositionDef, b: PositionDef): boolean {
  return a.file == b.file && a.rank == b.rank;
}
export function positionOffset(p: PositionDef, x: number, y: number): PositionDef | undefined {
  const ty = RANKS.indexOf(p.rank) + y;
  const tx = FILES.indexOf(p.file) + x;
  if (ty < 0 || ty >= RANKS.length || tx < 0 || tx >= FILES.length) return undefined;
  return {rank: RANKS[ty], file: FILES[tx]};
}
export interface PositionDef {
  rank: Rank,
  file: File,
}

export interface MoveDef {
  from: PositionDef;
  to: PositionDef;
  // when a pawn performs enPassant, this is the captured pawn
  // when castling, this clears the rooks old position
  capturesAt?: PositionDef;
  // isSpeedyPawn?: true;
  enPassantAt?: PositionDef; // when a pawn is speedy, this is the square it can be intercepted at
  // enPassantCapturesAt?: PositionDef; // when a pawn intercepted, this is the square it is captured at AKA 'to'
  rookAt?: PositionDef; // when castling, this is the rook's new position
  promotesTo?: PieceType; // when pawn promoting, what type does it become
}

export interface BoardRank {
  file: {
    'a': SquareDef,
    'b': SquareDef,
    'c': SquareDef,
    'd': SquareDef,
    'e': SquareDef,
    'f': SquareDef,
    'g': SquareDef,
    'h': SquareDef,
  }
}

export interface BoardDef {
  // usage: board.rank[file].file[rank]: SquareDef
  rank: {
    '1': BoardRank,
    '2': BoardRank,
    '3': BoardRank,
    '4': BoardRank,
    '5': BoardRank,
    '6': BoardRank,
    '7': BoardRank,
    '8': BoardRank,
  }
}

export interface SquareDef {
  piece?: PieceDef;
}

export interface PieceDef {
  side: 'black' | 'white';
  type: PieceType;
  hasMoved?: true;
}

// It is enough to know the moves of the game to recreate the current state of the game
export interface GameDef {
  cache?: {
    move: number,
    board: BoardDef,
  }
  moves: MoveDef[];
}