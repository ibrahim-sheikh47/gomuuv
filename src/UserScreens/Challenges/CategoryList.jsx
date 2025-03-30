import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Container from "../../components/Container";
import Header from "../../components/Header";
import images from "../../constants/images";
import { colors } from "../../constants/colors";
import icons from "../../constants/icons";
import CustomButton from "../../components/CustomButton";
import CustomModal from "../../components/CustomModal";
import { challengesData } from "../../utils/data";
import StrengthIcon from "../../assets/svgs/StrengthIcon";
import { FontSize } from "../../utils/font";
import { useSelector } from "react-redux";

const CategoryList = () => {
  const route = useRoute();
  const { category } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [filteredChallenges, setFilteredChallenges] = useState([]);

  const { token } = useSelector((state) => ({
    token: state.Auth?.token,
  }));

  useEffect(() => {
    getFilteredChallenges();
  }, []);

  const openModal = (title) => {
    setSelectedTitle(title);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTitle("");
  };

  const getFilteredChallenges = async () => {
    try {
      const res = await API.get(
        `${END_POINTS.CHALLENGES}?filter=${category}`,
        null,
        token
      );
      if (res.data.success) {
        setFilteredChallenges(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching upcoming challenges:", error);
    }
  };

  const renderChallengeItem = ({ item }) => (
    <TouchableOpacity key={item.id} style={styles.challengeCard}>
      <Image style={styles.cardImage} source={item.image} />
      <View style={styles.cardContent}>
        <Text style={styles.challengeTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.description}</Text>
        <View
          style={{
            width: 45,
            height: 60,
            backgroundColor: "#3C3C3C",
            position: "absolute",
            borderRadius: 15,
            top: -50,
            right: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={[styles.absoluteText, { color: colors.green, fontSize: 16 }]}
          >
            {item.startDate}
          </Text>
          <Text style={[styles.absoluteText, { fontSize: 14 }]}>
            {item.startMonth}
          </Text>
        </View>
        <CustomButton
          style={{ width: 90, height: 28, marginLeft: "auto" }}
          textStyle={{ fontSize: FontSize.xxsmall, marginRight: 10 }}
          title={"Join Now"}
          onPress={() => openModal(item.title)} // Open modal with selected title
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <Container>
      <Header title={"Challenges & Goals"} showBackButton={true} />
      <View style={{ marginVertical: 30 }}>
        <Text style={styles.title}>{category}</Text>
      </View>
      <FlatList
        data={filteredChallenges}
        renderItem={renderChallengeItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <CustomModal
        visible={modalVisible}
        onClose={closeModal}
        modalIcon={<StrengthIcon />}
        width={240}
      >
        <Text style={styles.modalText}>
          You have successfully Enrolled in {""}
          <Text style={styles.selectedTitle}>{selectedTitle} Challenge</Text>
        </Text>
      </CustomModal>
    </Container>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
  },
  challengeCard: {
    height: 284,
    backgroundColor: colors.bgColor,
    borderRadius: 15,
    marginBottom: 20,
  },
  cardImage: {
    height: 175,
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardContent: {
    padding: 12,
    gap: 7,
  },
  challengeTitle: {
    color: colors.green,
    fontSize: FontSize.regular,
    fontFamily: "Poppins-SemiBold",
  },
  cardSubtitle: {
    color: "#F8F8F8",
    fontSize: FontSize.small,
    fontFamily: "Poppins-Regular",
  },
  absoluteText: {
    fontFamily: "Poppins-SemiBold",
    color: "white",
  },
  modalText: {
    fontSize: FontSize.medium,
    color: "white", // Style for the text that isn't the title
    textAlign: "center",
    marginTop: 20,
  },
  selectedTitle: {
    color: colors.green, // Style for the selected title
    fontFamily: "Poppins-SemiBold",
  },
});

export default CategoryList;
