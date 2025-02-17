import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
    try {
        // 插件的根目录
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');
        // 测试文件所在目录
        const extensionTestsPath = path.resolve(__dirname, './');

        // 运行测试
        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
        });
    } catch (err) {
        console.error('测试运行失败:', err);
        process.exit(1);
    }
}

main(); 