import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import { useEffect, useState, useRef } from "react";
import { Duration, intervalToDuration, isBefore } from "date-fns";
import { TimeSegment } from "../../components/TimeSegment";
import { getFromStorage, saveToStorage } from "../../utils/storage";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";

// Every 1 minutes
const frequency = 60 * 1000;

export const countdownStorageKey = "taskly-countdown";

export type PersistedCountdownState = {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
};

type CountdownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

export default function CounterScreen() {
  const { width } = useWindowDimensions(); // Adapt to landscape and portrait easily
  const confettiRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdownState, setCountdownState] =
    useState<PersistedCountdownState>();
  const [status, setStatus] = useState<CountdownStatus>({
    isOverdue: false,
    distance: {},
  });

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(value);
    };
    init();
  }, []);

  const lastCompletedAt = countdownState?.completedAtTimestamps[0];

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate the timestamp when the countdown is due
      const timestamp = lastCompletedAt
        ? lastCompletedAt + frequency // If last completed at is set, add the frequency to it
        : Date.now();

      // Add loading state here because there is an async fetching happening only when there is already a timestamp in storage.
      // This loading state is added to account for the delay in fetching the data.
   
        setIsLoading(false);
      
      // Check if the countdown is overdue
      const isOverdue = isBefore(timestamp, Date.now());

      // Calculate the distance between the current time and the due time
      const distance = intervalToDuration(
        isOverdue
          ? { start: timestamp, end: Date.now() }
          : { start: Date.now(), end: timestamp }
      );

      setStatus({ isOverdue, distance });
    }, 1000);

    return () => clearInterval(interval);
  }, [lastCompletedAt]);

  /**
   * Schedules a push notification to be sent at a specific time and updates the app's state and storage accordingly.
   */
  const scheduleNotification = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    confettiRef?.current?.start();
    let pushNotificationId;

    const result = await registerForPushNotificationsAsync();

    if (result === "granted") {
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Task Overdue Reminder",
          body: "Don't forget to complete the task! It's past due.",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: frequency / 1000,
        },
      });
    } else {
      Alert.alert(
        "Unable to schedule notification",
        "Enable the notifications permission for Expo Go in settings"
      );
    }

    // If a previous notification was scheduled, cancel it
    if (countdownState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        countdownState.currentNotificationId
      );
    }

    const newCountdownState: PersistedCountdownState = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: countdownState
        ? [Date.now(), ...countdownState.completedAtTimestamps] // Add the current timestamp to the list of completed timestamps
        : [Date.now()], // If no previous state, create a new list with the current timestamp
    };

    setCountdownState(newCountdownState);

    await saveToStorage(countdownStorageKey, newCountdownState);
  };

  if (isLoading) {
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        status.isOverdue ? styles.containerLate : undefined,
      ]}
    >
      {!status.isOverdue ? (
        <Text style={[styles.heading]}>Next car wash due in</Text>
      ) : (
        <Text style={[styles.heading, styles.whiteText]}>
          Car wash overdue by
        </Text>
      )}
      <View style={styles.row}>
        <TimeSegment
          unit="Days"
          number={status.distance?.days ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="Hours"
          number={status.distance?.hours ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="Minutes"
          number={status.distance?.minutes ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="Seconds"
          number={status.distance?.seconds ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
      </View>
      <TouchableOpacity
        onPress={scheduleNotification}
        activeOpacity={0.8}
        style={styles.button}
      >
        {!status.isOverdue ? (
          <Text style={styles.buttonText}>DONE</Text>
        ) : (
          <Text style={styles.buttonText}>OVERDUE</Text>
        )}
      </TouchableOpacity>
      <ConfettiCannon
        ref={confettiRef}
        count={50}
        origin={{ x: width / 2, y: -30 }}
        autoStart={false}
        fadeOut
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorWhite,
  },
  activityIndicatorContainer: {
    backgroundColor: theme.colorWhite,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: theme.colorBlack,
  },
  containerLate: {
    backgroundColor: theme.colorRed,
  },
  whiteText: {
    color: theme.colorWhite,
  },
});
