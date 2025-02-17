import * as assert from 'assert';
import * as vscode from 'vscode';

suite('基础功能测试', () => {
    test('插件是否正确激活', async () => {
        // 检查插件是否成功激活
        const extension = vscode.extensions.getExtension('cursor-rules-pugongying');
        assert.ok(extension);
        await extension.activate();
    });

    test('命令是否正确注册', async () => {
        // 检查命令是否存在
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('cursor-rules-pugongying.addRules'));
    });
}); 