import 'tsarch/dist/jest';
import { filesOfProject } from 'tsarch';

describe("Application", () => {

  jest.setTimeout(60000);

  it.skip("controllers should not depend on repositories", async () => {
    const rule = filesOfProject()
      .matchingPattern('.*controller\.ts')
      .shouldNot()
      .dependOnFiles()
      .matchingPattern('.*repository\.ts');

    await expect(rule).toPassAsync();
  });

  it("controllers should not depend on apis", async () => {
    const rule = filesOfProject()
      .matchingPattern('.*controller\.ts')
      .shouldNot()
      .dependOnFiles()
      .matchingPattern('.*api\.ts');

    await expect(rule).toPassAsync();
  });

  it.skip("services should follow naming convention", async () => {
    const rule = filesOfProject()
      .inFolder('services')
      .should()
      .matchPattern('.*service(\.spec)?\.ts|.*provider\.ts|.*factory\.ts|.*instance\.ts');

    await expect(rule).toPassAsync();
  });

  it("repositories should follow naming convention", async () => {
    const rule = filesOfProject()
      .inFolder('repositories')
      .should()
      .matchPattern('.*repository\.ts');

    await expect(rule).toPassAsync();
  });

  it("repositories should not depend on services and controllers", async () => {
    const rule = filesOfProject()
      .matchingPattern('.*repository\.ts')
      .shouldNot()
      .dependOnFiles()
      .matchingPattern('.*service\.ts|.*controller\.ts');

    await expect(rule).toPassAsync();
  });

  it("services should not depend on controllers", async () => {
    const rule = filesOfProject()
      .matchingPattern('.*service\.ts')
      .shouldNot()
      .dependOnFiles()
      .matchingPattern('.*controller\.ts');

    await expect(rule).toPassAsync();
  });

  it("application logic should be cycle free", async () => {
    const rule = filesOfProject()
      .inFolder("app")
      .should()
      .beFreeOfCycles();

    await expect(rule).toPassAsync();
  });

});