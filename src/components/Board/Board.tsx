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
  const [spawnValue, setSpawnValue] = useState<number[]>([0, 0]);

  /* Create grid */
  let [gridInBoard, setGridInBoard] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  const spawnNewValueToBoard = () => {
    const randomValue = [
      Math.random() >= 0.5 ? 2 : 4,
      Math.random() >= 0.5 ? 2 : 4,
    ];

    const spawnValueCopy: number[] = spawnValue.map((_value, valueIndex) => {
      return randomValue[valueIndex];
    }); // this works expected [randomVal, randomVal]
    console.log(spawnValueCopy);
    setSpawnValue(spawnValueCopy); //this does not happen, unable to update due to const...
    console.log(spawnValue); // output [0,0] as expected line 40

    let gridCopy: number[][] = [...gridInBoard];
    spawnValue?.forEach((newValue: number) => {
      const rowFirstGrid =
        Math.floor(Math.random() * 4) === 4 ? 3 : Math.floor(Math.random() * 4); // if 4 return 3 else return random number
      const columnFirstGrid =
        Math.floor(Math.random() * 4) === 4 ? 3 : Math.floor(Math.random() * 4);
      let gridIsZero = gridCopy[rowFirstGrid][columnFirstGrid] === 0;

      if (gridIsZero) {
        console.log("grid is zero");
        gridCopy[rowFirstGrid][columnFirstGrid] = newValue;
      }
    });
    setGridInBoard(gridCopy);
  };

  const gameStartState = () => {
    //game is always false since it is set at the beginning.
    setGameStarted((prev) => !prev);
    console.log(gameStarted); // game started is false...
    spawnNewValueToBoard();
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
    //console.log(transposedBoard);
    return transposedBoard;
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
    let boardCopy: number[][] = [...gridInBoard];

    switch (event.key) {
      case "ArrowDown":
        console.log("down");
        const sortedColumn: number[][] = shiftColumnDown(boardCopy);
        boardCopy = transposeArray(sortedColumn);
        return boardCopy;
      //setGridInBoard(boardCopy); // dom isnt updating... need return?
      //spawnNewValueToBoard();
      //break;
      case "ArrowUp":
        console.log("up");
        return boardCopy;
      //break;
      case "ArrowRight":
        //console.log("right");
        boardCopy.forEach((row) => {
          shiftRowRight(row);
          compressRowRight(row);
          shiftRowRight(row);
        });
        return boardCopy;
      //setGridInBoard(boardCopy);
      //spawnNewValueToBoard();
      //break;
      case "ArrowLeft":
        console.log("left");
        return boardCopy;
      //break;
      default:
        return boardCopy;
      //break;
    }
  };

  useEffect(() => {
    if (gameStarted)
      window.addEventListener("keydown", (event) => {
        const newBoardState: number[][] = onArrowKeyDownPressed(event);
        console.log(newBoardState);
        setGridInBoard(newBoardState);
        console.log(gridInBoard);
        spawnNewValueToBoard();
      });
  }, [gameStarted]);

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
