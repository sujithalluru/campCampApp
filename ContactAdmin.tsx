import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';


interface Admin {
  name: string;
  role: string;
  number: number;
//   email: string;
//   imageUrl: string;
}

// const admins: Admin[] = [
//   {
//     name: "John Doe",
//     role: "AP Calculus BC",
//     number: 5124968852,
//     // email: "adith.chandraiah@gmail.com",
//     // imageUrl: "https://images.squarespace-cdn.com/content/v1/5b56c01f9f877051fa238ca3/1573759915619-1LGAQ3NCIULHNEZ1OY87/Ray.jpg",
//   },
//   {
//     name: "Jane Smith",
//     role: "AP English Language and Composition",
//     number: 5124968852,
//     // email: "janesmith@example.com",
//     // imageUrl: "https://media.istockphoto.com/id/1151796047/photo/laughing-mature-businesswoman-wearing-glasses-posing-on-grey-studio-background.jpg?s=612x612&w=0&k=20&c=Nkb3aDxmf2g_-zFqq0j97x8J_V9asEq5XUpPJU4wxLc=",
//   },
//   // Add more teachers here
// ];

const ItemView = ({ item }: { item: Admin }) => {
  const handleNumberPress = () => {
    // Open the dialer with number
    Linking.openURL(`tel:${item.number}`);
};

  return (
    <TouchableOpacity style={styles.articleContainer} onPress={handleNumberPress}>
      {/* <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" /> */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.source}>{item.role}</Text>
      </View>
      <Icon name="chevron-right" size={30} color="gray" />
    </TouchableOpacity>
  );
};

const ItemSeparatorView = () => {
  return (
    // FlatList Item Separator
    <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8' }} />
  );
};

const ContactAdminsScreen = () => {
  const navigation = useNavigation();
  const [admins, setAdmins] = useState<Admin[]>([]);
  useEffect(() => {
    const fetchAdmins = async () => {
      const docRef = firestore().collection('ImportantPhone Numbers').doc('unique');
      const doc = await docRef.get();
      if (doc.exists) {
        let data = doc.data();
        if (data) {
          const updatedData = data.data.map((admin: any) => ({
            name: admin.name,
            role: admin.role,
            number: parseInt(admin.number, 10),
          }));
          setAdmins(updatedData);
        }
      } else {
        console.error('No such document!');
      }
    };
  
    fetchAdmins();
  }, []);
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
        >
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Contact Admins</Text>
      <FlatList
        data={admins}
        keyExtractor={(item, index) => index.toString()}
        renderItem={ItemView}
        ItemSeparatorComponent={ItemSeparatorView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 5,
    color: "#005987",
  },
  articleContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  image: {
    width: 70,
    height: 70,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
  source: {
    fontSize: 14,
    color: 'grey',
  },
});

export default ContactAdminsScreen;
