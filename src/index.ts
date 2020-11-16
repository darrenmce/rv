import { TCXParser } from './lib/TCXParser';
import path from 'path';
// import * as fs from 'fs';

async function main() {
  const testTcx = await TCXParser.createFromFilePath(path.resolve(__dirname, '..', 'test_data', '3629706178.tcx'));

  // fs.writeFileSync('test.json', JSON.stringify(testTcx.xmlData));
  console.log(testTcx.getActivity());
}

main();
