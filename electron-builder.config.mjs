import { readFileSync } from "node:fs";

const productName = "RoachSurvivor";
const packageJson = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));
const artifactVersion = process.env.ELECTRON_ARTIFACT_VERSION || packageJson.version;

export default {
  appId: "com.roach.survivor",
  asar: true,
  directories: {
    output: "release",
  },
  files: [
    "dist/**/*",
    "electron/**/*",
    "package.json",
  ],
  linux: {
    artifactName: `${productName}-linux-amd64-${artifactVersion}.\${ext}`,
    category: "Game",
    icon: "public/icon.png",
    target: [
      {
        arch: ["x64"],
        target: "AppImage",
      },
    ],
  },
  npmRebuild: false,
  productName,
  win: {
    artifactName: `${productName}-windows-amd64-${artifactVersion}.\${ext}`,
    icon: "public/icon.ico",
    target: [
      {
        arch: ["x64"],
        target: "nsis",
      },
    ],
  },
  nsis: {
    allowToChangeInstallationDirectory: true,
    oneClick: false,
    perMachine: false,
  },
};
