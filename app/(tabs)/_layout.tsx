import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Clients from './clients';
import Movies from './movies';
import Server from './server';

const TopTabs = createMaterialTopTabNavigator();

export default function TabsLayout() {

  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <TopTabs.Navigator
        initialRouteName='server'
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: '#3b82f6' },
        }}
      >
        <TopTabs.Screen name="server" component={Server}  options={{ title: 'Сервер' }} />
        <TopTabs.Screen name="clients" component={Clients} options={{ title: 'Список подключившихся' }} />
        <TopTabs.Screen name="movies"  component={Movies}  options={{ title: 'Фильмы' }} />
      </TopTabs.Navigator>
    </View>
  );
}
