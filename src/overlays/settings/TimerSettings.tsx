import React from 'react';
import { ScrollView, Text } from 'react-native';
import useTheme from '../../helpers/useTheme';
import TextStyles from '../../styles/Text';

/**
 * Timer settings content in the settings overlay.
 */
function TimerSettingsPane() {
  const colors = useTheme();

  return (
    <ScrollView>
      <Text style={[TextStyles.textRegular, {
        color: colors.primary,
      }]}
      >
        Timer settings (coming soon)

      </Text>
    </ScrollView>
  );
}

export default TimerSettingsPane;
