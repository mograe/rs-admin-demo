import { usePlayer } from '@/contexts/PlayerProvider';
import { useSocket } from '@/contexts/SocketProvider';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function BottomBar() {
  const {play, next, prev, pause} = useSocket()
  const {currentTitle} = usePlayer();
  const insets = useSafeAreaInsets();

  const [isPlaying, setIsPlaying] = useState(false);

  const handlePrev = () => {prev()};
  const handlePlayPause = () => { setIsPlaying(!isPlaying); if(isPlaying) pause(); else play(); };
  const handleNext = () => {next()};

  return (
    <View style={[styles.wrapper, {paddingBottom: insets.bottom}]}>
      <Text style={styles.title} numberOfLines={1}>{currentTitle ?? 'Выберите видео'}</Text>
      <View style={styles.ctrl}>
        <TouchableOpacity onPress={handlePrev}><Ionicons name="play-skip-back"  size={28} /></TouchableOpacity>
        <TouchableOpacity onPress={handlePlayPause}><Ionicons name={isPlaying ? 'pause' : 'play'} size={28} /></TouchableOpacity>
        <TouchableOpacity onPress={handleNext}><Ionicons name="play-skip-forward" size={28} /></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingVertical: 8, paddingHorizontal: 12, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#d1d5db', backgroundColor: '#f9fafb' },
  title:   { textAlign: 'center', fontWeight: '600', marginBottom: 4 },
  ctrl:    { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
});
