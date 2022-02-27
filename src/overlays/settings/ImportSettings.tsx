import React, { useContext, useEffect, useState } from 'react';
import { SectionList } from 'react-native';
import AppContext from '../../../AppContext';
// import AppContext from '../../../AppContext';
import SettingsOption from '../../components/SettingsOption';
import { exportData } from '../../helpers/dataManagement';
import useKeyboardSelect from '../../helpers/hooks/useKeyboardSelect';
import renderHeader from '../../helpers/renderers/renderHeader';
import { Section, SettingsOptionProps } from '../../types';

const options: SettingsOptionProps[] = [
  {
    title: 'Include task data',
    type: 'toggle',
    value: false,
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
    subtitle: 'WARNING: If selected, this will replace all existing task data.',
  },
  {
    title: 'Import settings',
    type: 'icon',
    value: 'chevron-forward-outline',
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
  const [includeTaskData, setIncludeTaskData] = useState(false);
  const [overwriteTasks, setOverwriteTasks] = useState(false);

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
    />
  );
}

export default ImportSettingsPane;
