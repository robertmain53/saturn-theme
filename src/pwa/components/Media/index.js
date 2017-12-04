import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazy-load';
import IconImage from 'react-icons/lib/fa/image';
import styled from 'react-emotion';
import { dep } from 'worona-deps';

class Media extends React.Component {
  static propTypes = {
    ssr: PropTypes.bool.isRequired, // Is server side rendering active
    lazy: PropTypes.bool, // Specifies if image is lazy loaded
    lazyHorizontal: PropTypes.bool, // Applies horizontal offset when lazy loading
    content: PropTypes.bool, // Indicates that Media will be rendered inside Content
    width: PropTypes.string, // CSS values
    height: PropTypes.string, // CSS values
    alt: PropTypes.string, // Alt from HtmlToReactConverter or getAlt selector.
    src: PropTypes.string, // Src from HtmlToReactConverter or getSrc selector.
    srcSet: PropTypes.string, // SrcSet from HtmlToReactConverter or getSrcSet selector.
    ready: PropTypes.bool, // Indicates if the image is ready
  };

  static defaultProps = {
    width: 'auto',
    height: 'auto',
    lazy: false,
    lazyHorizontal: false,
    content: false,
    ready: true,
    alt: '',
    src: '',
    srcSet: '',
  };

  shouldComponentUpdate(nextProps) {
    // Ignores re-render when server side rendering was active but not anymore.
    if (this.props.ssr && !nextProps.ssr) return false;
    return true;
  }

  render() {
    const { alt, width, height, lazy, lazyHorizontal, content, ssr, src, srcSet } = this.props;

    const offsets = {
      offsetVertical: 500,
      offsetHorizontal: lazyHorizontal ? 500 : 0,
    };

    return (
      // content.toString()  => Avoids a warning from emotion.
      <Container content={content.toString()} height={height} width={width}>
        <Icon>
          <IconImage size={40} />
        </Icon>
        {src &&
          (lazy && !ssr ? (
            <StyledLazyLoad {...offsets} throttle={50}>
              <Img alt={alt} sizes={`${parseInt(width, 10)}vw`} src={src} srcSet={srcSet} />
            </StyledLazyLoad>
          ) : (
            <Img alt={alt} sizes={`${parseInt(width, 10)}vw`} src={src} srcSet={srcSet} />
          ))}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  ssr: dep('build', 'selectors', 'getSsr')(state),
});

export default connect(mapStateToProps)(
  inject((stores, { id, lazy, lazyHorizontal, content }) => {
    if (content) return {};

    const media = stores.connection.single.media[id];

    return {
      lazy: !!lazy,
      lazyHorizontal: !!lazyHorizontal,
      content: !!content,
      alt: media.alt,
      src: media.original && media.original.url,
      srcSet:
        media.sizes &&
        media.sizes
          .reduce((result, current) => {
            if (!result.find(item => item.width === current.width)) result.push(current);
            return result;
          }, [])
          .map(item => `${item.url} ${item.width}w`)
          .join(', '),
    };
  })(Media),
);

const Container = styled.div`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  position: relative;
  margin: ${({ content }) => (content === 'true' ? '15px 0' : '')};
`;

const Icon = styled.div`
  position: absolute;
  top: 0;
  color: #bdbdbd;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Img = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  background-color: transparent;
  color: transparent;
  border: none !important;
`;

const StyledLazyLoad = styled(LazyLoad)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  background-color: transparent;
  color: transparent;
  border: none !important;
`;
