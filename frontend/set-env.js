const fs = require('fs');
const dotenv = require('dotenv');

// Carregar as variáveis do .env
dotenv.config();

const targetPath = './src/environments/environment.prod.ts';

// Substituir a chave diretamente do .env
const envConfigFile = `
export const environment = {
  production: true,
  API_KEY_GOOGLE_MAPS: '${process.env.API_KEY_GOOGLE_MAPS}',
  API: '${process.env.API}',
};
`;

// Escrever no environment.prod.ts
fs.writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        console.error('Erro ao escrever o arquivo de configuração:', err);
    } else {
        console.log(`Arquivo de configuração gerado com sucesso: ${targetPath}`);
    }
});
