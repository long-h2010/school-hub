import { UserDisplay } from '@/components/molecules';
import { formatDate } from '@/lib/utils';
import { DeleteButton, useTable } from '@refinedev/antd';
import { Image, Space, Table } from 'antd';
import { useState } from 'react';

export const PostList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { tableProps } = useTable();
  console.log(tableProps);

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
        title='AUTHOR'
        dataIndex={'author'}
        render={(value) => (
          <UserDisplay name={value.name} avatar={value.avatar} />
        )}
      />
      <Table.Column title='CONTENT' dataIndex={'content'} />
      <Table.Column
        title='IMAGES'
        dataIndex={'images'}
        render={(value: string[]) =>
          value.map((img) => <Image src={img} width={40} />)
        }
      />
      <Table.Column
        title='LIKES'
        dataIndex={'likes'}
        render={(value) => value.length}
      />
      <Table.Column title='COMMENTS' dataIndex={'comments'} />
      <Table.Column
        title='POSTED AT'
        dataIndex={'createdAt'}
        render={(value) => formatDate(value)}
      />
      <Table.Column
        align='center'
        render={(_, record) => (
          <Space>
            <DeleteButton hideText size='small' recordItemId={record.id} />
          </Space>
        )}
      />
    </Table>
  );
};
