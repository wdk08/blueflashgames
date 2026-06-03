import fs from "fs";
import path from "path";

const JSON_FILE = "./people.json";   // rename if needed
const IMAGE_DIR = "./images";

const data = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));
const actualFiles = fs.readdirSync(IMAGE_DIR);

let hasErrors = false;

function checkImage(ref, label) {
  const filename = path.basename(ref);

  if (!actualFiles.includes(filename)) {
    const match = actualFiles.find(
      f => f.toLowerCase() === filename.toLowerCase()
    );

    console.error(`❌ ${label}`);
    console.error(`   Missing: ${ref}`);

    if (match) {
      console.error(`   Did you mean: images/${match}`);
    }

    hasErrors = true;
  }
}

for (const category of Object.keys(data)) {
  const group = data[category];

  for (const name of Object.keys(group)) {
    checkImage(group[name], `${category} → ${name}`);
  }
}

if (hasErrors) {
  console.error("\n🚫 Fix image casing before pushing to GitHub.");
  process.exit(1);
} else {
  console.log("✅ All image references match exact file casing.");
}
