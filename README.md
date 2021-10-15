# ts-chess

Play a game of chess in your terminal!
Input moves in Algebraic Notation (`f3`, `Qh4`, `R4e6`, `O-O-O`, etc), or in a plain from-to notation (`f2f3`, `d8h4`, etc).
Castling and en passant can be input in Algebraic Notation as above, or in from-to notation for the king or pawn being moved.
In all cases, pawn promotion uses `=` syntax, for instance `c8=Q` or `b7c8=Q`.

# usage

Clone the repository, install dependencies with `npm install`, and run the game with `npm run start`.

Games can be recreated or resumed from a list of moves, as seen in `index.ts` using `restoreGameFromMoves()`, but this is not supported from the cli yet.

# sample play:

```
How about a nice game of chess?

   a b c d e f g h
 8 R N B . K B N R
 7 P P P P . P P P
 6 . . . . P . . .
 5 . . . . . . . .
 4 . . . . . . p Q
 3 . . . . . p . .
 2 p p p p p . . p
 1 r n b q k b n r

   Checkmate!

game over, press enter to continue...
```
