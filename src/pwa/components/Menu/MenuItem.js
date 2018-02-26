import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dep } from 'worona-deps';
import { Container } from '../../../shared/styled/Menu/MenuItem';
import * as actions from '../../actions';
import { home } from '../../contexts';

const MenuItem = ({ id, type, context, label, active, url, Link, menuHasClosed }) => {
  if (type === 'link') {
    return (
      <Container onClick={menuHasClosed}>
        <a href={url} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      </Container>
    );
  }

  const selected = {};

  if (type !== 'link') {
    if (['latest', 'author', 'tag', 'category'].includes(type)) {
      selected.listType = type;
      selected.listId = id;
    } else {
      selected.singleType = type;
      selected.singleId = id;
    }
  }

  return (
    <Container isActive={active} onClick={menuHasClosed}>
      <Link
        selected={selected}
        context={context}
        event={{
          category: 'Menu',
          action: ['page', 'post'].includes(type) ? 'open single' : 'open list',
        }}
      >
        <a>{label}</a>
      </Link>
    </Container>
  );
};

MenuItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  url: PropTypes.string,
  active: PropTypes.bool.isRequired,
  context: PropTypes.shape({}),
  Link: PropTypes.func.isRequired,
  menuHasClosed: PropTypes.func.isRequired,
};

MenuItem.defaultProps = {
  url: null,
  context: null,
};

const mapStateToProps = state => {
  const menu = dep('settings', 'selectorCreators', 'getSetting')('theme', 'menu')(state);

  return {
    context: home(menu),
    Link: dep('connection', 'components', 'Link'),
  };
};

const mapDispatchToProps = dispatch => ({
  menuHasClosed: () => dispatch(actions.menu.hasClosed()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuItem);
