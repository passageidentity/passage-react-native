import { dismissAlert, executeTest } from './helpers';
import { OTPTest } from '../constants';

describe('OTP tests', () => {

  beforeAll(async () => {
    await device.launchApp();
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
