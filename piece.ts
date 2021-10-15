import { traceSquare } from "./game";
import { GameDef, MoveDef, PieceDef, PieceType, PositionDef, positionOffset, positionsEqual, Rank, SquareDef } from "./model";

export interface StatusOptions {
  threats?: PositionDef[];
  enPassantAt?: PositionDef;
  enPassantCapturesAt?: PositionDef;
  // alreadyCastled?: true;
}

export abstract class Piece {
  abstract status(piece: PieceDef, position: PositionDef, game: GameDef, options: StatusOptions): {
    possibleMoves: MoveDef[],
    threatenedSquares: PositionDef[],
  };
}

export class Rook implements Piece {
  status(piece: PieceDef, position: PositionDef, game: GameDef): { possibleMoves: MoveDef[]; threatenedSquares: PositionDef[]; } {
    const possibleMoves: MoveDef[] = [];
    const threatenedSquares: PositionDef[] = [];
    const push = (to: PositionDef) => {
      possibleMoves.push({from: position, to});
      threatenedSquares.push(to);
    }
    const threaten = (to: PositionDef) => {
      threatenedSquares.push(to);
    }

    // positive x
    for(let i = 1; i < 8; i++) {
      const pos = positionOffset(position, i, 0);
      if(!pos) break; // off the board
      const square = traceSquare(game, pos);
      if(!square.piece) {
        push(pos);
      } else if(square.piece.side != piece.side) {
        push(pos);
        break; // capture, so can't move past this space
      } else if(square.piece.side == piece.side) {
        threaten(pos);
        break;
      }
    }
    
    // negative x
    for(let i = 1; i < 8; i++) {
      const pos = positionOffset(position, -i, 0);
      if(!pos) break; // off the board
      const square = traceSquare(game, pos);
      if(!square.piece) {
        push(pos);
      } else if(square.piece.side != piece.side) {
        push(pos);
        break; // capture, so can't move past this space
      } else if(square.piece.side == piece.side) {
        threaten(pos);
        break;
      }
    }
    
    // positive y
    for(let i = 1; i < 8; i++) {
      const pos = positionOffset(position, 0, i);
      if(!pos) break; // off the board
      const square = traceSquare(game, pos);
      if(!square.piece) {
        push(pos);
      } else if(square.piece.side != piece.side) {
        push(pos);
        break; // capture, so can't move past this space
      } else if(square.piece.side == piece.side) {
        threaten(pos);
        break;
      }
    }
    
    // negative y
    for(let i = 1; i < 8; i++) {
      const pos = positionOffset(position, 0, -i);
      if(!pos) break; // off the board
      const square = traceSquare(game, pos);
      if(!square.piece) {
        push(pos);
      } else if(square.piece.side != piece.side) {
        push(pos);
        break; // capture, so can't move past this space
      } else if(square.piece.side == piece.side) {
        threaten(pos);
        break;
      }
    }

    return {
      possibleMoves,
      threatenedSquares,
    };
  }
}

export class Bishop implements Piece {
  status(piece: PieceDef, position: PositionDef, game: GameDef): { possibleMoves: MoveDef[]; threatenedSquares: PositionDef[]; } {
    const possibleMoves: MoveDef[] = [];
    const threatenedSquares: PositionDef[] = [];
    const push = (to: PositionDef) => {
      possibleMoves.push({from: position, to});
      threatenedSquares.push(to);
    }
    const threaten = (to: PositionDef) => {
      threatenedSquares.push(to);
    }

    // +x +y
    for(let i = 1; i < 8; i++) {
      const pos = positionOffset(position, i, i);
      if(!pos) break; // off the board
      const square = traceSquare(game, pos);
      if(!square.piece) {
        push(pos);
      } else if(square.piece.side != piece.side) {
        push(pos);
        break; // capture, so can't move past this space
      } else if(square.piece.side == piece.side) {
        threaten(pos);
        break;
      }
    }
    
    // -x +y
    for(let i = 1; i < 8; i++) {
      const pos = positionOffset(position, -i, i);
      if(!pos) break; // off the board
      const square = traceSquare(game, pos);
      if(!square.piece) {
        push(pos);
      } else if(square.piece.side != piece.side) {
        push(pos);
        break; // capture, so can't move past this space
      } else if(square.piece.side == piece.side) {
        threaten(pos);
        break;
      }
    }
    
    // +x -y
    for(let i = 1; i < 8; i++) {
      const pos = positionOffset(position, i, -i);
      if(!pos) break; // off the board
      const square = traceSquare(game, pos);
      if(!square.piece) {
        push(pos);
      } else if(square.piece.side != piece.side) {
        push(pos);
        break; // capture, so can't move past this space
      } else if(square.piece.side == piece.side) {
        threaten(pos);
        break;
      }
    }
    
    // -x -y
    for(let i = 1; i < 8; i++) {
      const pos = positionOffset(position, -i, -i);
      if(!pos) break; // off the board
      const square = traceSquare(game, pos);
      if(!square.piece) {
        push(pos);
      } else if(square.piece.side != piece.side) {
        push(pos);
        break; // capture, so can't move past this space
      } else if(square.piece.side == piece.side) {
        threaten(pos);
        break;
      }
    }

    return {
      possibleMoves,
      threatenedSquares,
    };
  }
}

