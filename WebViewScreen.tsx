import { WebView } from 'react-native-webview';
import { RouteProp } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity, Linking, Text, ScrollView } from 'react-native';
import React, { useRef } from 'react';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

type RootStackParamList = {
  Home: undefined;
  NewsScreen: undefined;
  ContactTeachers: undefined;
  Details: { id: number };
  WebViewScreen: { url: string };
};

type Props = {
  route: RouteProp<RootStackParamList, 'WebViewScreen'>;
};

const WebViewScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const { url } = route.params;
  const webViewRef = useRef<any>(null);

  const handleLoadEnd = () => {
  };

  return <WebView ref={webViewRef} source={{ uri: url }} />;
};

export default WebViewScreen;
