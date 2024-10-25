import { type ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

const completeIosVersion = '1.0.1'; // Update as needed
const podDependencyPattern = /pod 'PassageSwift',\s*'([\d.]+)'/;
const podDependency = `pod 'PassageSwift', '${completeIosVersion}'`;

const modifyIOSPodfile: ConfigPlugin = (configuration) => {
  console.log('Passage: Checking iOS Podfile.');
  return withDangerousMod(configuration, [
    'ios',
    (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile'
      );
      if (!fs.existsSync(podfilePath)) {
        console.warn(
          `Passage: Podfile not found at path: ${podfilePath}. Skipping Podfile modification.`
        );
        return config;
      }
      let podfileContents = fs.readFileSync(podfilePath, 'utf-8');
      // Check if the dependency is already present and extract the version
      const existingVersionMatch = podfileContents.match(podDependencyPattern);
      const existingVersion = existingVersionMatch
        ? existingVersionMatch[1]
        : null;
      if (existingVersion) {
        if (existingVersion === completeIosVersion) {
          console.log(
            'Passage: Pod dependency is already up-to-date. No changes made.'
          );
        } else {
          console.log(
            `Passage: Updating Pod dependency from version ${existingVersion} to ${completeIosVersion}.`
          );
          podfileContents = podfileContents.replace(
            podDependencyPattern,
            podDependency
          );
          fs.writeFileSync(podfilePath, podfileContents);
          console.log('Passage: Podfile updated successfully.');
        }
      } else {
        console.log(`Passage: Adding '${podDependency}' to Podfile...`);
        const targetIndex = podfileContents.lastIndexOf(`target '`);
        if (targetIndex !== -1) {
          const nextLineIndex = podfileContents.indexOf('\n', targetIndex);
          podfileContents =
            podfileContents.slice(0, nextLineIndex) +
            `  ${podDependency}\n` +
            podfileContents.slice(nextLineIndex);
          fs.writeFileSync(podfilePath, podfileContents);
          console.log('Passage: Podfile updated successfully.');
        }
      }
      console.log('Passage: iOS Podfile check complete.');
      return config;
    },
  ]);
};

export default modifyIOSPodfile;
