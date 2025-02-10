const HomePage = require('./pages/homePage');
const { buildDriver } = require('./selenium.conf');

describe('Home Page Tests', () => {
    let driver;
    let homePage;

    beforeAll(async () => {
        driver = await buildDriver();
        homePage = new HomePage(driver);
        await homePage.open();
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('should have the correct page title', async () => {
        const title = await homePage.getPageTitle();
        expect(title).toBe('EcoColeta');  // Ajuste conforme o título real
    });

    it('should click a button and navigate correctly', async () => {
        await homePage.clickButtonById('start-button');  // Exemplo de interação
        // Verifique se a navegação aconteceu corretamente
    });
});
