// app/(tabs)/clients.tsx
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    ListRenderItemInfo,
    StyleSheet,
    Text,
    View,
} from 'react-native';

/** Структура одного клиента */
type Client = {
  id: string;          // socket-id
  name: string;        // удобное имя устройства
  ip: string;          // IPv4
  latency: number;     // ping, ms
  position: number;    // текущий тайм-код, сек
};

/** ⚠️ DEMO-данные.
 *  В реальном приложении берите их из контекста (useServer())
 *  и обновляйте по событию `clients` от rsserver. */
export default function ClientsScreen() {
  const [clients, setClients] = useState<Client[]>([]);

  /* имитируем поток клиентов */
  useEffect(() => {
    const timer = setInterval(() => {
      setClients(prev => {
        const id   = Math.random().toString(36).slice(2, 7);
        const item: Client = {
          id,
          name: 'VR-' + id,
          ip: `192.168.0.${10 + prev.length}`,
          latency: Math.round(20 + Math.random() * 40),
          position: Math.random() * 120,
        };
        return [item, ...prev].slice(0, 30);
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  /** Рендер одной строки */
  const renderItem = ({ item }: ListRenderItemInfo<Client>) => (
    <View style={styles.row}>
      <Cell text={item.name}   flex={2} />
      <Cell text={item.ip}     flex={2} />
      <Cell text={item.latency + ' ms'} flex={1} />
      <Cell text={item.position.toFixed(1) + ' s'} flex={1.5} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Заголовок таблицы */}
      <View style={[styles.row, styles.header]}>
        <Cell text="Устройство" flex={2}  header />
        <Cell text="IP"         flex={2}  header />
        <Cell text="Ping"       flex={1}  header />
        <Cell text="Позиция"    flex={1.5} header />
      </View>

      {/* Список клиентов */}
      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 12 }}
      />
    </View>
  );
}

/** Ячейка */
const Cell = ({
  text,
  flex = 1,
  header = false,
}: {
  text: string;
  flex?: number;
  header?: boolean;
}) => (
  <View style={[styles.cell, { flex }]}>
    <Text style={header ? styles.hText : styles.cText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 8, paddingTop: 12 },
  /* строки */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 38,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#d1d5db',
  },
  header: { backgroundColor: '#f3f4f6' },

  /* ячейка */
  cell: { justifyContent: 'center', paddingHorizontal: 6 },
  hText: { fontWeight: '700', fontSize: 13 },
  cText: { fontSize: 13 },
});
