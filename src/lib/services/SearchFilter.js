const debug = 0;

function betaFilter({ items, query })
{
  const index = query.indexOf('beta:');

  if (~index)
  {
    query.splice(index, 1);
    items = items.filter(it => !!it.beta);
  }
  else
  {
    items = items.filter(it => !it.beta);
  }

  debug && console.debug('betaFilter', { items, query });

  return { items, query };
}

function languageFilter({ items, query })
{
  const index = query.findIndex(it => /^lang(uage)?:[a-z]{2}/.test(it))

  if (~index)
  {
    const [ , lang] = query[index].split(':');
    query.splice(index, 1);
    items = items.filter(it => it.language === lang.toLowerCase());
  }

  debug && console.debug('languageFilter', { items, query });

  return { items, query };
}

function yearFilter({ items, query })
{
  const index = query.findIndex(it => /^year:([0-9]{4}|[0-9]0)/.test(it))

  if (~index)
  {
    const [ , year] = query[index].split(':');
    query.splice(index, 1);

    items = items.filter(it =>
      it.year && (year.length > 2 ?
        it.year === parseInt(year) :
        it.year.toString().charAt(2) === year.charAt(0)
      )
    );
  }

  debug && console.debug('yearFilter', { items, query });

  return { items, query };
}

function genreFilter({ items, query })
{
  const index = query.findIndex(it => /^genre:.+/.test(it))

  if (~index)
  {
    const [ , genre] = query[index].split(':');
    query.splice(index, 1);
    items = items.filter(it => it.genre && it.genre.toLowerCase().includes(genre));
  }

  debug && console.debug('genreFilter', { items, query });

  return { items, query };
}

function titleAndArtistFilter({ items, query })
{
  for (let index = query.length - 1; index >= 0; index--)
  {
    const term = query[index];
    const predicate = it => it.title.toLowerCase().includes(term) || it.artist.toLowerCase().includes(term);

    if (items.some(predicate))
    {
      query.splice(index, 1);
      items = items.filter(predicate);
    }
  }

  debug && console.debug('titleAndArtistFilter', { items, query });

  return { items, query };
}

export default function searchFilter(collection, query)
{
  const filterPlugins = [betaFilter, languageFilter, yearFilter, genreFilter, titleAndArtistFilter];

  if (query.trim().length === 0)
  {
    return collection.filter(it => !it.beta);
  }

  const result = filterPlugins.reduce(
    (result, currentFilter, i, arr) =>
    {
      if (result.query.length === 0)
      {
        arr.splice(i);
        return result;
      }

      return currentFilter(result);
    },
    {
      items: collection,
      query: query
        .toLowerCase()
        .split(' ')
        .filter(it => !!it),
    },
  );

  if (result.query.length > 0)
  {
    return [];
  }

  return result.items;
}