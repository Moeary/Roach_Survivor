import { appendFileSync, readFileSync, writeFileSync } from "node:fs";

const inputTag = process.argv[2] ?? process.env.GITHUB_REF_NAME;

if (!inputTag) {
  throw new Error("Missing git tag. Pass a value like v0.7.0 or v0.7.");
}

const tagMatch = /^v(?<major>\d+)\.(?<minor>\d+)(?:\.(?<patch>\d+))?(?<suffix>(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)$/.exec(inputTag);

if (!tagMatch?.groups) {
  throw new Error(`Unsupported tag "${inputTag}". Use formats like v0.7 or v0.7.0.`);
}

const artifactVersion = inputTag.slice(1);
const packageVersion = `${tagMatch.groups.major}.${tagMatch.groups.minor}.${tagMatch.groups.patch ?? "0"}${tagMatch.groups.suffix ?? ""}`;

updateJsonFile("package.json", (packageJson) => {
  packageJson.version = packageVersion;
});

updateJsonFile("package-lock.json", (packageLockJson) => {
  packageLockJson.version = packageVersion;

  if (packageLockJson.packages?.[""]) {
    packageLockJson.packages[""].version = packageVersion;
  }
});

if (process.env.GITHUB_ENV) {
  appendFileSync(process.env.GITHUB_ENV, `ELECTRON_ARTIFACT_VERSION=${artifactVersion}\n`, "utf8");
}

console.log(`Synced package version ${packageVersion} from tag ${inputTag}.`);

function updateJsonFile(filePath, update) {
  const json = JSON.parse(readFileSync(filePath, "utf8"));
  update(json);
  writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, "utf8");
}
