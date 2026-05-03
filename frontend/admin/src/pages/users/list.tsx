import { UserDisplay } from '@/components/molecules';
import { formatDateWithNoTime } from '@/lib/utils';
import { MinusCircleOutlined, StopOutlined } from '@ant-design/icons';
import { ShowButton, useTable } from '@refinedev/antd';
import { Button, Space, Table, Tag, Tooltip } from 'antd';
import { useState } from 'react';

export const UserList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { tableProps } = useTable();

  return (
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
                <Button icon={<StopOutlined />} size='small' danger />
              </Tooltip>
            ) : (
              <Tooltip title='Unban'>
                <Button icon={<MinusCircleOutlined />} size='small' danger />
              </Tooltip>
            )}
          </Space>
        )}
      />
    </Table>
  );
};
