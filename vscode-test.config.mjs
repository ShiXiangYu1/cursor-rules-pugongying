import { defineConfig } from '@vscode/test-cli';
import { resolve } from 'path';

export default defineConfig({
    files: 'out/test/**/*.test.js',
    workspaceFolder: resolve('.'),
    mocha: {
        ui: 'tdd',
        timeout: 20000
    },
    useLocalVSCode: true,
    version: 'stable',
    extensionDevelopmentPath: resolve('.'),
    extensionTestsPath: resolve('./out/test')
}); 