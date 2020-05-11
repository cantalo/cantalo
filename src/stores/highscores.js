import { openDB } from 'idb';
import { writable } from 'svelte/store';

const dbStoreName = 'highscores';
const storeMap = new Map();

function init()
{
  if (process.browser)
  {
    return openDB('cantalo', 1,
    {
      upgrade(upgradeDb)
      {
        if (!upgradeDb.objectStoreNames.contains(dbStoreName))
        {
          const highScoresStore = upgradeDb.createObjectStore(dbStoreName, { keyPath: 'id', autoIncrement: true });
          highScoresStore.createIndex('songId', 'songId', { unique: false });
        }
      }
    });
  }

  return new Promise(() => {});
}

const dbPromise = init();

export function getHighScoreStore(songId)
{
  if (!storeMap.has(songId))
  {
    const { set, subscribe } = writable([], () =>
    {
      dbPromise
        .then(db => db.getAllFromIndex(dbStoreName, 'songId', songId))
        .then(set)
      ;

      return () =>
      {
        storeMap.delete(songId);
      };
    });

    storeMap.set(songId,
    {
      subscribe,
      async add(data)
      {
        // TODO prevent duplicate entries
        const db = await dbPromise;
        const newKey = await db.add(dbStoreName,
        {
          songId,
          created: Date.now(),
          ...data,
        });

        set(await db.getAllFromIndex(dbStoreName, 'songId', songId));

        return newKey;
      },
    });
  }

  return storeMap.get(songId);
}