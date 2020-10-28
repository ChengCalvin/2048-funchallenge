import React, { useState, useEffect } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Grid, Paper, Button } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.palette.text.secondary,
      width: "5rem",
      height: "5rem",
    },
    board: {
      paddingLeft: "5rem",
      paddingRight: "5rem",
      display: "flex",
      flexDirection: "column",
      margin: "auto",
      backgroundColor: "#DCDCDC",
    },
    buttoncontainer: {
      marginTop: "2rem",
    },
    gridrow: {
      display: "flex",
    },
  })
);

const Board = () => {
  const classes = useStyles();
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const emptyBoard = Array(4)
    .fill([0, 0, 0, 0])
    .map((board) => [...board]);
  const [gridInBoard, setGridInBoard] = useState<number[][]>(emptyBoard);

  const spawnNewValueToBoard = () => {
    const randomValue = Math.random() >= 0.5 ? 2 : 4;
    return randomValue;
  };

  const getRandomEmptyGrid = (gridRowColValues: number[][][]) => {
    const totalEmptyGrid: number[][] = [
      ...gridRowColValues[0],
      ...gridRowColValues[1],
      ...gridRowColValues[2],
      ...gridRowColValues[3],
    ];
    const randomNumber1 = Math.floor(Math.random() * totalEmptyGrid.length);
    const gridOne: number[] = totalEmptyGrid[randomNumber1];
    return gridOne;
  };

  const drawNewBoardValue = (board: number[][]) => {
    const spawnValue: number = spawnNewValueToBoard();

    const gridRowColValues: number[][][] = board.map((row, rowIndex) => {
      return row
        .map((value, colIndex) => {
          if (value === 0) return [rowIndex, colIndex];
          else return [];
        })
        .filter((rowColPair) => rowColPair);
    });

    const gameEnded = gridRowColValues.length === 0;
    if (gameEnded) {
      setGameStarted(false);
    }

    const randomGrid: number[] = getRandomEmptyGrid(gridRowColValues);

    const finalBoardState: number[][] = board.map((row, rowIndex) => {
      return row.map((_value, colIndex) => {
        if (rowIndex === randomGrid[0] && colIndex === randomGrid[1]) {
          return spawnValue;
        } else return board[rowIndex][colIndex];
      });
    });
    return finalBoardState;
  };

  const gameStartState = () => {
    setGameStarted(true);
    const firstNumberSpawnBoard: number[][] = drawNewBoardValue(gridInBoard);
    const finalBoardState: number[][] = drawNewBoardValue(
      firstNumberSpawnBoard
    );
    setGridInBoard(finalBoardState);
  };

  const shiftRowRight = (array: number[]) => {
    array.sort((secondNumber: number, firstNumber: number) => {
      if (firstNumber > secondNumber && secondNumber === 0) return -1;
      else return 0;
    });
    return array;
  };

  const shiftRowLeft = (array: number[]) => {
    array.sort((secondNumber: number, firstNumber: number) => {
      if (secondNumber > firstNumber && firstNumber === 0) return -1;
      else return 0;
    });
    return array;
  };

  const shiftColumnDown = (array: number[][]) => {
    const transposedBoard: number[][] = transposeArray(array);
    const sortedBoard = transposedBoard?.map((row) => {
      const firstShift: number[] = shiftRowRight(row);
      const compressed: number[] = compressRowRight(firstShift);
      const secondShift: number[] = shiftRowRight(compressed);
      return secondShift;
    });
    const updatedSortedCol: number[][] = transposeArray(sortedBoard);
    return updatedSortedCol;
  };

  const shiftColumnUp = (array: number[][]) => {
    const transposedBoard: number[][] = transposeArray(array);
    const sortedBoard = transposedBoard?.map((row) => {
      const firstShift: number[] = shiftRowRight(row);
      const compressed: number[] = compressRowRight(firstShift);
      const secondShift: number[] = shiftRowRight(compressed);
      return secondShift;
    });
    const updatedSortedCol: number[][] = transposeArray(sortedBoard);
    return updatedSortedCol;
  };

  const transposeArray = (array: number[][]) => {
    const transposedBoard: number[][] = array[0].map(
      (_num: number, colIndex: number) => {
        return array.map((row: number[]) => {
          return row[colIndex];
        });
      }
    );
    return transposedBoard;
  };

  const compressRowRight = (array: number[]) => {
    array.reduce(
      (
        firstNumber: number,
        secondNumber: number,
        currentIndex: number,
        array: number[]
      ) => {
        if (firstNumber === secondNumber) {
          array[currentIndex] = firstNumber + secondNumber;
          array[currentIndex - 1] = 0;
          return secondNumber;
        } else return secondNumber;
      }
    );
    return array;
  };

  const compressRowLeft = (array: number[]) => {
    array.reduce(
      (
        firstNumber: number,
        secondNumber: number,
        currentIndex: number,
        array: number[]
      ) => {
        if (firstNumber === secondNumber) {
          array[currentIndex] = firstNumber + secondNumber;
          array[currentIndex - 1] = 0;
          return firstNumber;
        } else return firstNumber;
      }
    );
    return array;
  };

  const onArrowKeyDownPressed = (event: globalThis.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        const shiftedColumnDown: number[][] = shiftColumnDown(gridInBoard);
        const finalBoardStateDown: number[][] = drawNewBoardValue(
          shiftedColumnDown
        );
        setGridInBoard([...finalBoardStateDown]);
        break;

      case "ArrowUp":
        const shiftedColumnUp: number[][] = shiftColumnUp(gridInBoard);
        const finalBoardStateUp: number[][] = drawNewBoardValue(
          shiftedColumnUp
        );
        setGridInBoard([...finalBoardStateUp]);
        break;

      case "ArrowRight":
        const boardCopyRight: number[][] = gridInBoard.map((row) => {
          const firstShift: number[] = shiftRowRight(row);
          const compressed: number[] = compressRowRight(firstShift);
          const secondShift: number[] = shiftRowRight(compressed);
          return secondShift;
        });

        const finalBoardStateRight: number[][] = drawNewBoardValue(
          boardCopyRight
        );
        setGridInBoard([...finalBoardStateRight]);
        break;

      case "ArrowLeft":
        const boardCopyLeft: number[][] = gridInBoard.map((row) => {
          const firstShift: number[] = shiftRowLeft(row);
          const compressed: number[] = compressRowLeft(firstShift);
          const secondShift: number[] = shiftRowLeft(compressed);
          return secondShift;
        });
        const finalBoardStateLeft: number[][] = drawNewBoardValue(
          boardCopyLeft
        );
        setGridInBoard([...finalBoardStateLeft]);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (gameStarted) {
      window.addEventListener("keydown", onArrowKeyDownPressed);
      return () => {
        window.removeEventListener("keydown", onArrowKeyDownPressed);
      };
    }
  }, [gridInBoard]);

  const onNumberChangeStyle = (value: number) => {
    const linearTransformation: number = Math.log2(value === 0 ? 1 : value);
    const colorCode: number = 245 - 15 * linearTransformation;
    const rgb: string = `rgb(${colorCode}, ${colorCode},240)`;
    return rgb;
  };

  const createBoard = () => {
    return (
      <div className={classes.board}>
        {gridInBoard.map((row, i) => (
          <Grid item key={i} className={classes.gridrow}>
            {row.map((column, i) => (
              <Paper
                className={classes.paper}
                style={{ backgroundColor: onNumberChangeStyle(column) }}
                key={i}
              >
                <div>{column}</div>
              </Paper>
            ))}
          </Grid>
        ))}
      </div>
    );
  };

  // Display on window
  return (
    <>
      <p>hello 2048</p>
      <Grid container spacing={0}>
        {createBoard()}
      </Grid>
      <div className={classes.buttoncontainer}>
        <Button
          variant="outlined"
          color="primary"
          onClick={gameStartState}
          disabled={gameStarted}
        >
          Start Game
        </Button>
      </div>
    </>
  );
};

export default Board;
