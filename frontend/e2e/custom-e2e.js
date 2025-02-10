const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

(async function loginTest() {
    let options = new chrome.Options();
    options.addArguments("--ignore-certificate-errors");
    options.addArguments("--disable-web-security");

    let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .usingServer("http://selenium:4444/wd/hub")
        .build();

    try {
        // Acessar o aplicativo Angular no container frontend
        await driver.get("https://frontend:4200/auth/login");

        // Aguarda o toast aparecer e fecha-o
        await driver.wait(
            until.elementLocated(
                By.xpath(
                    "/html/body/app-root/app-login/div/p-toast/div/p-toastitem/div/div/button"
                )
            ),
            10000
        );
        await driver
            .findElement(
                By.xpath(
                    "/html/body/app-root/app-login/div/p-toast/div/p-toastitem/div/div/button"
                )
            )
            .click();
        console.log("✅ Toast fechado.");

        // Aguarda o campo de email estar presente na página
        await driver.wait(until.elementLocated(By.id("email1")), 15000);
        console.log("✅ Campo de email encontrado.");

        // Preencher o campo de email
        await driver
            .findElement(By.id("email1"))
            .sendKeys("usuario@example.com");

        // Preencher o campo de senha
        await driver.findElement(By.id("password1")).sendKeys("senha123");

        // Clicar no botão de login
        await driver.findElement(By.id("login-button")).click();

        // Verificar se foi redirecionado para a página correta
        await driver.wait(until.urlContains("home"), 15000);
        console.log(
            "✅ Login realizado com sucesso e redirecionado para o dashboard."
        );
    } catch (error) {
        console.error("❌ Erro durante o teste de login:", error);
    } finally {
        await driver.quit();
    }
})();
