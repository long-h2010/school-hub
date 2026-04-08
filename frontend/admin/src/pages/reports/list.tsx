import { UserDisplay } from '@/components/molecules';
import { ReportReason, ReportStatus } from '@/types';
import {
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from '@refinedev/antd';
import { Button, Card, Select, Space, Table, Tag } from 'antd';
import { useState } from 'react';

const reasonOptions = [
  { label: 'All', value: '' },
  { label: 'Invalid', value: ReportReason.INVALID },
  { label: 'Toxic language', value: ReportReason.TOXIC },
  { label: 'Spam', value: ReportReason.SPAM },
  { label: 'Misinfomation', value: ReportReason.MISINFORMATION },
  { label: 'NSFW', value: ReportReason.NSFW },
  { label: 'Violence', value: ReportReason.VIOLENCE },
  { label: 'Hate speech', value: ReportReason.HATE_SPEECH },
  { label: 'Scam', value: ReportReason.SCAM },
  { label: 'Sexual', value: ReportReason.SEXUAL },
];

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Pending', value: ReportStatus.PENDING },
  { label: 'Dismissed', value: ReportStatus.DISMISSED },
  { label: 'Processed', value: ReportStatus.PROCESSED },
];

export const ReportList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [reasonFilter, setReasonFilter] = useState<ReportReason | undefined>(
    undefined,
  );
  const [statusFilter, setStatusFilter] = useState<ReportStatus | undefined>(
    undefined,
  );

  const { tableProps, setFilters } = useTable({
    filters: {
      permanent: [],
    },
    syncWithLocation: false,
  });

  const handleReasonChange = (value: ReportReason | undefined) => {
    setReasonFilter(value);

    if (value) {
      setFilters([{ field: 'reason', operator: 'eq', value }], 'replace');
    } else {
      setFilters([], 'replace');
    }
  };

  const handleStatusChange = (value: ReportStatus | undefined) => {
    setStatusFilter(value);

    if (value) {
      setFilters([{ field: 'status', operator: 'eq', value }], 'replace');
    } else {
      setFilters([], 'replace');
    }
  };

  return (
    <div className='flex flex-col gap-10'>
      <Card>
        <div className='flex justify-between'>
          <div className='flex gap-10'>
            <div className='flex items-center gap-3'>
              <span className='uppercase text-xs'>Reason: </span>
              <Select
                placeholder='Reason'
                options={reasonOptions}
                value={reasonFilter}
                onChange={handleReasonChange}
                className='min-w-[140px]'
              />
            </div>
            <div className='flex items-center gap-3'>
              <span className='uppercase text-xs'>Status: </span>
              <Select
                placeholder='Status'
                options={statusOptions}
                value={statusFilter}
                onChange={handleStatusChange}
                className='min-w-[120px]'
              />
            </div>
          </div>
          <Button>AI review</Button>
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
          dataIndex={['post', 'author']}
          title='AUTHOR'
          render={(value) => (
            <UserDisplay name={value.name} avatar={value.avatar} />
          )}
        />
        <Table.Column dataIndex={['post', 'content']} title='CONTENT' />
        <Table.Column
          dataIndex={'reason'}
          title='REASON'
          render={(values: ReportReason[]) =>
            values.map((value: ReportReason) => (
              <Tag className='capitalize'>{value}</Tag>
            ))
          }
        />
        <Table.Column
          dataIndex={'status'}
          title='STATUS'
          render={(value: ReportStatus) => (
            <Tag
              color={
                value == 'processed'
                  ? 'success'
                  : value == 'dismissed'
                  ? 'error'
                  : 'warning'
              }
              className='capitalize'
            >
              {value}
            </Tag>
          )}
        />
        <Table.Column
          render={(_, record) => (
            <Space>
              <EditButton hideText size='small' recordItemId={record.id} />
              <ShowButton hideText size='small' recordItemId={record.id} />
              <DeleteButton hideText size='small' recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </div>
  );
};
