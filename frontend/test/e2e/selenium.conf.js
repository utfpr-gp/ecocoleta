const { Builder } = require('selenium-webdriver');

module.exports = {
    buildDriver: async function () {
        let driver = await new Builder()
            .forBrowser('chrome')
            .usingServer('http://selenium:4444/wd/hub')  // Container do Selenium
            .build();
        return driver;
    }
};
