import React, { useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { colors } from "../constants/colors";
import { FontSize } from "../utils/font";

const Selectable = ({
  items,
  selectedItem,
  setSelectedItem,
  style,
  wrapOnLineChange = false,
}) => {
  const scrollViewRef = useRef(null);
  const itemRefs = useRef([]); // Refs for each button

  useEffect(() => {
    if (!wrapOnLineChange && scrollViewRef.current && selectedItem) {
      const selectedIndex = items.indexOf(selectedItem);
      const selectedRef = itemRefs.current[selectedIndex];

      if (selectedRef) {
        selectedRef.measureLayout(
          scrollViewRef.current, // ✅ measure relative to ScrollView
          (x, y, width, height) => {
            scrollViewRef.current.scrollTo({ x: x - 20, animated: true });
          }
        );
      }
    }
  }, [selectedItem, wrapOnLineChange, items]);

  const content = (
    <View style={styles.timeRow}>
      {items.map((item, index) => (
        <View
          key={index}
          ref={(ref) => (itemRefs.current[index] = ref)} // attach ref to View, not TouchableOpacity
          style={[
            styles.timePeriodButton,
            selectedItem === item ? styles.activeButton : styles.inactiveButton,
          ]}
        >
          <TouchableOpacity onPress={() => setSelectedItem(item)}>
            <Text
              style={[
                styles.timePeriodText,
                selectedItem === item ? styles.activeText : styles.inactiveText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {wrapOnLineChange ? (
        content
      ) : (
        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  timeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    alignItems: "center",
  },
  timePeriodButton: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  activeButton: {
    backgroundColor: colors.green,
  },
  inactiveButton: {
    backgroundColor: "#242425",
  },
  timePeriodText: {
    fontSize: FontSize.small,
    fontFamily: "Poppins-SemiBold",
  },
  activeText: {
    color: "#000",
  },
  inactiveText: {
    color: "#fff",
  },
});

export default Selectable;
