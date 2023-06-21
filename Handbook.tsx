import React, { useRef } from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';

const Handbook = () => {
  const navigation = useNavigation();
  const webViewRef = useRef<any>(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16, marginRight: -40 }}
        >
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleWebViewLoad = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        // Find and click the fullscreen button
        document.querySelector('#ird3-button-fullscreen').click()
      `);
    }
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'https://issuu.com/campmatters/docs/updated_newsletter_summer_2023' }}
      style={{ flex: 1 }}
      onLoadEnd={handleWebViewLoad}
    />
  );
};

export default Handbook;
