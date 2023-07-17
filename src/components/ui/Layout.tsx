import { ReactNode } from 'react';
import { styled } from 'styled-components';

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <LayoutContainer>{children}</LayoutContainer>;
};

export default Layout;

const LayoutContainer = styled.div`
position: relative;
top: 80px;
`;
