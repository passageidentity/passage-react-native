import { dismissAlert, executeTest } from './helpers';
import { AppTest } from '../constants';

describe('App tests', () => {

  beforeAll(async () => {
    await device.launchApp();
  });

  afterEach(async () => {
    await dismissAlert();
  });

  it('can get app info', async () => {
    await executeTest(AppTest.GetAppInfo);
  });

  it('can get existing user', async () => {
    await executeTest(AppTest.UserExists);
  });

  it('cannot get non-existing user', async () => {
    await executeTest(AppTest.UserDoesNotExist);
  });

  it('can create user', async () => {
    await executeTest(AppTest.CreateUser);
  });

  it('cannot create user if user already exists', async () => {
    await executeTest(AppTest.CreateUserExists);
  });

});