import { type ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

const completeIosVersion = '1.0.1';
const podDependency = `pod 'PassageSwift', '${completeIosVersion}'`;

const modifyIOSPodfile: ConfigPlugin = (configuration) => {
  console.log('Passage: Modifying iOS Podfile...');
  return withDangerousMod(configuration, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      if (!fs.existsSync(podfilePath)) {
        console.warn(`Passage: Podfile not found at path: ${podfilePath}`);
        return config;
      }
      let podfileContents = fs.readFileSync(podfilePath, 'utf-8');
      if (!podfileContents.includes(podDependency)) {
        console.log(`Adding '${podDependency}' to Podfile...`);
        const targetIndex = podfileContents.lastIndexOf(`target '`);
        if (targetIndex !== -1) {
          const nextLineIndex = podfileContents.indexOf('\n', targetIndex);
          podfileContents =
            podfileContents.slice(0, nextLineIndex) +
            `  ${podDependency}\n` +
            podfileContents.slice(nextLineIndex);
        }
        fs.writeFileSync(podfilePath, podfileContents);
        console.log('Passage: Podfile updated successfully.');
      } else {
        console.log('Passage: Pod dependency already exists, skipping update.');
      }
      return config;
    },
  ]);
};

export default modifyIOSPodfile;
