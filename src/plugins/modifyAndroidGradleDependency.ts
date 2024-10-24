import { type ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

const completeAndroidVersion = '2.0.2'; // Update as needed
const gradleDependencyPattern =
  /implementation 'id\.passage\.android:passage:[\d.]+?'/;
const gradleDependency = `implementation 'id.passage.android:passage:${completeAndroidVersion}'`;

// Add or Update Passage Android Gradle Dependency
const modifyAndroidGradleDependency: ConfigPlugin = (configuration) => {
  console.log('Passage: Checking Android build.gradle for Passage dependency.');
  return withDangerousMod(configuration, [
    'android',
    (config) => {
      const buildGradlePath = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'build.gradle'
      );
      if (!fs.existsSync(buildGradlePath)) {
        console.warn(
          `Passage: build.gradle not found at path: ${buildGradlePath}`
        );
        return config;
      }
      let buildGradleContents = fs.readFileSync(buildGradlePath, 'utf-8');
      if (gradleDependencyPattern.test(buildGradleContents)) {
        console.log('Passage: Existing Passage dependency found.');
        const existingVersionMatch = buildGradleContents.match(
          /id\.passage\.android:passage:([\d.]+)/
        );
        const existingVersion = existingVersionMatch
          ? existingVersionMatch[1]
          : null;
        if (existingVersion === completeAndroidVersion) {
          console.log(
            'Passage: Dependency is already up-to-date. No changes made.'
          );
        } else {
          console.log(
            `Passage: Updating Passage dependency from version ${existingVersion} to ${completeAndroidVersion}.`
          );
          buildGradleContents = buildGradleContents.replace(
            gradleDependencyPattern,
            gradleDependency
          );
          fs.writeFileSync(buildGradlePath, buildGradleContents);
          console.log(
            'Passage: Passage dependency version updated successfully.'
          );
        }
      } else {
        console.log(`Passage: Adding Passage dependency: ${gradleDependency}`);
        const dependenciesIndex = buildGradleContents.indexOf('dependencies {');
        if (dependenciesIndex !== -1) {
          const nextLineIndex = buildGradleContents.indexOf(
            '\n',
            dependenciesIndex
          );
          buildGradleContents =
            buildGradleContents.slice(0, nextLineIndex + 1) +
            `    ${gradleDependency}\n` +
            buildGradleContents.slice(nextLineIndex + 1);
          fs.writeFileSync(buildGradlePath, buildGradleContents);
          console.log(
            'Passage: Added Passage to Android build.gradle successfully.'
          );
        }
      }
      return config;
    },
  ]);
};

export default modifyAndroidGradleDependency;