export class Queen implements Piece {
  status(piece: PieceDef, position: PositionDef, game: GameDef): { possibleMoves: MoveDef[]; threatenedSquares: PositionDef[]; } {
    const rookStatus = ROOK.status(piece, position, game);
    const bishopStatus = BISHOP.status(piece, position, game);
    return {
      possibleMoves: [...rookStatus.possibleMoves, ...bishopStatus.possibleMoves],
      threatenedSquares: [...rookStatus.threatenedSquares, ...bishopStatus.threatenedSquares],
    };
  }
}

export class Knight implements Piece {
  status(piece: PieceDef, position: PositionDef, game: GameDef): { possibleMoves: MoveDef[]; threatenedSquares: PositionDef[]; } {
    const possibleMoves: MoveDef[] = [];
    const threatenedSquares: PositionDef[] = [];
    const push = (to: PositionDef) => {
      possibleMoves.push({from: position, to});
      threatenedSquares.push(to);
    }

    const posList: PositionDef[] = [
      positionOffset(position, 1, 2),
      positionOffset(position, -1, 2),
      positionOffset(position, 1, -2),
      positionOffset(position, -1, -2),
      positionOffset(position, 2, 1),
      positionOffset(position, 2, -1),
      positionOffset(position, -2, 1),
      positionOffset(position, -2, -1),
    ].filter(pos => pos != undefined) as PositionDef[];

    posList.forEach(pos => {
      const square = traceSquare(game, pos);
      if(!square.piece || square.piece.side != piece.side) {
        push(pos);
      } else if (square.piece && square.piece.side == piece.side) {
        threatenedSquares.push(pos);
      }
    });

    return {
      possibleMoves,
      threatenedSquares,
    };
  }
}

interface CanCastleOptions {
  kingPos: PositionDef, 
  rookPos: PositionDef, 
  newKingPos: PositionDef, 
  newRookPos: PositionDef, 
  emptyPos: PositionDef[],
}

export class King implements Piece {
  status(piece: PieceDef, position: PositionDef, game: GameDef, options: {threats?: PositionDef[]}): { possibleMoves: MoveDef[]; threatenedSquares: PositionDef[]; } {
    const possibleMoves: MoveDef[] = [];
    const threatenedSquares: PositionDef[] = [];
    const threats: PositionDef[] = options.threats ? options.threats : [];
    const push = (to: PositionDef) => {
      // can't move to a threatened square
      if (!options.threats || options.threats.filter(threat => positionsEqual(threat, to)).length == 0) {
        possibleMoves.push({from: position, to});
      }
      threatenedSquares.push(to);
    }

    const posList: PositionDef[] = [
      positionOffset(position, 1, 1),
      positionOffset(position, 0, 1),
      positionOffset(position, -1, 1),
      positionOffset(position, -1, 0),
      positionOffset(position, -1, -1),
      positionOffset(position, 0, -1),
      positionOffset(position, 1, -1),
      positionOffset(position, 1, 0),
    ].filter(pos => pos != undefined) as PositionDef[];

    posList.forEach(pos => {
      const square = traceSquare(game, pos);
      if(!square.piece || square.piece.side != piece.side) {
        push(pos);
      } else if (square.piece && square.piece.side == piece.side) {
        threatenedSquares.push(pos);
      }
    });

    // TODO: if still legal, add O-O and O-O-O (short and long castle)
    // allowed if neither piece has moved
    // and if the king's current, destination, and travel squares are all NOT under threat

    function canCastle(options: CanCastleOptions): boolean {
      const {kingPos, rookPos, newKingPos, newRookPos, emptyPos} = options;
      const kingPiece = traceSquare(game, kingPos);
      const rookPiece = traceSquare(game, rookPos);
      if (kingPiece.piece == undefined || kingPiece.piece.hasMoved) return false;
      if (rookPiece.piece == undefined || rookPiece.piece.hasMoved) return false;

      const mustNotBeThreatened: PositionDef[] = [kingPos, newKingPos, newRookPos]; // king must not be threated at all on the path
      const mustBeEmpty: PositionDef[] = [newKingPos, newRookPos, ...emptyPos]; // between the castle and king must be all clear
      
      const threatsInPath = mustNotBeThreatened.filter(pos => threats.filter(tPos => positionsEqual(pos, tPos)).length > 0).length;
      if (threatsInPath > 0) return false;

      const piecesInPath = mustBeEmpty.filter(pos => traceSquare(game, pos).piece != undefined).length;
      if (piecesInPath > 0) return false;

      return true; // neither piece has moved, the squares are empty, and there are no threats
    }

    const rank: Rank = piece.side == 'white' ? '1' : '8';
    const longCastleOptions: CanCastleOptions = {
      rookPos: { file: 'a', rank },
      emptyPos: [ { file: 'b', rank } ],
      newKingPos: { file: 'c', rank },
      newRookPos: { file: 'd', rank },
      kingPos: { file: 'e', rank },
    };
    const shortCastleOptions: CanCastleOptions = {
      kingPos: { file: 'e', rank },
      newRookPos: { file: 'f', rank },
      newKingPos: { file: 'g', rank },
      emptyPos: [],
      rookPos: { file: 'h', rank },
    };
    if (canCastle(longCastleOptions)) {
      possibleMoves.push({
        from: longCastleOptions.kingPos,
        to: longCastleOptions.newKingPos,
        capturesAt: longCastleOptions.rookPos,
        rookAt: longCastleOptions.newRookPos,
      })
    }

    if (canCastle(shortCastleOptions)) {
      possibleMoves.push({
        from: shortCastleOptions.kingPos,
        to: shortCastleOptions.newKingPos,
        capturesAt: shortCastleOptions.rookPos,
        rookAt: shortCastleOptions.newRookPos,
      })
    }

    return {
      possibleMoves,
      threatenedSquares,
    };
  }
}

