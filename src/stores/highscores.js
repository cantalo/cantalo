import { openDB } from 'idb';
import { writable, get as getStore } from 'svelte/store';

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
      async update(key, playerName)
      {
        const entry = getStore(this).find(it => it.id === key);
        entry.playerName = playerName;

        const db = await dbPromise;
        await db.put(dbStoreName, entry);

        set(await db.getAllFromIndex(dbStoreName, 'songId', songId));
      }
    });
  }

  return storeMap.get(songId);
}