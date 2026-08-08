import { collectRadar, writeRadar } from './radar-lib.mjs';

export default async () => {
  const data=await writeRadar(await collectRadar());
  console.log(`Reddit radar refreshed: ${data.items.length} items, ${data.errors.length} source errors`);
};

export const config={schedule:'0 */6 * * *'};
