import 'tsarch/dist/jest';
import { filesOfProject } from 'tsarch';

describe("Dashboard module", () => {

  jest.setTimeout(60000);

  it("should be independent from expenses", async () => {
    const rule = filesOfProject()
      .inFolder('dashboard')
      .shouldNot()
      .dependOnFiles()
      .inFolder('expenses');

    await expect(rule).toPassAsync();
  });

  it.skip("should be independent from settings", async () => {
    const rule = filesOfProject()
      .inFolder('dashboard')
      .shouldNot()
      .dependOnFiles()
      .inFolder('settings');

    await expect(rule).toPassAsync();
  });
  
  it("should be independent from admin", async () => {
    const rule = filesOfProject()
      .inFolder('dashboard')
      .shouldNot()
      .dependOnFiles()
      .inFolder('admin');

    await expect(rule).toPassAsync();
  });

  it("should be independent from auth", async () => {
    const rule = filesOfProject()
      .inFolder('dashboard')
      .shouldNot()
      .dependOnFiles()
      .inFolder('auth');

    await expect(rule).toPassAsync();
  });

});