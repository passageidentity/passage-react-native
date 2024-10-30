import { type ConfigPlugin, withEntitlementsPlist } from '@expo/config-plugins';

const modifyIOSEntitlementsPlist: ConfigPlugin = (configuration) => {
  console.log(
    'Passage: Checking iOS Entitlements for required associated domains.'
  );
  const associatedDomain = process.env.ASSOCIATED_DOMAIN;
  if (!associatedDomain) {
    console.error(
      'Passage: ASSOCIATED_DOMAIN is not defined in your .env. This is required for Passage.'
    );
    return configuration;
  }
  return withEntitlementsPlist(configuration, (config) => {
    const webCredEntitlement = `webcredentials:${associatedDomain}`;
    const appLinksEntitlement = `applinks:${associatedDomain}`;
    const key = 'com.apple.developer.associated-domains';
    // Get existing associated domains or initialize an empty array
    const domains = (config.modResults[key] as string[]) || [];
    // Add the new domains if they are not already present
    if (!domains.includes(webCredEntitlement)) {
      console.log(
        `Passage: Adding web credential entitlement: ${webCredEntitlement}`
      );
      domains.push(webCredEntitlement);
    }
    if (!domains.includes(appLinksEntitlement)) {
      console.log(
        `Passage: Adding app link entitlement: ${appLinksEntitlement}`
      );
      domains.push(appLinksEntitlement);
    }
    // Update the plist with the new domains
    config.modResults[key] = domains;
    console.log('Passage: iOS Entitlements check complete.');
    return config;
  });
};

export default modifyIOSEntitlementsPlist;
