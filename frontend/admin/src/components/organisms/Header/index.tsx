import {
  ArrowLeftOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Space, Button, Layout, Divider, Breadcrumb, theme } from 'antd';
import { themeStore } from '@/stores';
import { Link, useLocation } from 'react-router';

export const Header = () => {
  const { mode, setMode } = themeStore();
  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();
  const location = useLocation();

  const path = location.pathname.split('/').filter(Boolean) ?? ['home'];

  const breadcrumbItems = path.map((_, index) => {
    const url = '/' + path.slice(0, index + 1).join('/');

    return {
      title: <Link to={url}>{url}</Link>,
    };
  });

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
        <Button
          type='text'
          icon={<ArrowLeftOutlined />}
          style={{ color: '#888' }}
        >
          Back
        </Button>
        <Divider type='vertical' />
        <Breadcrumb items={[{ title: '' }, { title: '' }]} />
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
