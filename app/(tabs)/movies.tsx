import { usePlayer } from '@/contexts/PlayerProvider';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

/* Тип фильма */
type Movie = {
  id: string;
  title: string;
  length: number;   // минут
  thumb: any;       // require('../assets/…')  или  { uri: 'https://…' }
};

/* DEMO-каталог ─ замените своим */
const demoMovies: Movie[] = [
  { id: 'm1', title: 'Roller Coaster 360', length: 4,  thumb: require('../../assets/roller.jpg') },
  { id: 'm2', title: 'Space Journey',     length: 7,  thumb: require('../../assets/space.jpg') },
  { id: 'm3', title: 'Deep Ocean VR',     length: 5,  thumb: require('../../assets/ocean.jpg') },
  { id: 'm4', title: 'City Drone Tour',   length: 6,  thumb: require('../../assets/city.jpg') },
];

export default function MoviesScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const {setCurrentTitle} = usePlayer();

  const selectMovie = (movie: Movie) => {
    setSelectedId(movie.id);
    setCurrentTitle(movie.title);
    // TODO: socket.emit('selectMovie', movie.id);
  };

  const renderItem = ({ item }: ListRenderItemInfo<Movie>) => {
    const active = item.id === selectedId;
    return (
      <Pressable onPress={() => selectMovie(item)} style={[styles.row, active && styles.active]}>
        <Image source={item.thumb} style={styles.thumb} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, active && styles.activeText]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.subtitle}>{item.length} мин.</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={demoMovies}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}

const THUMB_H = 66;

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  active:   { backgroundColor: '#dbeafe' },
  thumb:    { width: THUMB_H * 1.6, height: THUMB_H, borderRadius: 6, marginRight: 10 },
  title:    { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  activeText:{ color: '#1e3a8a' },
  subtitle: { fontSize: 12, color: '#6b7280' },
  sep:      { height: 6 },
});
