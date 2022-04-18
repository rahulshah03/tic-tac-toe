import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ImageBackground, Alert } from "react-native";
import Cell from "./src/components/Cell";

import bg from "./assets/bg.jpeg";
import { TouchableHighlight } from "react-native";
import { TouchableOpacity } from "react-native";

const emptyMap = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

export default function App() {
  const [map, setMap] = useState(emptyMap);
  const [currentTurn, setCurrentTurn] = useState("X");
  const [gameMode, setgameMode] = useState("BOT");

  useEffect(() => {
    if (gameMode === "BOT" && currentTurn === "O") {
      botTurn();
    }
  }, [currentTurn, gameMode]);

  useEffect(() => {
    const winner = checkResult(map);
    if (winner === "X" || winner === "O") {
      wonGame(winner);
    } else {
      checkTie();
    }
  }, [map]);

  const onPress = (rowIndex, colIndex) => {
    if (!(map[rowIndex][colIndex] === "")) {
      Alert.alert("Position already occupied");
      return;
    }

    setMap((prevState) => {
      const updatedState = [...prevState];
      updatedState[rowIndex][colIndex] = currentTurn;
      return updatedState;
    });

    currentTurn === "X" ? setCurrentTurn("O") : setCurrentTurn("X");
  };

  const checkResult = (checkMap) => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      const isRowXWinning = checkMap[i].every((cell) => cell === "X");
      const isRowOWinning = checkMap[i].every((cell) => cell === "O");

      if (isRowXWinning) {
        return "X";
      }
      if (isRowOWinning) {
        return "O";
      }
    }

    //Check columns
    for (let col = 0; col < 3; col++) {
      let isXWinning = true;
      let isOWinning = true;
      for (let row = 0; row < 3; row++) {
        if (checkMap[row][col] !== "X") {
          isXWinning = false;
        }
        if (checkMap[row][col] !== "O") {
          isOWinning = false;
        }
      }
      if (isXWinning) {
        return "X";
      }
      if (isOWinning) {
        return "O";
      }
    }

    //Check Diagonals
    let isMainDiagonalXWinning = true;
    let isMainDiagonalOWinning = true;
    let isCrossDiagonalXWinning = true;
    let isCrossDiagonalOWinning = true;
    for (let i = 0; i < 3; i++) {
      if (checkMap[i][i] !== "X") {
        isMainDiagonalXWinning = false;
      }
      if (checkMap[i][i] !== "O") {
        isMainDiagonalOWinning = false;
      }
      if (checkMap[i][2 - i] !== "X") {
        isCrossDiagonalXWinning = false;
      }
      if (checkMap[i][2 - i] !== "O") {
        isCrossDiagonalOWinning = false;
      }
    }
    if (isCrossDiagonalOWinning || isMainDiagonalOWinning) {
      return "O";
    }
    if (isCrossDiagonalXWinning || isMainDiagonalXWinning) {
      return "X";
    }
    return null;
  };

  const wonGame = (player) => {
    Alert.alert("Hurray", `${player} won the Game!`, [
      {
        text: "Reset",
        onPress: () => resetGame(),
      },
    ]);
  };

  const resetGame = () => {
    setMap([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setCurrentTurn("X");
  };

  const checkTie = () => {
    const isTie = map.every((row) => row.every((cell) => cell !== ""));
    if (isTie) {
      Alert.alert("Tie", "It's a Tie!", [
        {
          text: "Reset",
          onPress: resetGame,
        },
      ]);
    }
  };

  const copyArray = (array) => {
    const newArray = [];
    for (let i = 0; i < array.length; i++) newArray[i] = array[i].slice();
    return newArray;
  };

  const botTurn = () => {
    const availablePositions = [];
    map.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === "") {
          availablePositions.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    let randomPosition;
    <a href="q2"></a>;
    //Attack
    availablePositions.forEach((availablePosition) => {
      const mapCopy = copyArray(map);
      mapCopy[availablePosition.row][availablePosition.col] = "O";
      const winner = checkResult(mapCopy);
      if (winner === "O") {
        randomPosition = availablePosition;
      }
    });

    //Defend
    if (!randomPosition) {
      availablePositions.forEach((availablePosition) => {
        const mapCopy = copyArray(map);
        mapCopy[availablePosition.row][availablePosition.col] = "X";
        const winner = checkResult(mapCopy);
        if (winner === "X") {
          randomPosition = availablePosition;
        }
      });
    }

    //Choose random
    if (!randomPosition) {
      randomPosition =
        availablePositions[
          Math.floor(Math.random() * availablePositions.length)
        ];
    }

    if (randomPosition) {
      onPress(randomPosition.row, randomPosition.col);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bg} style={styles.bg} resizeMode="contain">
        {gameMode === "PASS N PLAY" ? (
          <Text style={styles.turn}>{`Current Turn: ${currentTurn}`}</Text>
        ) : (
          <Text style={styles.turn}>You are playing as "X"</Text>
        )}

        <View style={styles.map}>
          {map.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((cell, colIndex) => (
                <Cell
                  key={`col=${colIndex}`}
                  cell={cell}
                  onPress={() => onPress(rowIndex, colIndex)}
                />
              ))}
            </View>
          ))}
        </View>
        <View style={styles.buttons}>
          <TouchableHighlight
            underlayColor="#fff"
            onPress={() => setgameMode("BOT")}
            style={[
              styles.button,
              { backgroundColor: gameMode === "BOT" ? "#98b2e6" : "white" },
            ]}
          >
            <Text>COMPUTER</Text>
          </TouchableHighlight>

          <TouchableHighlight
            underlayColor="#fff"
            onPress={() => setgameMode("PASS N PLAY")}
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "PASS N PLAY" ? "#98b2e6" : "white",
              },
            ]}
          >
            <Text>PASS N PLAY</Text>
          </TouchableHighlight>
        </View>
      </ImageBackground>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#242D34",
  },
  bg: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
  },
  map: {
    width: "80%",
    aspectRatio: 1,
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  turn: {
    color: "white",
    fontSize: 30,
    fontFamily: "Avenir",
    fontWeight: "bold",
    bottom: 100,
  },
  buttons: {
    position: "absolute",
    bottom: 100,
    flexDirection: "row",
  },
  button: {
    marginHorizontal: 20,
    width: 130,
    alignItems: "center",
    fontSize: 18,
    fontFamily: "Avenir",

    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    fontWeight: "500",
    borderRadius: 20,
  },
});
