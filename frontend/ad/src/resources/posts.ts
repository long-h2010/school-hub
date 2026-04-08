import { ResourceProps } from '@refinedev/core';
import { UnorderedListOutlined } from '@ant-design/icons';
import { ResourceName } from '@/lib/constants/resource-name';
import React from 'react';

export const postResource: ResourceProps = {
  name: ResourceName.POSTS,
  list: `/${ResourceName.POSTS}`,
  create: `/${ResourceName.POSTS}/create`,
  edit: `/${ResourceName.POSTS}/edit/:id`,
  show: `/${ResourceName.POSTS}/show/:id`,
  meta: {
    label: ResourceName.POSTS,
    icon: React.createElement(UnorderedListOutlined),
  },
};
