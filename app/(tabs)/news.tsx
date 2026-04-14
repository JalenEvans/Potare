import React from "react";
import { StyleSheet, Text, View, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface NewsItem {
  id: string;
  title: string;
  date?: string;
  description?: string;
}

const NewsCard = ({ title, date, description }: Omit<NewsItem, "id">) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardText}>
        {title}
      </Text>

      {date && (
        <View style={{ marginLeft: 10 }}>
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

const EXAMPLE_NEWS_DATA: NewsItem[] = [
  {
    id: "1",
    title: "BIG EVENT",
    date: "Tonight at 9PM",
    description:
      "Join us for live music, drink specials, and the actual 16th U.S. President Abraham Lincoln!",
  },
  {
    id: "2",
    title: "EVEN BIGGER EVENT",
    date: "Next Saturday",
    description:
      "Celebrate the Parade of Planets and the cool dimensional portal it opens in the bar.",
  },
  {
    id: "3",
    title: "Bar Name: That One Bar",
    date: "Date: Sometime",
    description:
      "This is where you would provide the bar info or other miscellanous info.",
  },
];

export default function news() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={EXAMPLE_NEWS_DATA}
        keyExtractor={(item) => item.id}
        contentContainerStyle ={{padding: 15, paddingBottom: 40}}
        renderItem={({ item }) => (
          <NewsCard
            title={item.title}
            date={item.date}
            description={item.description}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#333333",
    minHeight: 110,
    padding: 10,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
    paddingBottom: 5,
  },
  cardText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
  },
  descriptionContent: {
    margin: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: "#000000",
    lineHeight: 20,
  },
});
