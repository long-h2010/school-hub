import { ResourceProps } from '@refinedev/core';
import { WarningOutlined } from '@ant-design/icons';
import { ResourceName } from '@/lib/constants/resource-name';
import React from 'react';

export const reportResource: ResourceProps = {
  name: ResourceName.REPORTS,
  list: `/${ResourceName.REPORTS}`,
  create: `/${ResourceName.REPORTS}/create`,
  edit: `/${ResourceName.REPORTS}/edit/:id`,
  show: `/${ResourceName.REPORTS}/show/:id`,
  meta: {
    label: ResourceName.REPORTS,
    icon: React.createElement(WarningOutlined),
  },
};
