import React, { useContext, useEffect, useState } from 'react';
import { Platform, SectionList, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import AppContext from '../../../AppContext';
import SettingsContext from '../../../SettingsContext';
import TaskContext from '../../../TaskContext';
import SettingsOption from '../../components/SettingsOption';
import { exportData, importData } from '../../helpers/dataManagement';
import useKeyboardSelect from '../../helpers/hooks/useKeyboardSelect';
import useTheme from '../../helpers/hooks/useTheme';
import useWindowSize from '../../helpers/hooks/useWindowSize';
import renderHeader from '../../helpers/renderers/renderHeader';
import { getData } from '../../helpers/storage';
import { TASKS } from '../../StorageKeys';
import { DefaultSettingsState, Section, SettingsOptionProps } from '../../types';

/**
 * Component that lets users view the available keybindings.
 */
function ImportSettingsPane() {
  const colors = useTheme();

  const [includeTaskData, setIncludeTaskData] = useState(false);
  const [overwriteTasks, setOverwriteTasks] = useState(false);

  const [importError, setImportError] = useState<string | undefined>('Only import files that you trust.');
  const [importSuccessful, setImportSuccessful] = useState(false);

  const windowSize = useWindowSize();

  const settings = useContext(SettingsContext);
  const {
    setTasks,
    tasks,
  } = useContext(TaskContext);

  const options: SettingsOptionProps[] = [
    {
      title: 'Include task data',
      type: 'toggle',
      value: false,
      subtitle: `${tasks.length} tasks will be exported.`,
    },
    {
      title: 'Export settings',
      type: 'icon',
      value: Platform.OS === 'web' ? 'download-outline' : 'share-outline',
    },
    {
      title: 'Overwrite task data',
      type: 'toggle',
      value: false,
      subtitle: 'WARNING: Existing tasks will be lost.',
    },
    {
      title: 'Import settings',
      type: 'icon',
      value: importSuccessful ? 'checkmark-outline' : 'chevron-forward-outline',
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
        .then(() => updateReactiveSettings())
        .then(() => {
          setImportSuccessful(true);
          setImportError('Data imported successfully.');
        })
        .catch((e) => {
          // Set import error
          if (e.message !== 'User canceled file selection.') {
            setImportError(e.message);
          }
        });
    }
  }

  /**
   * Update reactive settings and tasks from storage.
   */
  async function updateReactiveSettings() {
    const temp: DefaultSettingsState = {
      ...settings,
    };
    delete temp.setSetting;
    delete temp.setSettings;

    await Promise.all(Object.keys(settings).map(async (key) => {
      // Load the data
      const data = await getData(key);
      if (!data) return;
      // @ts-ignore
      const type = typeof temp[key];

      if (type === 'number') {
        // Convert the data
        // @ts-ignore
        temp[key] = !Number.isNaN(Number(data)) ? Number(data) : temp[key];
      } else if (type === 'boolean') {
        // @ts-ignore
        temp[key] = data === '1';
      }
    }));

    if (settings.setSettings) {
      settings.setSettings(temp);
    }

    // Update tasks
    const loadedTasks = await getData(TASKS);
    if (!loadedTasks) {
      return;
    }

    try {
      const parsed = JSON.parse(loadedTasks);

      setTasks(parsed);
    } catch (e) {
      setImportError('Error loading task data.');
    }
  }

  useEffect(() => {
    if (importSuccessful) {
      Haptics.impactAsync();

      // Set a timeout to clear import status
      const timeout = setTimeout(() => {
        setImportError('Only import files that you trust.');
        setImportSuccessful(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }

    return () => {};
  }, [importSuccessful]);

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

  return windowSize === 'landscape' ? (
    <SectionList
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.title!}
      sections={sections}
      renderSectionHeader={renderHeader}
      renderItem={renderItem}
      style={{
        backgroundColor: colors.background,
        padding: 0,
      }}
    />
  ) : (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      <SectionList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.title!}
        sections={sections}
        renderSectionHeader={renderHeader}
        renderItem={renderItem}
        style={{
          backgroundColor: colors.background,
          paddingHorizontal: 10,
        }}
      />
    </View>
  );
}

export default ImportSettingsPane;
