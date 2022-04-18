import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";

const Cell = (props) => {
  const { cell, onPress } = props;
  return (
    <Pressable onPress={onPress} style={styles.cell}>
      {cell === "O" && (
        <Entypo name="circle" size={70} color="white" style={styles.circle} />
      )}
      {cell === "X" && (
        <Entypo name="cross" size={90} color="white" style={styles.cross} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    flex: 1,
  },
  cross: {
    marginTop: -10,
    marginLeft: 5,
  },
  circle: {
    marginLeft: 18,
  },
});

export default Cell;
