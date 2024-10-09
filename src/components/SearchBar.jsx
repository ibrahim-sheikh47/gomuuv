// SearchBar.js
import React from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar } from "react-native-paper";

const SearchBar = ({ searchQuery, onChangeSearch }) => {
  return (
    <View style={styles.searchContainer}>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        placeholderTextColor="white"
        inputStyle={styles.input}
        iconColor="white"
        style={styles.searchBarStyle}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    marginVertical: 20,
  },
  searchBarStyle: {
    backgroundColor: "#242425",
    borderRadius: 10,
  },
  input: {
    color: "white",
  },
});
