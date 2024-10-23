import { type ConfigPlugin, withEntitlementsPlist } from '@expo/config-plugins';

const modifyIOSEntitlementsPlist: ConfigPlugin = (configuration) => {
  const associatedDomain = process.env.ASSOCIATED_DOMAIN;
  if (!associatedDomain) {
    console.warn('Passage: ASSOCIATED_DOMAIN environment variable is not defined. Skipping entitlements modification.');
    return configuration;
  }
  console.log('Passage: Modifying iOS Entitlements Plist...');
  return withEntitlementsPlist(configuration, (config) => {
    const webCredEntitlement = `webcredentials:${associatedDomain}`;
    const appLinksEntitlement = `applinks:${associatedDomain}`;
    const key = 'com.apple.developer.associated-domains';
    // Get existing associated domains or initialize an empty array
    const domains = (config.modResults[key] as string[]) || [];
    // Add the new domains if they are not already present
    if (!domains.includes(webCredEntitlement)) {
      console.log(`Passage: Adding web credential entitlement: ${webCredEntitlement}`);
      domains.push(webCredEntitlement);
    }
    if (!domains.includes(appLinksEntitlement)) {
      console.log(`Passage: Adding app link entitlement: ${appLinksEntitlement}`);
      domains.push(appLinksEntitlement);
    }
    // Update the plist with the new domains
    config.modResults[key] = domains;
    console.log('Passage: iOS Entitlements Plist updated successfully.');
    return config;
  });
};

export default modifyIOSEntitlementsPlist;
