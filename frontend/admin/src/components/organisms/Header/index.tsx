import {
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Space, Button, Layout, Breadcrumb, theme } from 'antd';
import { themeStore } from '@/stores';
import { useBreadcrumb } from '@refinedev/core';

export const Header = () => {
  const { mode, setMode } = themeStore();
  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();
  const { breadcrumbs } = useBreadcrumb();

  return (
    <Layout.Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: colorBgContainer,
        color: colorText,
      }}
    >
      <Space>
        <Breadcrumb
          items={breadcrumbs.map((item) => ({
            title: (
              <div className='flex items-center gap-1 capitalize'>
                {item.icon} {item.label}
              </div>
            ),
            href: item.href,
          }))}
        />
      </Space>
      <Space
        direction='vertical'
        align='end'
        style={{
          padding: '1rem',
        }}
      >
        <Button
          onClick={() => {
            setMode(mode === 'light' ? 'dark' : 'light');
          }}
          icon={mode === 'light' ? <MoonOutlined /> : <SunOutlined />}
        />
      </Space>
    </Layout.Header>
  );
};
