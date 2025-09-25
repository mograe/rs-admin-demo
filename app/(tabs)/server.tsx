// app/(tabs)/server.tsx
import { useSocket } from '@/contexts/SocketProvider';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * 👉 В реальном приложении кавычки-заглушки (localhost, 3001, 0 клиентов, …)
 *    должны приходить из socket.io-client или контекста (useServer()).
 *    Ниже всё сохраняется локально, чтобы экран сразу был интерактивным.
 */
export default function Server() {
  const {connected, isConnecting, connect, disconnect, serverUrl, clients, logs} = useSocket();

  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const DIAMETER = Math.max(160, Math.min(0.35 * Math.min(width, height), 260));
  const FONT     = DIAMETER * 0.22;     // ≈ 22 % диаметра

  const onPress = connected ? disconnect : connect;
  const label = connected ? 'STOP' : (isConnecting ? '...' : 'START');
  const color = connected ? '#f59e0b' : (isConnecting ? '#9ca3af' : '#10b981');

  let hostPort = serverUrl;
  try {hostPort = new URL(serverUrl).host; } catch {}

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{               /* выравниваем всё по центру */
        alignItems: 'center',
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 24,
      }}
      nestedScrollEnabled                    /* чтобы внутренний лог тоже скроллился */
    >
      {/* Кнопка CONNECT/DISCONNECT */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[
          styles.button,
            {
            width: DIAMETER,
            height: DIAMETER,
            borderRadius: DIAMETER / 2,
            backgroundColor: color,
          },
        ]}
      >
        <Text 
            style={[styles.buttonText, { fontSize: FONT }]}
            numberOfLines={1}
            adjustsFontSizeToFit
        >
                {label}
        </Text>
      </TouchableOpacity>

      {/* Информация о сервере */}
      <View style={styles.infoBox}>
        <InfoRow label="Статус"   value={connected ? 'Подключено' : (isConnecting ? 'Подключаемся…' : 'Отключено')} />
        <InfoRow label="IP:Порт"  value={hostPort} />
        <InfoRow label="Клиентов" value={String(clients?. length ?? 0)} />
      </View>

      {/* Логи */}
      <Text style={styles.logHeader}>Последние события</Text>
      <ScrollView style={styles.logBox}>
        {logs.map((line, idx) => (
          <Text key={idx} style={styles.logLine}>{line}</Text>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

/** Вспомогательный компонент строки информации */
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}:</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const BUTTON_SIZE = 160;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 32 },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: { color: '#fff', fontSize: 28, fontWeight: '700' },

  infoBox: { width: '90%', marginBottom: 16 },
  row:     { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  rowLabel:{ color: '#6b7280' },
  rowValue:{ fontWeight: '600' },

  logHeader:{ alignSelf: 'flex-start', marginLeft: '5%', marginBottom: 4, color: '#374151' },
  logBox:   { flex: 1, width: '90%', borderWidth: StyleSheet.hairlineWidth, borderColor: '#d1d5db', borderRadius: 6, padding: 6 },
  logLine:  { fontSize: 12, lineHeight: 16 },
});
