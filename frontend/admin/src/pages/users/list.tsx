import { UserDisplay } from '@/components/molecules';
import { formatDateWithNoTime } from '@/lib/utils';
import {
  MinusCircleOutlined,
  SearchOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { ShowButton, useTable } from '@refinedev/antd';
import { useInvalidate, useUpdate } from '@refinedev/core';
import { Button, Card, Input, Select, Space, Table, Tag, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

export const UserList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const invalidate = useInvalidate();

  const { tableProps, setFilters } = useTable({
    syncWithLocation: true,
  });
  const { mutate: updateUser } = useUpdate();

  useEffect(() => {
    clearTimeout(debounceRef.current ?? undefined);
    debounceRef.current = setTimeout(() => {
      applyFilters(searchText, statusFilter);
    }, 300);

    return () => clearTimeout(debounceRef.current ?? undefined);
  }, [searchText]);

  const applyFilters = (search: string, status?: string) => {
    const filters: any[] = [];

    if (search.trim()) {
      filters.push({
        operator: 'or',
        value: [
          { field: 'name', operator: 'contains', value: search },
          { field: 'email', operator: 'contains', value: search },
          { field: 'username', operator: 'contains', value: search },
        ],
      });
    }

    if (status) {
      filters.push({ field: 'status', operator: 'eq', value: status });
    }

    setFilters(filters, 'replace');
  };

  const handleStatusChange = (value: string | undefined) => {
    setStatusFilter(value);
    applyFilters(searchText, value);
  };

  const handleClear = () => {
    setSearchText('');
    setStatusFilter(undefined);
    setFilters([], 'replace');
  };

  const handleToggleBan = (record: any) => {
    updateUser(
      {
        id: record.id,
        values: {
          status: record.status === 'banned' ? 'active' : 'banned',
        },
        resource: import.meta.env.VITE_APP_USERS_ENDPOINT,
      },
      {
        onSuccess: () =>
          invalidate({ resource: 'users', invalidates: ['list'] }),
      },
    );
  };

  const hasActiveFilters = searchText || statusFilter;

  return (
    <div className='flex flex-col gap-5'>
      <Card>
        <div className='flex gap-3 flex-wrap items-center'>
          <Input
            prefix={<SearchOutlined />}
            className='!max-w-[300px]'
            placeholder='Name, email, username...'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Select
            className='w-[180px]'
            placeholder='Status'
            value={statusFilter}
            onChange={handleStatusChange}
            allowClear
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Banned', value: 'banned' },
              { label: 'Inactive', value: 'inactive' },
            ]}
          />
          {hasActiveFilters && (
            <Button onClick={handleClear}>Remove filter</Button>
          )}
        </div>
      </Card>
      <Table
        {...tableProps}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
        rowKey={'id'}
      >
        <Table.Column
          title='USER'
          render={(_, record) => (
            <UserDisplay name={record.name} avatar={record.avatar} />
          )}
        />
        <Table.Column
          title='EMAIL | USERNAME'
          render={(_, record) => (
            <span className='text-gray-500'>
              {record.email || record.username}
            </span>
          )}
        />
        <Table.Column
          title='STATUS'
          dataIndex={'status'}
          className='capitalize'
          render={(value) => (
            <Tag
              color={
                value == 'active'
                  ? 'success'
                  : value == 'banned'
                  ? 'error'
                  : 'warning'
              }
            >
              {value}
            </Tag>
          )}
        />
        <Table.Column
          title={'JOINED'}
          dataIndex={'createdAt'}
          render={(value) => formatDateWithNoTime(value)}
        />
        <Table.Column
          render={(_, record) => (
            <Space>
              <ShowButton hideText size='small' recordItemId={record.id} />
              {record.status !== 'banned' ? (
                <Tooltip title='Ban user'>
                  <Button
                    icon={<StopOutlined />}
                    size='small'
                    danger
                    onClick={() => handleToggleBan(record)}
                  />
                </Tooltip>
              ) : (
                <Tooltip title='Unban'>
                  <Button
                    icon={<MinusCircleOutlined />}
                    size='small'
                    style={{ color: 'green', borderColor: 'green' }}
                    onClick={() => handleToggleBan(record)}
                  />
                </Tooltip>
              )}
            </Space>
          )}
        />
      </Table>
    </div>
  );
};
