import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { colors } from "../constants/colors";
import { FontSize } from "../utils/font";

const MultiSelectable = ({
  items,
  selectedItems,
  setSelectedItems,
  style,
  wrapOnLineChange = false,
}) => {
  const handleItemPress = (item) => {
    if (selectedItems.includes(item)) {
      // Remove item if already selected
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem !== item)
      );
    } else {
      // Add item if not selected
      setSelectedItems([...selectedItems, item]);
    }
  };

  const content = (
    <View style={styles.timeRow}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.timePeriodButton,
            selectedItems.includes(item)
              ? styles.activeButton
              : styles.inactiveButton,
          ]}
          onPress={() => handleItemPress(item)}
        >
          <Text
            style={[
              styles.timePeriodText,
              selectedItems.includes(item)
                ? styles.activeText
                : styles.inactiveText,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {wrapOnLineChange ? (
        content
      ) : (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {content}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Added default styles for the container
  },
  timeRow: {
    flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping to next line
    marginTop: 10,
    alignItems: "center",
  },
  timePeriodButton: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10, // Added margin to space out buttons
    marginBottom: 10, // Added margin to space out buttons vertically
  },
  activeButton: {
    backgroundColor: colors.green, // Active button background
  },
  inactiveButton: {
    backgroundColor: "#242425", // Inactive button background
  },
  timePeriodText: {
    fontSize: FontSize.small, // Set font size for text
    fontFamily: "Poppins-SemiBold",
  },
  activeText: {
    color: "#000", // Active text color
  },
  inactiveText: {
    color: "#fff", // Inactive text color
  },
});

export default MultiSelectable;