export class Pawn implements Piece {
  status(piece: PieceDef, position: PositionDef, game: GameDef, options: { enPassantAt?: PositionDef, enPassantCapturesAt?: PositionDef }): { possibleMoves: MoveDef[]; threatenedSquares: PositionDef[]; } {
    const possibleMoves: MoveDef[] = [];
    const threatenedSquares: PositionDef[] = [];
    
    const yMove = piece.side == 'white' ? 1 : -1;
    const startingRank: Rank = piece.side == 'white' ? '2' : '7';
    const promotingRank: Rank = piece.side == 'white' ? '8' : '1';

    // This is used to enumerate promotions if applicable
    const pushMove = (move: MoveDef) => {
      if (move.to.rank != promotingRank) {
        possibleMoves.push(move);
        return;
      }
      (<PieceType[]> ['R','N','B','Q']).forEach(promotesTo => possibleMoves.push({...move, promotesTo}))
    };

    const forwardPos = positionOffset(position, 0, yMove);
    if (forwardPos) {
      const square = traceSquare(game, forwardPos);
      if(!square.piece) {
        pushMove({from:position, to:forwardPos});
        const doubleForwardPos = positionOffset(position, 0, yMove*2);
        if (doubleForwardPos && startingRank == position.rank) { // can only double move from start
          const square2 = traceSquare(game, doubleForwardPos);
          if(!square2.piece) {
            pushMove({from:position, to:doubleForwardPos, enPassantAt: forwardPos});
          }
        }
      }
    }

    const checkCapturePos = (capturePos: PositionDef | undefined) => {
      if (!capturePos) { //it's a real space, now check if there's anything there
        return;
      }
      threatenedSquares.push(capturePos); // we always threaten there, be it empty, ally, or foe
      const square = traceSquare(game, capturePos);

      if(square.piece && square.piece.side != piece.side) {
        pushMove({from:position, to:capturePos}); // can capture enemies
      } else if(options.enPassantAt && positionsEqual(capturePos, options.enPassantAt)) {
        pushMove({from:position, to:capturePos, capturesAt: options.enPassantCapturesAt}); // can capture speedy pawns
      }
    };

    checkCapturePos(positionOffset(position, -1, yMove));
    checkCapturePos(positionOffset(position, 1, yMove));

    return {
      possibleMoves,
      threatenedSquares,
    };
  }
}

export const ROOK = new Rook();
export const KNIGHT = new Knight();
export const BISHOP = new Bishop();
export const QUEEN = new Queen();
export const KING = new King();
export const PAWN = new Pawn();

export const PIECE_MAP: {[key: string]: Piece} = {
  'K': KING,
  'Q': QUEEN,
  'R': ROOK,
  'N': KNIGHT,
  'B': BISHOP,
  'P': PAWN,
};