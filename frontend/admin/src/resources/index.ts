import { ResourceProps } from '@refinedev/core';
import { dashboardResource } from './dashboard';
import { usersResource } from './users';
import { postResource } from './posts';
import { reportResource } from './reports';

export const resources: ResourceProps[] = [
  dashboardResource,
  usersResource,
  postResource,
  reportResource
];
