import React from 'react';
import Gallery from '../components/Gallery';

const getImages = element =>
  element.component === 'img' && element.props.src
    ? [element]
    : (element.children || []).reduce(
        (all, child) => all.concat(getImages(child)),
        [],
      );

const getMediaprops = images =>
  images.map(({ props }) => {
    const { alt, sizes, src, srcset } = props;
    const { 'data-attachment-id': attachmentId } = props;

    const id = parseInt(attachmentId, 10) || null;
    return { id, alt, sizes, src, srcset };
  });

export default {
  test: ({ component, props }) =>
    component === 'div' &&
    props &&
    props.id &&
    /(^|\s)gallery-\d+/.test(props.id),
  process: element => {
    const images = getImages(element);
    const mediaprops = getMediaprops(images);
    return <Gallery mediaprops={mediaprops} />;
  },
};
