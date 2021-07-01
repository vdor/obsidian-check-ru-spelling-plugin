import { DictrionaryResult } from "src/types/dictionary";

async function loadFile(uri: string): Promise<Buffer> {
  const res = await fetch(uri);
  const aBuf = await res.arrayBuffer();
  return Buffer.from(aBuf);
}

export default async function load(affUri: string, dicUri: string): Promise<DictrionaryResult> {
  const [aff, dic] = await Promise.all([loadFile(affUri), loadFile(dicUri)]);

  const result: DictrionaryResult = {
    aff,
    dic,
  };
  return result;
}
