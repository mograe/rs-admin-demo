// app/(tabs)/server.tsx
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';

/**
 * 👉 В реальном приложении кавычки-заглушки (localhost, 3001, 0 клиентов, …)
 *    должны приходить из socket.io-client или контекста (useServer()).
 *    Ниже всё сохраняется локально, чтобы экран сразу был интерактивным.
 */
export default function Server() {
  const [isRunning, setIsRunning] = useState(false);
  const [serverIp, setServerIp] = useState('192.168.0.42');
  const [serverPort, setServerPort] = useState(3001);
  const [clientCount, setClientCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const { width, height } = useWindowDimensions();
  const DIAMETER = Math.max(160, Math.min(0.35 * Math.min(width, height), 260));
  const FONT     = DIAMETER * 0.22;     // ≈ 22 % диаметра

  /** Подписка на события сервера (заглушка) */
  useEffect(() => {
    // TODO: заменить на socket.io-client:
    // socket.on('server-info', (info) => { setServerIp(info.ip); ... })
    // socket.on('client-count', (n) => setClientCount(n));
    // socket.on('log', (line) => setLogs((prev) => [line, ...prev.slice(0, 49)]));

    // ↙ для демо каждые 5 с «приходит» новый лог
    const timer = setInterval(() => {
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ping`, ...prev.slice(0, 49)]);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const toggleServer = () => {
    // TODO: socket.emit(isRunning ? 'stop' : 'start');
    setIsRunning(prev => !prev);
    appendLog(isRunning ? '>>> Server stopped' : '>>> Server started');
  };

  const appendLog = (text: string) =>
    setLogs(prev => [text, ...prev.slice(0, 49)]); // максимум 50 строк

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{               /* выравниваем всё по центру */
        alignItems: 'center',
      }}
      nestedScrollEnabled                    /* чтобы внутренний лог тоже скроллился */
    >
      {/* Кнопка Start/Stop */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleServer}
        style={[
          styles.button,
            {
            width: DIAMETER,
            height: DIAMETER,
            borderRadius: DIAMETER / 2,
            backgroundColor: isRunning ? '#10b981' : '#ef4444',
          },
        ]}
      >
        <Text 
            style={[styles.buttonText, { fontSize: FONT }]}
            numberOfLines={1}
            adjustsFontSizeToFit
        >
                {isRunning ? 'STOP' : 'START'}
        </Text>
      </TouchableOpacity>

      {/* Информация о сервере */}
      <View style={styles.infoBox}>
        <InfoRow label="Статус"   value={isRunning ? 'Запущен' : 'Остановлен'} />
        <InfoRow label="IP:Порт"  value={`${serverIp}:${serverPort}`} />
        <InfoRow label="Клиентов" value={clientCount.toString()} />
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
