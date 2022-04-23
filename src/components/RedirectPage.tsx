import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import handleRedirect from '../helpers/handleRedirect';
import TextStyles from '../styles/Text';

/**
 * Display a page with a redirecting message, and redirect
 * the user to the intended page.
 */
function RedirectPage() {
  useEffect(() => {
    handleRedirect();
  }, []);

  return (
    <View>
      <Text style={TextStyles.textRegular}>Redirecting you to the intended page...</Text>
    </View>
  );
}

export default RedirectPage;
