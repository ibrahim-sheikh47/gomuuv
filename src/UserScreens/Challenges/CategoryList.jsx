import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
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
import { API } from "../../config/apiClient";
import { END_POINTS } from "../../config/routes";
import moment from "moment";

const CategoryList = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [filteredChallenges, setFilteredChallenges] = useState([]);

  const { token, userData } = useSelector((state) => ({
    token: state.Auth?.token,
    userData: state.Auth?.data,
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

  const handleJoinChallenge = async (challenge) => {
    try {
      let payload = { challengeId: challenge._id };
      const res = await API.post(
        `${END_POINTS.CHALLENGES}/enroll-challenge`,
        payload,
        token
      );
      if (res.data.success) {
        openModal(challenge.workout.name);
      }
    } catch (error) {
      console.error("Error enrolling into challenge:", error);
    }
  };

  const renderChallengeItem = ({ item }) => (
    <TouchableOpacity
      key={item._id}
      style={styles.challengeCard}
      onPress={() => {
        navigation.navigate("ChallengeDetail", { challenge: item });
      }}
    >
      {/* <Image style={styles.cardImage} source={item.image} /> */}
      <Image style={styles.cardImage} source={images.sessionBg} />
      <View style={styles.cardContent}>
        <Text style={styles.challengeTitle}>{item.workout.name}</Text>
        <Text style={styles.cardSubtitle}>{item.workout.description}</Text>
        <Text
          style={[
            styles.absoluteText,
            { color: colors.green, fontSize: FontSize.small },
            {
              backgroundColor: "#3C3C3C",
              position: "absolute",
              borderRadius: 15,
              top: -50,
              right: 10,
              justifyContent: "center",
              alignItems: "center",
              padding: 6,
            },
          ]}
        >
          {`${moment(item.startDate).format("DD MMM")} - ${moment(
            item.endDate
          ).format("DD MMM")}`}
        </Text>
        <CustomButton
          style={{ width: 90, height: 28, marginLeft: "auto" }}
          textStyle={{ fontSize: FontSize.xxsmall, marginRight: 10 }}
          title={
            item.participants.includes(userData._id) ? "Joined" : "Join Now"
          }
          onPress={() => {
            if (!item.participants.includes(userData._id))
              handleJoinChallenge(item);
          }} // Open modal with selected title
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
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20,
          alignItems: "center",
          justifyContent:
            filteredChallenges.length === 0 ? "center" : "flex-start",
        }}
        ListEmptyComponent={
          <Text
            style={{
              fontSize: FontSize.small,
              color: "white",
              fontWeight: "bold",
            }}
          >
            No Challenge
          </Text>
        }
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
