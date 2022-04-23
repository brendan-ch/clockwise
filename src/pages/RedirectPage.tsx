import React, { useEffect } from 'react';
import {
  ActivityIndicator, StyleSheet, Text, View,
} from 'react-native';
import handleRedirect from '../helpers/handleRedirect';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';

/**
 * Display a page with a redirecting message, and redirect
 * the user to the intended page.
 */
function RedirectPage() {
  const colors = useTheme();

  useEffect(() => {
    handleRedirect();
  }, []);

  return (
    <View style={[styles.container, {
      backgroundColor: colors.background,
    }]}
    >
      <View style={styles.innerContainer}>
        <ActivityIndicator
          color={colors.gray2}
        />
        <Text
          style={[TextStyles.textBold, {
            color: colors.primary,
          }]}
        >
          Redirecting you to the intended page...

        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  innerContainer: {
    height: 60,
    justifyContent: 'space-between',
  },
});

export default RedirectPage;
