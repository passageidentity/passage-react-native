/* eslint-disable */

import { element } from 'detox';

import { SocialTest, ViewName } from '../constants';
import { showTestView } from './helpers';

describe('Social tests', () => {

  beforeAll(async () => {
    await device.launchApp();
    await showTestView(ViewName.SocialView);
  });

  it('can view social login web view', async () => {
    const platform = device.getPlatform();
    if (platform !== 'ios') return;
    // Find test button by button name
    await element(by.label(SocialTest.AuthorizeStart))
      .tap();
    // Wait for system prompt
    await waitFor(element(by.type('UIInputSetContainerView')))
      .toExist()
      .withTimeout(10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    await expect(system.element(by.system.label('Continue'))).toExist();
    await new Promise(resolve => setTimeout(resolve, 10000));
    // Give permission to open web view
    system.element(by.system.label('Continue')).tap();
    // Expect web view to open
    await waitFor(element(by.type('SFSafariView')))
      .toExist()
      .withTimeout(20000);
  });

});
