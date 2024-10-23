import { type ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

const completeAndroidVersion = '2.0.2';
const gradleDependency = `implementation 'id.passage.android:passage:${completeAndroidVersion}'`;

/**
 * Android: Add or Update Passage Android Gradle Dependency
 */
const modifyAndroidGradleDependency: ConfigPlugin = (configuration) => {
  console.log('Passage: Modifying Android build.gradle...');
  return withDangerousMod(configuration, [
    'android',
    (config) => {
      const buildGradlePath = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'build.gradle'
      );
      if (!fs.existsSync(buildGradlePath)) {
        throw new Error(`Passage: build.gradle not found at path: ${buildGradlePath}`);
      }
      let buildGradleContents = fs.readFileSync(buildGradlePath, 'utf-8');
      if (!buildGradleContents.includes(gradleDependency)) {
        console.log(`Passage: Adding Passage dependency: ${gradleDependency}`);
        const dependenciesIndex = buildGradleContents.indexOf('dependencies {');
        if (dependenciesIndex !== -1) {
          const nextLineIndex = buildGradleContents.indexOf('\n', dependenciesIndex);
          buildGradleContents =
            buildGradleContents.slice(0, nextLineIndex + 1) +
            `    ${gradleDependency}\n` +
            buildGradleContents.slice(nextLineIndex + 1);
        }
      } else {
        console.log('Passage: Passage dependency already exists. Skipping addition.');
      }
      fs.writeFileSync(buildGradlePath, buildGradleContents);
      console.log('Passage: Android build.gradle modified successfully.');
      return config;
    },
  ]);
};

export default modifyAndroidGradleDependency;
