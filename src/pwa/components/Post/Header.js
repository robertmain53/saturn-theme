import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import styled from 'react-emotion';
import fecha from 'fecha';
import readingTime from 'reading-time';
import IconClock from 'react-icons/lib/md/access-time';
import IconShare from 'react-icons/lib/md/share';
import * as actions from '../../actions';
import * as selectorCreators from '../../selectorCreators';

class Header extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired,
    totalCounts: PropTypes.number.isRequired,
    shareReady: PropTypes.bool.isRequired,
    shareModalOpeningRequested: PropTypes.func.isRequired,
    allShareCountRequested: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired
  };

  constructor() {
    super();

    this.handleModalOpening = this.handleModalOpening.bind(this);
  }

  componentDidMount() {
    const { active, allShareCountRequested, id, shareReady } = this.props;

    if (!shareReady && active) {
      setTimeout(() => allShareCountRequested({ id, wpType: 'posts' }), 500);
    }
  }

  componentDidUpdate(prevProps) {
    const { active, allShareCountRequested, id, shareReady } = this.props;

    if (!shareReady && active && !prevProps.active) {
      setTimeout(() => allShareCountRequested({ id, wpType: 'posts' }), 500);
    }
  }

  handleModalOpening() {
    return this.props.shareModalOpeningRequested({ id: this.props.id, wpType: 'posts' });
  }

  render() {
    const { title, author, date, time, totalCounts, shareReady, active } = this.props;
    return (
      <PostTitle>
        {active ? (
          <ActiveTitle dangerouslySetInnerHTML={{ __html: title }} />
        ) : (
          <InactiveTitle dangerouslySetInnerHTML={{ __html: title }} />
        )}
        <InnerContainer>
          <Author>{author}</Author>
          <StyledDate>{date}</StyledDate>
        </InnerContainer>
        <InnerContainer>
          <TotalShares isTotalReady={shareReady} onClick={this.handleModalOpening}>
            <IconShare size={18} />
            <TotalSharesText>{`${totalCounts} compartidos`}</TotalSharesText>
          </TotalShares>
          <ReadingTime>
            <IconClock size={18} />
            {time ? <ReadingTimeText>{`${time} minutos`}</ReadingTimeText> : null}
          </ReadingTime>
        </InnerContainer>
      </PostTitle>
    );
  }
}

const mapStateToProps = (state, { id }) => ({
  totalCounts: selectorCreators.share.getTotalCounts(id)(state),
  shareReady: selectorCreators.share.areCountsReady(id)(state)
});

const mapDispatchToProps = dispatch => ({
  shareModalOpeningRequested: payload => dispatch(actions.share.openingRequested(payload)),
  allShareCountRequested: payload => dispatch(actions.share.allShareCountRequested(payload))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  inject(({ connection }, { id }) => ({
    title: connection.single.post[id].title,
    author: connection.single.post[id].author.name,
    date: fecha.format(new Date(connection.single.post[id].creationDate), 'DD.MM.YYYY - HH:mm[h]'),
    time: Math.round(readingTime(connection.single.post[id].content).minutes)
  }))
)(Header);

const PostTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: top;
`;

// There are two titles because of SEO (No more than one <h1> per page).

const ActiveTitle = styled.h1`
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  margin-bottom: 10px;
  padding: 20px 15px;
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 1.8rem;
  line-height: 2.2rem;
  border-bottom: 1px solid #eee;
`;

const InactiveTitle = styled.h2`
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  margin-bottom: 10px;
  padding: 20px 15px;
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 1.8rem;
  line-height: 2.2rem;
  border-bottom: 1px solid #ddd;
`;

const Author = styled.a`
  font-weight: 300;
  padding: 5px 15px;
  color: ${({ theme }) => theme.postGrey};
  margin: 0;
  font-size: 0.9rem;
  text-transform: uppercase;
`;

const StyledDate = styled.p`
  font-weight: 300;
  margin: 0;
  padding: 5px 15px;
  color: ${({ theme }) => theme.postGrey};
  font-size: 0.9rem;
  text-align: right;
`;

const ReadingTime = styled.p`
  margin: 0;
  padding: 5px 15px;
  color: ${({ theme }) => theme.postGrey};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
`;

const ReadingTimeText = styled.span`
  font-weight: 300;
  font-size: 0.9rem;
  padding-left: 5px;
`;

const TotalShares = styled.p`
  margin: 0;
  padding: 5px 15px;
  color: ${({ theme }) => theme.postGrey};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  transition: opacity 0.3s;
  opacity: ${({ isTotalReady }) => (isTotalReady ? 1 : 0)};
`;

const TotalSharesText = styled.span`
  font-weight: 300;
  font-size: 0.9rem;
  padding-left: 5px;
`;
