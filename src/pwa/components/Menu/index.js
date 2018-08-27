import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import styled from 'react-emotion';
import MenuHeader from './MenuHeader';
import MenuList from './MenuList';

const Menu = ({ isOpen, close }) => (
  <Fragment>
    <Overlay isOpen={isOpen} onClick={close} onTouchMove={close} />
    <Container isOpen={isOpen}>
      <MenuHeader />
      <MenuList />
    </Container>
  </Fragment>
);

Menu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default inject(({ stores: { theme } }) => ({
  isOpen: theme.menu.isOpen,
  close: theme.menu.close,
}))(Menu);

const Overlay = styled.div`
  position: fixed;
  width: 100vw;
  height: 100%;
  transform: ${({ isOpen }) =>
    isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  filter: ${({ isOpen }) => (isOpen ? 'opacity(50%)' : 'opacity(0%)')};
  transition: filter 150ms ease-out,
    ${({ isOpen }) => (isOpen ? 'transform 0ms' : 'transform 0ms ease 150ms')};
  background-color: #000;
  z-index: 150;
  will-change: transform;
`;

const Container = styled.div`
  position: fixed;
  transform: ${({ isOpen }) =>
    isOpen ? 'translateX(0%)' : 'translateX(-100%)'};
  transition: transform 150ms ease-out;
  width: 75vw;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  z-index: 151;
  will-change: transform;
`;
