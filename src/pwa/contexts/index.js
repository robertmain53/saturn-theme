import memoize from 'lodash/memoize';

export const home = memoize(menu => {
  const columns = menu.filter(({ type }) => type !== 'link').map(list => {
    const id = list.type === 'latest' ? 'post' : parseInt(list[list.type], 10);

    if (['page'].includes(list.type)) {
      return [
        {
          type: list.type,
          id,
        },
      ];
    }

    return [
      {
        type: list.type,
        id,
        page: 1,
      },
    ];
  });

  return {
    columns,
    infinite: false,
    options: {
      bar: 'list',
    },
  };
});

export const single = memoize(
  (list = [{ type: 'latest', id: 'post', page: 1, extract: 'horizontal' }]) => ({
    columns: [list],
    options: {
      bar: 'single',
    },
  }),
);

export const media = memoize(medias => ({
  columns: medias.map(id => ({ type: 'media', id })),
  infinite: false,
  options: {
    bar: 'media',
  },
}));
