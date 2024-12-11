/* eslint-disable */

import { dismissAlert, showTestView, executeTest } from './helpers';
import { OTPTest, ViewName } from '../constants';

describe('OTP tests', () => {

  beforeAll(async () => {
    await device.launchApp();
    await showTestView(ViewName.OTPView);
  });

  afterEach(async () => {
    await dismissAlert();
  });

  it('can register and activate using OTP', async () => {
    await executeTest(OTPTest.RegisterAndActivate);
  });

  it('can login and activate using OTP', async () => {
    await executeTest(OTPTest.LoginAndActivate);
  });

});
