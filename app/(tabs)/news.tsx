import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NewsCard = ({
  title,
  date,
  description,
}: {
  title: string;
  date?: string;
  description?: string;
}) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardText} numberOfLines={1}>
        {title}
      </Text>

      {date && (
        <View style={{ marginLeft: 10}}>
        <Text style={styles.date} numberOfLines={1}>
          {date}
        </Text>
        </View>
      )}
    </View>

    {description && (
      <View style={styles.descriptionContent}>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
    )}
  </View>
);

export default function news() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 40 }}>
        <NewsCard
          title='BIG EVENT'
          date='Tonight at 9PM'
          description='Join us for live music, drink specials, and the actual 16th U.S. President Abraham Lincoln!'
        />

        <NewsCard
          title='EVEN BIGGER EVENT'
          date='Next Saturday'
          description={"Celebrate the Parade of Planets and the cool dimensional portal it opens in the bar. It's kinda crazy. We will also have bingo with free drinks as prizes!"}
        />

        <NewsCard
          title='Bar Name: That One Bar'
          date='Date: Sometime'
          description='This is where you would provide the bar info or other miscellanous info.'
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333333',
    minHeight: 110,
    padding: 10,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    paddingBottom: 5,
  },
  cardText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  descriptionContent: {
    margin: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
});
