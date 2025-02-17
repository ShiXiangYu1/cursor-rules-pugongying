"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
suite('规则文件测试', () => {
    const testWorkspace = path.join(__dirname, 'workspace');
    setup(() => {
        // 创建测试工作区
        if (!fs.existsSync(testWorkspace)) {
            fs.mkdirSync(testWorkspace);
        }
    });
    test('创建规则文件', async () => {
        // 测试创建规则文件
        const rulePath = path.join(testWorkspace, '.cursorrules');
        // 执行创建规则文件的操作
        // 验证文件是否创建成功
        assert.ok(fs.existsSync(rulePath));
    });
    test('规则合并功能', async () => {
        // 测试规则合并
        // 创建测试规则文件
        // 执行合并操作
        // 验证合并结果
    });
    teardown(() => {
        // 清理测试文件
        if (fs.existsSync(testWorkspace)) {
            fs.rmdirSync(testWorkspace, { recursive: true });
        }
    });
});
//# sourceMappingURL=rules.test.js.map