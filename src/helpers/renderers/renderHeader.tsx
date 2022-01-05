import React from 'react';
import { Section } from '../../types';
import SettingsHeader from '../../components/SettingsHeader';

const renderHeader = ({ section }: { section: Section }) => (
  <SettingsHeader
    title={section.title}
    icon={section.icon}
  />
);

export default renderHeader;
