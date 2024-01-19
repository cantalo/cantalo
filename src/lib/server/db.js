import { Client, fql } from 'fauna';

const client = new Client();

export async function getSongs() {
  // TODO implement pagination (infinite scroll? refactor song browser?)
  const document_query = fql `songs.all().map(.meta).paginate(16000)`;
  const document_result = await client.query(document_query);

  return document_result.data.data;
}

export async function getSong(id) {
  const document_query = fql `songs.byVid(${id}).first()`;
  const document_result = await client.query(document_query);
  const { meta, lines } = document_result.data;

  return { meta, lines };
}