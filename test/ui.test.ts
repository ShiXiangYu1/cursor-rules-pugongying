import * as assert from 'assert';
import * as vscode from 'vscode';

suite('UI交互测试', () => {
    test('命令面板调用', async () => {
        // 测试通过命令面板调用插件功能
        const result = await vscode.commands.executeCommand('cursor-rules.addRuleFile');
        assert.ok(result);
    });

    test('右键菜单显示', async () => {
        // 测试右键菜单项是否正确显示
        const menus = await vscode.commands.getCommands(true);
        assert.ok(menus.includes('cursor-rules.contextMenu'));
    });
}); 