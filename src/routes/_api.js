import { join } from 'path';
import { promises as fsAsync } from 'fs';

export default async function(file)
{
  const content = await fsAsync.readFile(join(__dirname, '../../../../importer/dist/', file));
  return content.toString();
}