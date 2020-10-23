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
      backgroundColor: "#D3D3D3",
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

  /* Create grid */
  const [gridInBoard, setGridInBoard] = useState<number[][]>(emptyBoard);

  const spawnNewValueToBoard = () => {
    const randomValue = [
      Math.random() >= 0.5 ? 2 : 4,
      Math.random() >= 0.5 ? 2 : 4,
    ];

    return randomValue;
  };

  const drawNewBoardValue = (board: number[][]) => {
    const spawnValue = spawnNewValueToBoard();

    const newRow = Math.floor(Math.random() * 4);
    const newColumn = Math.floor(Math.random() * 4);
    const newRow2 = Math.floor(Math.random() * 4);
    const newColumn2 = Math.floor(Math.random() * 4);
    // const gridRowColValues: number[][] | null = board.map((row, rowIndex) => {
    //   return row.map((value, colIndex) => {
    //     if (value === 0) return [rowIndex, colIndex];
    //     else return;
    //   });
    // });
    const gridIsZero = board[newRow][newColumn] === 0;

    const boardCopy: number[][] = board.map((row, rowIndex) => {
      return row.map((_value, colIndex) => {
        if (rowIndex === newRow && colIndex === newColumn && gridIsZero) {
          return spawnValue[0];
        } else if (
          rowIndex === newRow2 &&
          colIndex === newColumn2 &&
          gridIsZero
        ) {
          //console.log("this is happening");
          return spawnValue[1];
        } else return board[rowIndex][colIndex];
      });
    });

    setGridInBoard([...boardCopy]);
  };

  const gameStartState = () => {
    setGameStarted(true);
    spawnNewValueToBoard();
    drawNewBoardValue(gridInBoard);
  };

  const shiftRowRight = (array: number[]) => {
    array.sort((secondNumber: number, firstNumber: number) => {
      if (firstNumber > secondNumber && secondNumber === 0) return -1;
      else return 0;
    });
  };

  const shiftRowLeft = (array: number[]) => {
    array.sort((secondNumber: number, firstNumber: number) => {
      if (secondNumber > firstNumber && firstNumber === 0) return -1;
      else return 0;
    });
  };

  const shiftColumnDown = (array: number[][]) => {
    const transposedBoard: number[][] = transposeArray(array);
    const sortedBoard = transposedBoard?.map((row) => {
      shiftRowRight(row);
      compressRowRight(row);
      shiftRowRight(row);
      return row;
    });
    const updatedSortedCol: number[][] = transposeArray(sortedBoard);
    return updatedSortedCol;
  };

  const shiftColumnUp = (array: number[][]) => {
    const transposedBoard: number[][] = transposeArray(array);
    const sortedBoard = transposedBoard?.map((row) => {
      shiftRowLeft(row);
      compressRowLeft(row);
      shiftRowLeft(row);
      return row;
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
  };

  const onArrowKeyDownPressed = (event: globalThis.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        const shiftedColumnDown: number[][] = shiftColumnDown(gridInBoard);
        drawNewBoardValue(shiftedColumnDown);
        break;

      case "ArrowUp":
        const shiftedColumnUp: number[][] = shiftColumnUp(gridInBoard);
        drawNewBoardValue(shiftedColumnUp);
        break;

      case "ArrowRight":
        const boardCopyRight: number[][] = gridInBoard.map((row) => {
          shiftRowRight(row);
          compressRowRight(row);
          shiftRowRight(row);
          return row;
        });
        drawNewBoardValue(boardCopyRight);
        break;

      case "ArrowLeft":
        const boardCopyLeft: number[][] = gridInBoard.map((row) => {
          shiftRowLeft(row);
          compressRowLeft(row);
          shiftRowLeft(row);
          return row;
        });
        drawNewBoardValue(boardCopyLeft);
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

  /* Create Board UI */
  /* 
     0  0  0  0
     ----------
     0  0  0  0
     ----------
     0  0  0  0
     ----------
     0  0  0  0 
  */
  const createBoard = () => {
    return (
      <div className={classes.board}>
        {gridInBoard.map((row, i) => (
          <Grid item key={i} className={classes.gridrow}>
            {row.map((column, i) => (
              <Paper className={classes.paper} key={i + 1}>
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
      <p>hello board</p>
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
