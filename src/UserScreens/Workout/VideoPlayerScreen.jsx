import React from "react";
import { View, StyleSheet, Button, SafeAreaView, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";

const VideoPlayerScreen = () => {
  const route = useRoute();
  const { videoUrl } = route.params;
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.showNowPlayingNotification = false;
    player.currentTime = 10;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  player.onError = (error) => {
    Alert.alert("Video Error", error.message);
  };

  return (
    <SafeAreaView style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
      <View style={styles.controlsContainer}>
        <Button
          title={isPlaying ? "Pause" : "Play"}
          onPress={() => {
            try {
              if (isPlaying) {
                player.pause();
              } else {
                player.play();
              }
            } catch (error) {
              console.log(error);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    padding: 10,
    marginBottom: 75,
  },
});

export default VideoPlayerScreen;
