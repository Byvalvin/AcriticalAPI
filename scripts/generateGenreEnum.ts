const fs = require('fs');
const path = require('path');

const sourcePath = path.resolve(__dirname, '../src/GQL/typeDefs.ts'); // adjust if needed
const outputPath = path.resolve(__dirname, '../src/enums/Genre.ts');

const raw = fs.readFileSync(sourcePath, 'utf-8');

// Extract the gql string
const gqlMatch = raw.match(/gql`([\s\S]*?)`;/);
if (!gqlMatch) {
  console.error('❌ Could not find gql template literal in typeDefs.ts');
  process.exit(1);
}

const schema = gqlMatch?.[1];
if (!schema) {
  console.error('❌ Could not extract schema from gqlMatch');
  process.exit(1);
}


// Extract the enum block
const enumName = 'Genre';
const enumRegex = new RegExp(`enum ${enumName} {([\\s\\S]*?)}`, 'm');
const enumMatch = schema.match(enumRegex);
if (!enumMatch || !enumMatch[1]) {
  console.error(`❌ Enum ${enumName} not found in schema`);
  process.exit(1);
}


const enumBody = enumMatch[1]
  .split('\n')
  .map((line: string) => line.trim())
  .filter((line: string) => line && !line.startsWith('//'))
  .filter((line: string) => line && !line.startsWith('#'));

const tsEnum = `export enum ${enumName} {\n` +
  enumBody.map((v: string) => `  ${v} = "${v}"`).join(',\n') +
  `\n}\n`;

// Ensure the output directory exists
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

fs.writeFileSync(outputPath, tsEnum, 'utf-8');
console.log(`✅ TypeScript enum written to ${outputPath}`);