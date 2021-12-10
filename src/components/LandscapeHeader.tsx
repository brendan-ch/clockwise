import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import {
  Platform, Pressable, StyleSheet, Text, View,
} from 'react-native';
import AppContext from '../../AppContext';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';

/**
 * Props for the header button.
 */
interface Props {
  iconName?: string,
  onPress?: () => any,
}

/**
 * Render a header button.
 */
function HeaderButton({ iconName, onPress }: Props) {
  const [hovering, setHovering] = useState(false);

  const colorValues = useTheme();

  return (
    <Pressable onPress={onPress}>
      <View
        style={[buttonStyles.container]}
        // @ts-ignore
        onMouseEnter={Platform.OS === 'web' ? () => setHovering(true) : undefined}
        onMouseLeave={Platform.OS === 'web' ? () => setHovering(false) : undefined}
      >
        {iconName ? (
          <Ionicons
            // @ts-ignore
            name={iconName}
            size={30}
            color={hovering ? colorValues.gray3 : colorValues.gray4}
          />
        ) : undefined}
      </View>
    </Pressable>
  );
}

const buttonStyles = StyleSheet.create({
  container: {
    width: 35,
    height: 35,
  },
});

HeaderButton.defaultProps = {
  iconName: undefined,
  onPress: () => {},
};

/**
 * Render a landscape view header.
 */
function LandscapeHeader() {
  const context = useContext(AppContext);

  const colorValues = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerTitle}>
        <Text style={[TextStyles.textBold, {
          color: colorValues.primary,
          fontSize: 50,
        }]}
        >
          session

        </Text>
        <Text style={[TextStyles.textBold, {
          color: colorValues.gray4,
        }]}
        >
          an app designed to help you focus.

        </Text>
      </View>
      <View style={styles.buttonContainer}>
        {/* <HeaderButton
          iconName="logo-github"
          onPress={() => Linking.openURL('https://github.com/unnameduser95/session')}
        /> */}
        <HeaderButton
          iconName="settings-outline"
          onPress={() => context.setOverlay('settings')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  headerTitle: {
    flexDirection: 'row',
    width: 350,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: 70,
    alignItems: 'center',
  },
});

export default LandscapeHeader;