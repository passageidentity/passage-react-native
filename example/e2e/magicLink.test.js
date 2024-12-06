import { dismissAlert, executeTest } from './helpers';
import { MagicLinkTest } from '../constants';

describe('Magic Link tests', () => {

  beforeAll(async () => {
    await device.launchApp();
  });

  afterEach(async () => {
    await dismissAlert();
  });

  it('can register and activate using Magic Link', async () => {
    await executeTest(MagicLinkTest.RegisterAndActivate);
  });

  it('can login and activate using Magic Link', async () => {
    await executeTest(MagicLinkTest.LoginAndActivate);
  });

});
