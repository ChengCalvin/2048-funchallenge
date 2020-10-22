import React, { useState, useEffect, useRef } from "react";
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
  const [spawnValue, setSpawnValue] = useState<number[]>([0, 0]);

  const emptyBoard = Array(4)
    .fill([0, 0, 0, 0])
    .map((board) => [...board]);

  /* Create grid */
  const [gridInBoard, setGridInBoard] = useState<number[][]>(emptyBoard);
  const emptyBoardRef = useRef(emptyBoard);

  const spawnNewValueToBoard = () => {
    const randomValue = [
      Math.random() >= 0.5 ? 2 : 4,
      Math.random() >= 0.5 ? 2 : 4,
    ];

    setSpawnValue(randomValue);
  };

  const drawNewBoardValue = (board: number[][]) => {
    console.log("before new value spawned", board);

    const newRow = Math.floor(Math.random() * 4);
    const newColumn = Math.floor(Math.random() * 4);
    const newRow2 = Math.floor(Math.random() * 4);
    const newColumn2 = Math.floor(Math.random() * 4);
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
          return spawnValue[1];
        } else return board[rowIndex][colIndex];
      });
    });
    emptyBoardRef.current = boardCopy;
    setGridInBoard(boardCopy); // wrong approach...
  };

  const gameStartState = () => {
    setGameStarted(true);
  };

  const shiftRowRight = (array: number[]) => {
    array.sort((secondNumber: number, firstNumber: number) => {
      if (firstNumber > secondNumber && secondNumber === 0) return -1;
      else return 0;
    });
  };

  const shiftColumnDown = (array: number[][]) => {
    const transposedBoard: number[][] = transposeArray(array);
    transposedBoard?.forEach((row) => {
      shiftRowRight(row);
      compressRowRight(row);
      shiftRowRight(row);
    });
    const updatedSortedCol: number[][] = transposeArray(transposedBoard);
    return updatedSortedCol; // not drawing on board
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

  const onArrowKeyDownPressed = (event: globalThis.KeyboardEvent) => {
    //const boardCopy: number[][] = [...gridInBoard];
    console.log("grid before arrow key pressed", emptyBoardRef.current); // how to get next state?
    switch (event.key) {
      case "ArrowDown":
        console.log("down");
        const shiftedColumn: number[][] = shiftColumnDown(
          emptyBoardRef.current
        );
        //emptyBoardRef.current = shiftedColumn;
        setGridInBoard(shiftedColumn);
        spawnNewValueToBoard();
        drawNewBoardValue(shiftedColumn);
        break;
      case "ArrowUp":
        console.log("up");
        break;
      case "ArrowRight":
        //console.log("right");
        //gridInBoard is always 0, need to get the updated state...
        const boardCopy: number[][] = emptyBoardRef.current.map((row) => {
          shiftRowRight(row);
          compressRowRight(row);
          shiftRowRight(row);
          return row;
        });
        console.log("boardCopy after sorting", boardCopy);
        spawnNewValueToBoard(); // generate 2 new values | spawnValue = [x, y]
        drawNewBoardValue(boardCopy); // add 2 random value on tile = 0 and set new Board state

        break;
      case "ArrowLeft":
        console.log("left");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (gameStarted) {
      window.addEventListener("keydown", (event) => {
        onArrowKeyDownPressed(event);
      });
    }
    spawnNewValueToBoard();
    drawNewBoardValue(emptyBoardRef.current);
  }, [gameStarted]);

  useEffect(() => {
    console.log("current grid state", emptyBoardRef.current);
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
