import { type ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

const modifyAndroidStringsXML: ConfigPlugin = (configuration) => {
  console.log(
    'Passage: Checking Android strings.xml for required asset statement.'
  );
  const associatedDomain = process.env.ASSOCIATED_DOMAIN;
  if (!associatedDomain) {
    console.error(
      'Passage: ASSOCIATED_DOMAIN is not defined in your .env. This is required for Passage.'
    );
    return configuration;
  }
  return withDangerousMod(configuration, [
    'android',
    (config) => {
      const stringsXmlPath = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/res/values/strings.xml'
      );
      if (!fs.existsSync(stringsXmlPath)) {
        console.warn(
          `Passage: strings.xml not found at ${stringsXmlPath}. Skipping modification.`
        );
        return config;
      }
      let stringsXmlContent = fs.readFileSync(stringsXmlPath, 'utf-8');
      if (!stringsXmlContent.includes('<string name="asset_statements">')) {
        console.log('Passage: Adding required asset_statements string.');
        const newStrings = `<string name="passage_auth_origin">${associatedDomain}</string>
        <string name="asset_statements">[{"include": "https://@string/passage_auth_origin/.well-known/assetlinks.json"}]</string>`;
        stringsXmlContent = stringsXmlContent.replace(
          '</resources>',
          `${newStrings}\n</resources>`
        );
      } else {
        console.log('Passage: Updating required asset_statements string.');
        const regex = /<string name="passage_auth_origin">.*?<\/string>/;
        const newDomainString = `<string name="passage_auth_origin">${associatedDomain}</string>`;
        stringsXmlContent = stringsXmlContent.replace(regex, newDomainString);
      }
      fs.writeFileSync(stringsXmlPath, stringsXmlContent);
      console.log('Passage: strings.xml check complete.');
      return config;
    },
  ]);
};

export default modifyAndroidStringsXML;
