export type SymbolType = "X" | "O" | null;

/**
 * Ambil semua posisi kosong di papan
 */
const getAvailableMoves = (board: SymbolType[]): number[] =>
  board
    .map((cell, index) => (cell === null ? index : null))
    .filter((index): index is number => index !== null);

/**
 * Fungsi untuk mengecek pemenang
 */
export const checkWinner = (squares: SymbolType[]): SymbolType | "draw" | null => {
  const lines: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [i1, i2, i3] of lines) {
    if (
      squares[i1] &&
      squares[i1] === squares[i2] &&
      squares[i1] === squares[i3]
    ) {
      return squares[i1];
    }
  }

  return squares.includes(null) ? null : "draw";
};

/**
 * Easy mode — langkah acak
 */
export const getEasyMove = (board: SymbolType[]): number => {
  const available = getAvailableMoves(board);
  return available[Math.floor(Math.random() * available.length)];
};

/**
 * Medium mode — 50% random, 50% coba blokir lawan
 */
export const getMediumMove = (
  board: SymbolType[],
  ai: SymbolType,
  player: SymbolType
): number => {
  const available = getAvailableMoves(board);

  // 50% random
  if (Math.random() < 0.5) {
    return getEasyMove(board);
  }

  // Coba blokir lawan
  for (const move of available) {
    const temp = [...board];
    temp[move] = player;
    if (checkWinner(temp) === player) {
      return move; // blokir kemenangan lawan
    }
  }

  // Coba menang sendiri
  for (const move of available) {
    const temp = [...board];
    temp[move] = ai;
    if (checkWinner(temp) === ai) {
      return move;
    }
  }

  return getEasyMove(board);
};

/**
 * Hard mode — pakai algoritma minimax (AI optimal)
 */
export const getHardMove = (
  board: SymbolType[],
  ai: SymbolType,
  player: SymbolType
): number => {
  const minimax = (squares: SymbolType[], isMaximizing: boolean): number => {
    const winner = checkWinner(squares);
    if (winner === ai) return 1;
    if (winner === player) return -1;
    if (winner === "draw") return 0;

    const available = getAvailableMoves(squares);

    if (isMaximizing) {
      let best = -Infinity;
      for (const move of available) {
        const temp = [...squares];
        temp[move] = ai;
        best = Math.max(best, minimax(temp, false));
      }
      return best;
    } else {
      let best = Infinity;
      for (const move of available) {
        const temp = [...squares];
        temp[move] = player;
        best = Math.min(best, minimax(temp, true));
      }
      return best;
    }
  };

  const available = getAvailableMoves(board);
  let bestScore = -Infinity;
  let bestMove = available[0];

  for (const move of available) {
    const temp = [...board];
    temp[move] = ai;
    const score = minimax(temp, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};

/**
 * Export utama untuk diimport di page.tsx
 */
export type { SymbolType as Symbol };
