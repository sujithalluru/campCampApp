import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { NavigationProp, CommonActions } from '@react-navigation/native';
import axios from 'axios';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  MainAdmin: undefined;
};

type LoginScreenNavigationProp = NavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}


const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [query, setQuery] = useState('');
  const [allowedUsers, setAllowedUsers] = useState(["No Allowed Users"]);
  const [isAdmin, setIsAdmin] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/15gnblZ7D3eqtvz6ew7LLcOnVvGy0YXyj_Q5psekdSXE/values/Sheet1!A1:Z1000?key=AIzaSyBBOV4VJn94PyDhOONgrLibpPOc27OhbVo`);
        const rows = response.data.values;
        setAllowedUsers(rows.map((row: any[]) => row[0])); // Assuming usernames are in the first column
      } catch (error) {
        console.error("Error while fetching data from Google Sheets:", error);
      }
    };

    fetchUsers();
  }, []);
  const handleLogin = () => {
    if (allowedUsers.includes(query) && !isAdmin) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      );
    } else if(allowedUsers.includes(query) && isAdmin){
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainAdmin' }],
        })
      );
    } else {
      // Handle unauthorized user case
    }
  };

  const findUser = (query: string) => {
    if (query === '') {
      return [];
    }

    const regex = new RegExp(`${query.trim()}`, 'i');
    return allowedUsers.filter(user => user.search(regex) >= 0);
  }

  const users = findUser(query);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Our App!</Text>
      <TextInput
        label="Username"
        value={query}
        onChangeText={text => setQuery(text)}
        style={styles.input}
        secureTextEntry={false}
      />
      <View style={styles.dropdownContainer}>
        <FlatList
          data={users}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {setQuery(item) 
                                              item==allowedUsers[0] ? setIsAdmin(true): setIsAdmin(false)}} style={styles.item}>
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.dropdown}
        />
      </View>
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 60,
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  input: {
    minWidth: 200,
    height: 50,
    backgroundColor: '#bfe1ff',
    marginBottom: 16,
  },
  item: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 15,
    color: '#000',
  },
  dropdownContainer: {
    height: 150,
    width: '100%',
    marginBottom: 16,
  },
  dropdown: {
    flex: 1,
  },
  button: {
    marginTop: 16,
    backgroundColor:'#3495eb',
  },
});

export default LoginScreen;