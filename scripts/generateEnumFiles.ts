const fs = require('fs');
const path = require('path');

const sourcePath = path.resolve(__dirname, '../src/GQL/typeDefs.ts');
const outputDir = path.resolve(__dirname, '../src/enums');

const raw = fs.readFileSync(sourcePath, 'utf-8');

// Extract the gql string (loosened to avoid semicolon issues)
const gqlMatch = raw.match(/gql`([\s\S]*?)`/);
if (!gqlMatch || !gqlMatch[1]) {
  console.error('❌ Could not extract GraphQL schema from typeDefs.ts');
  process.exit(1);
}

const schema = gqlMatch[1];

// Match all enum blocks
const enumRegex = /enum (\w+)\s*{([\s\S]*?)}/g;
let match;
const enums = [];

while ((match = enumRegex.exec(schema)) !== null) {
  const enumName = match[1];
  const enumBodyRaw = match[2];

  if (!enumBodyRaw) {
    console.warn(`⚠️ Skipping enum ${enumName} due to missing body`);
    continue;
  }

  const enumValues = enumBodyRaw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('//') && !line.startsWith('#'));

  const tsEnum = `export enum ${enumName} {\n` +
    enumValues.map((v) => `  ${v} = "${v}"`).join(',\n') +
    `\n}\n`;

  enums.push({ name: enumName, content: tsEnum });
}
//console.log(enums)
// Write each enum to its own file
fs.mkdirSync(outputDir, { recursive: true });

enums.forEach(({ name, content }) => {
  const filePath = path.join(outputDir, `${name}.ts`);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Enum ${name} written to ${filePath}`);
});