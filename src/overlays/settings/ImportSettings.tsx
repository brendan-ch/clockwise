import React, { useContext, useEffect, useState } from 'react';
import { SectionList } from 'react-native';
import AppContext from '../../../AppContext';
// import AppContext from '../../../AppContext';
import SettingsOption from '../../components/SettingsOption';
import { exportData, importData } from '../../helpers/dataManagement';
import useKeyboardSelect from '../../helpers/hooks/useKeyboardSelect';
import useTheme from '../../helpers/hooks/useTheme';
import useWindowSize from '../../helpers/hooks/useWindowSize';
import renderHeader from '../../helpers/renderers/renderHeader';
import { Section, SettingsOptionProps } from '../../types';

const options: SettingsOptionProps[] = [
  {
    title: 'Include task data',
    type: 'toggle',
    value: false,
    subtitle: 'If selected, task data will be included in the export file.',
  },
  {
    title: 'Export settings',
    type: 'icon',
    value: 'chevron-forward-outline',
  },
  {
    title: 'Overwrite task data',
    type: 'toggle',
    value: false,
    subtitle: 'WARNING: If selected, existing task data will be lost.',
  },
  {
    title: 'Import settings',
    type: 'icon',
    value: 'chevron-forward-outline',
    subtitle: 'Only import files that you trust.',
  },
];

const sections: Section[] = [
  {
    title: 'Export',
    icon: 'exit-outline',
    data: options.slice(0, 2),
  },
  {
    title: 'Import',
    icon: 'enter-outline',
    data: options.slice(2, 4),
  },
];

/**
 * Component that lets users view the available keybindings.
 */
function ImportSettingsPane() {
  const colors = useTheme();

  const [includeTaskData, setIncludeTaskData] = useState(false);
  const [overwriteTasks, setOverwriteTasks] = useState(false);

  const [importError, setImportError] = useState<string | undefined>();

  const windowSize = useWindowSize();

  // Name of the storage key selected out of options
  // Note that storage key is only used as an identifier in this case
  const {
    keyboardShortcutManager,
    keyboardGroup,
  } = useContext(AppContext);
  const { keyboardSelected, setKeyboardSelected } = useKeyboardSelect(
    keyboardGroup,
    options,
    'title',
  );

  function handlePress(item: SettingsOptionProps) {
    if (item.title === 'Include task data') {
      setIncludeTaskData(!includeTaskData);
    } else if (item.title === 'Overwrite task data') {
      setOverwriteTasks(!overwriteTasks);
    } else if (item.title === 'Export settings') {
      exportData(includeTaskData);
    } else if (item.title === 'Import settings') {
      importData(overwriteTasks)
        .catch(() => {
          // Set import error
          setImportError('Invalid config.');
        });
    }
  }

  useEffect(() => {
    if (keyboardGroup === 'settingsPage' && !keyboardSelected) {
      setKeyboardSelected(options[0].title);
    } else if (keyboardGroup === 'settings') {
      setKeyboardSelected(undefined);
    }
  }, [keyboardShortcutManager, keyboardGroup]);

  const renderItem = ({ item }: { item: SettingsOptionProps }) => {
    let { value } = item;
    if (item.title === 'Include task data') {
      value = includeTaskData;
    } else if (item.title === 'Overwrite task data') {
      value = overwriteTasks;
    }

    return (
      <SettingsOption
        /* eslint-disable react/jsx-props-no-spreading */
        {...item}
        subtitle={item.title === 'Import settings' ? importError : item.subtitle}
        value={value}
        onPress={() => handlePress(item)}
        onSelect={() => handlePress(item)}
        onChange={() => handlePress(item)}
        keyboardSelected={keyboardSelected === item.title}
        indicator={keyboardSelected === item.title ? '↑↓' : undefined}
      />
    );
  };

  return (
    <SectionList
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.title!}
      sections={sections}
      renderSectionHeader={renderHeader}
      renderItem={renderItem}
      style={{
        backgroundColor: colors.background,
        padding: windowSize === 'portrait' ? 10 : 0,
      }}
    />
  );
}

export default ImportSettingsPane;
