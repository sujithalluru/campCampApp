import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';

type RootStackParamList = {
    Home: undefined;
    NewsScreen: undefined;
    ContactTeachers: undefined;
    BusTracking: undefined;
    GoogleFeedback: undefined;
    ContactUs: undefined;
    VirtualAssistant: undefined;
    QuickLinks: undefined
    Details: { id: number };
    WebViewScreen: { url: string };
  };
  
  type Props = {
    navigation: NavigationProp<RootStackParamList, 'QuickLinks'>;
  }

interface QuickLinkProps {
url: string;
title: string;
description: string;
navigation: NavigationProp<RootStackParamList, 'QuickLinks'>
}

const QuickLink: React.FC<QuickLinkProps> = ({ url, title, description, navigation }) => {
console.log(url);
return (
<TouchableOpacity style={styles.linkSquare} onPress={() => {
            navigation.dispatch(
                CommonActions.navigate({
                  name: "WebViewScreen",
                  params: { url: url },
                }
                )
                
            );
        }}>
<Text style={styles.linkText}>{title}</Text>
<Text style={styles.linkDescription}>{description}</Text>
</TouchableOpacity>
);
}


const QuickLinks = () => {
const [search, setSearch] = useState('');
const [linksData, setLinksData] = useState<QuickLinkProps[]>([]);
useEffect(() => {
  const fetchLinks = async () => {
    const docRef = firestore().collection('OtherQuick Links').doc('unique');
    const doc = await docRef.get();
    if (doc.exists) {
      let data = doc.data();
      if (data) {
        const updatedData = data.data.map((admin: any) => ({
          title: admin.title,
          description: admin.description,
          url: admin.url,
        }));
        setLinksData(updatedData);
      }
    } else {
      console.error('No such document!');
    }
  };

  fetchLinks();
}, []);

const filteredLinksData = linksData.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));


const navigation = useNavigation();


React.useLayoutEffect(() => {
  navigation.setOptions({
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginLeft: 16}}
      >
        <Icon name="chevron-left" size={24} color="white" />
      </TouchableOpacity>
    ),
  });
}, [navigation]);


return (
    <View style={styles.container}>
     <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Link"
          placeholderTextColor="#888"
          onChangeText={setSearch}
          value={search}
        />
        {search !== '' && (
          <TouchableOpacity style={styles.clearIconContainer} onPress={() => setSearch('')}>
            <Icon name="times-circle" size={20} color="#888" style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>

<ScrollView contentContainerStyle={styles.linksContainer}>
{filteredLinksData.map((item, index) => (
<QuickLink key={index} title={item.title} url={item.url} description={item.description} navigation = {navigation}/>
))}
</ScrollView>
</View>
);
}


const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#fff',
},

linksContainer: {
flexDirection: 'row',
flexWrap: 'wrap',
justifyContent: 'space-around',
padding: 10,
},
linkSquare: {
width: '45%',
height: 130,
padding: 20,
justifyContent: 'center',
alignItems: 'center',
borderRadius: 15,
marginBottom: 20,
backgroundColor: '#f0f0f0',
borderWidth: 2,
borderColor: '#ebe8e8',
elevation: 3, // for Android
},
linkText: {
color: '#000',
fontSize: 16,
marginBottom: 7, // Creates space between the title and the description
textAlign: 'center',
},
linkDescription: {
color: '#888',
fontSize: 11.5,
justifyContent:'center',
textAlign: 'center',
},
searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 17,
    height: 50,
    margin: 10,
    marginBottom: 5,
  },
  
  searchIcon: {
    marginRight: 10,
  },
  
  searchInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    paddingVertical: 10,
  },
  
  clearIconContainer: {
    marginLeft: 10,
  },
  
  clearIcon: {
    padding: 5,
  },
});


export default QuickLinks;
















