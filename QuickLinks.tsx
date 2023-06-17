import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';


interface QuickLinkProps {
link: string;
title: string;
description: string;
}


const QuickLink: React.FC<QuickLinkProps> = ({ link, title, description }) => {
return (
<TouchableOpacity style={styles.linkSquare} onPress={() => console.log(link)}>
<Text style={styles.linkText}>{title}</Text>
<Text style={styles.linkDescription}>{description}</Text>
</TouchableOpacity>
);
}


const QuickLinks = () => {
const [search, setSearch] = useState('');
const linksData = [
{ title: "Link1", link: "https://www.leanderisd.org/registration/", description: "Description" },
{ title: "Link2", link: "https://www.leanderisd.org/attendance/", description: "Description" },
{ title: "Link3", link: "https://www.leanderisd.org/childnutritionservices/", description: "Description" },
{ title: "Link4", link: "https://www.leanderisd.org/calendar/", description: "Description" },
{ title: "Link5", link: "https://www.leanderisd.org/transportation/", description: "Description" },
{ title: "Link6", link: "https://www.leanderisd.org/homeaccesscenter/", description: "Description" },
{ title: "Link7", link: "https://www.leanderisd.org/mlisd/", description: "Description" },
{ title: "Link8", link: "https://www.leanderisd.org/volunteering/#pta", description: "Description" },
{ title: "Link9", link: "https://www.leanderisd.org/committees/", description: "Description" },
{ title: "Link10", link: "https://www.leanderisd.org/volunteering/#booster", description: "Description" },
{ title: "Link11", link: "https://www.leanderisd.org/flyers/", description: "Description" },
{ title: "Link12", link: "https://www.leanderisd.org/legalservices/#pia", description: "Description"},
{ title: "Link13", link: "https://www.leanderisd.org/clothescloset/", description: "Description" },
{ title: "Link14", link: "https://leeftx.org/", description: "Description" },
{ title: "Link15", link: "https://www.leanderisd.org/attendancezones/", description: "Description" },
{ title: "Link16", link: "https://www.leanderisd.org/immunizations/", description: "Description" },




// add as many links as needed
];


const filteredLinksData = linksData.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));


const navigation = useNavigation();


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
<SearchBar
placeholder="Search Link"
onChangeText={setSearch}
value={search}
containerStyle={styles.searchContainer}
inputContainerStyle={styles.searchInputContainer}
inputStyle={styles.searchInput}
/>
<ScrollView contentContainerStyle={styles.linksContainer}>
{filteredLinksData.map((item, index) => (
<QuickLink key={index} title={item.title} link={item.link} description={item.description} />
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
searchContainer: {
backgroundColor: '#fff',
borderBottomColor: 'transparent',
borderTopColor: 'transparent',
paddingHorizontal:17,
paddingTop: 15,
},
searchInputContainer: {
backgroundColor: '#f0f0f0',
borderRadius: 10,
},
searchInput: {
color: '#000',
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
});


export default QuickLinks;
















