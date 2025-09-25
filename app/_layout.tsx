import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomBar from '../components/BottomBar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* основной контент Expo Router */}
        <View style={styles.content}>
          <Slot />
        </View>

        {/* нижняя панель управления фильмом */}
        <BottomBar />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content:   { flex: 1 },
});
