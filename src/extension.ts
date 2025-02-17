// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { RuleManager } from './ruleManager';
import { RulePanel } from './webview/rulePanel';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Cursor Rules extension is now active!');

	// 创建规则管理器实例
	const ruleManager = new RuleManager(context);

	// 注册命令
	let disposables = [
		// 原有的添加规则命令
		vscode.commands.registerCommand('cursor-rules-pugongying.addRules', async () => {
			try {
				// 获取插件安装路径
				const extension = vscode.extensions.getExtension('pugongying.cursor-rules-pugongying');
				if (!extension) {
					throw new Error('找不到插件');
				}

				// 检查工作区
				const workspaceFolders = vscode.workspace.workspaceFolders;
				if (!workspaceFolders) {
					throw new Error('请先打开一个项目文件夹！');
				}

				// 构建规则文件路径
				const rulesPath = path.join(extension.extensionPath, 'rules');
				
				// 选择规则类型
				const ruleTypes = fs.readdirSync(rulesPath);
				const selectedType = await vscode.window.showQuickPick(ruleTypes, {
					placeHolder: '选择规则类型'
				});

				if (!selectedType) {
					return;
				}

				// 获取源文件和目标文件路径
				const sourcePath = path.join(rulesPath, selectedType, '.cursorrules');
				const targetPath = path.join(workspaceFolders[0].uri.fsPath, '.cursorrules');

				// 复制文件
				const success = await copyRuleFile(sourcePath, targetPath);
				if (success) {
					vscode.window.showInformationMessage('规则添加成功！');
				}
			} catch (error: any) {
				vscode.window.showErrorMessage(`添加规则失败: ${error.message}`);
			}
		}),

		// 创建新规则命令
		vscode.commands.registerCommand('cursor-rules-pugongying.createRule', async () => {
			try {
				const name = await vscode.window.showInputBox({
					prompt: '输入新规则类型名称',
					placeHolder: '例如: Java开发'
				});

				if (!name) {
					return;
				}

				const description = await vscode.window.showInputBox({
					prompt: '输入规则描述',
					placeHolder: '例如: Java 后端开发规则'
				});

				if (!description) {
					return;
				}

				await ruleManager.createRule(name, description);
				vscode.window.showInformationMessage(`成功创建规则类型: ${name}`);

			} catch (error) {
				vscode.window.showErrorMessage(`创建规则失败: ${error}`);
			}
		}),

		// 编辑规则命令
		vscode.commands.registerCommand('cursor-rules-pugongying.editRule', async () => {
			try {
				const rules = await ruleManager.getAllRules();
				const selectedRule = await vscode.window.showQuickPick(
					rules.map(rule => ({
						label: rule.name,
						description: rule.description,
						detail: rule.isBuiltin ? '内置规则' : '自定义规则',
						rule: rule
					})), {
						placeHolder: '选择要编辑的规则',
					}
				);

				if (!selectedRule) {
					return;
				}

				await ruleManager.editRule(selectedRule.rule.id);

			} catch (error) {
				vscode.window.showErrorMessage(`编辑规则失败: ${error}`);
			}
		}),

		// 删除规则命令
		vscode.commands.registerCommand('cursor-rules-pugongying.deleteRule', async () => {
			try {
				const rules = await ruleManager.getAllRules();
				const customRules = rules.filter(r => !r.isBuiltin);

				if (customRules.length === 0) {
					vscode.window.showInformationMessage('没有可删除的自定义规则');
					return;
				}

				const selectedRule = await vscode.window.showQuickPick(
					customRules.map(rule => ({
						label: rule.name,
						description: rule.description,
						detail: '点击删除规则',
						rule: rule
					})), {
						placeHolder: '选择要删除的规则',
					}
				);

				if (!selectedRule) {
					return;
				}

				const confirmed = await confirmAction(`确定要删除规则 ${selectedRule.label} 吗？此操作不可恢复。`);
				if (!confirmed) {
					return;
				}

				await ruleManager.deleteRule(selectedRule.rule.id);
				vscode.window.showInformationMessage(`成功删除规则: ${selectedRule.label}`);

			} catch (error) {
				vscode.window.showErrorMessage(`删除规则失败: ${error}`);
			}
		})
	];

	context.subscriptions.push(...disposables);
}

// 获取规则文件的描述信息（读取文件的前几行作为描述）
function getRuleDescription(rulePath: string): string {
	try {
		if (fs.existsSync(rulePath)) {
			const content = fs.readFileSync(rulePath, 'utf8');
			const firstLines = content.split('\n').slice(0, 2).join(' ').trim();
			return firstLines || '无描述信息';
		}
	} catch (error) {
		console.error('读取规则描述失败:', error);
	}
	return '无描述信息';
}

// 移除 showRulePreview 函数，改为直接显示确认对话框
async function confirmAction(message: string): Promise<boolean> {
	const result = await vscode.window.showInformationMessage(
		message,
		'确认',
		'取消'
	);
	return result === '确认';
}

// This method is called when your extension is deactivated
export function deactivate() {}

async function copyRuleFile(sourcePath: string, targetPath: string) {
	try {
		// 确保源文件存在
		if (!fs.existsSync(sourcePath)) {
			throw new Error(`源规则文件不存在: ${sourcePath}`);
		}

		// 确保目标目录存在
		const targetDir = path.dirname(targetPath);
		if (!fs.existsSync(targetDir)) {
			fs.mkdirSync(targetDir, { recursive: true });
		}

		// 复制文件
		await fs.promises.copyFile(sourcePath, targetPath);
		return true;
	} catch (error: any) {
		vscode.window.showErrorMessage(`复制规则文件失败: ${error.message}`);
		return false;
	}
}
