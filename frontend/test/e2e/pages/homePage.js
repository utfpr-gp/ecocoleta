const {By} = require('selenium-webdriver');

class HomePage {
    constructor(driver) {
        this.driver = driver;
        this.url = 'https://localhost:4200';  // O frontend do Angular
    }

    async open() {
        await this.driver.get(this.url);
    }

    async getPageTitle() {
        return this.driver.getTitle();
    }

    async clickButtonById(buttonId) {
        const button = await this.driver.findElement(By.id(buttonId));
        await button.click();
    }
}

module.exports = HomePage;
