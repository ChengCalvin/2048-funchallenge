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
  let [gameStarted, setGameStarted] = useState<boolean | undefined>(false);
  let [spawnValue, setSpawnValue] = useState<number[] | undefined>([0]);

  /* Create grid */
  let [gridInBoard, setGridInBoard] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  const spawnNewValueToBoard = () => {
    let spawnValueCopy = spawnValue;
    if (spawnValueCopy !== undefined) {
      spawnValueCopy[0] = Math.random() >= 0.5 ? 2 : 4;
      spawnValueCopy[1] = Math.random() >= 0.5 ? 2 : 4;
    }
    setSpawnValue(spawnValueCopy); // reset copy?
    // add new grid to board by replacing previous
    let gridCopy: number[][] = [...gridInBoard];
    spawnValue?.forEach((newValue: number) => {
      let rowFirstGrid = Math.floor(Math.random() * 4); // exclude 4?
      let columnFirstGrid = Math.floor(Math.random() * 4);
      let gridIsZero = gridCopy[rowFirstGrid][columnFirstGrid] === 0;
      //pick new random grid if exists create function? by passing in the grid as value to return new randomvalue
      if (gridIsZero) {
        console.log("grid is zero");
        gridCopy[rowFirstGrid][columnFirstGrid] = newValue;
      }
    });
    setGridInBoard(gridCopy);
  };

  const gameStartState = () => {
    setGameStarted((prev) => !prev);
    spawnNewValueToBoard();
  };
  // down arrow and up arrow key down
  const columnManipulation = (column: number[]) => {};

  const onArrowKeyDownPressed = (event: globalThis.KeyboardEvent) => {
    let boardCopy: number[][] = [...gridInBoard];

    switch (event.key) {
      case "ArrowDown":
        console.log("down");
        break;
      case "ArrowUp":
        console.log("up");
        break;
      case "ArrowRight":
        console.log("right");
        // Problem moving in column instead
        boardCopy.forEach((row, i) => {
          boardCopy[i] = row.sort(); // cover more cases
        });
        spawnNewValueToBoard();

        break;
      case "ArrowLeft":
        console.log("left");
        break;
      default:
        break;
    }
    setGridInBoard(boardCopy);
  };

  useEffect(() => {
    if (gameStarted)
      window.addEventListener("keydown", (event) => {
        onArrowKeyDownPressed(event);
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
