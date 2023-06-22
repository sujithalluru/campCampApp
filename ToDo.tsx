import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle} from 'react-native';

interface Props {
  id: React.Key,
  summary: string,
  description: string,
  createdAt: Date, // Add this line
}

const CalendarEvent = ({ id, summary, description, createdAt}: Props) => {
    return (
      <View key={id} style={styles.container}>
        <View style={styles.blueStripWrapper}>
          <View style={styles.blueStrip} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{summary}</Text>
          <Text style={styles.time}>
            {description}
          </Text>
          <Text style={styles.createdAt}>
            {createdAt ? createdAt.toLocaleString() : 'N/A'}
          </Text>
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2.5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  blueStripWrapper: {
    width: 8,
    backgroundColor: '#db2125',
    borderRadius: 4,
    overflow: 'hidden',
    paddingRight: 6,
  },
  blueStrip: {
    flex: 1,
    backgroundColor: '#db2125',
    borderRadius: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10, // add some left margin
  },
  time: {
    fontSize: 16,
    color: '#5A5A5A',
    marginBottom: 2.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2.5,
  },
  location: {
    fontSize: 16,
    color: '#999',
  },
  createdAt: {
    fontSize: 14,
    color: '#999',
  },
});

export default CalendarEvent;