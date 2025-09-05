# 国际化功能说明 (Internationalization Guide)

## 概述 (Overview)

本项目已成功集成国际化功能，支持中文（zh-CN）和英文（en-US）双语切换。

## 功能特性 (Features)

- ✅ 支持中文和英文双语
- ✅ 自动检测浏览器语言偏好
- ✅ 本地存储用户语言选择
- ✅ 动态语言切换，无需刷新页面
- ✅ 响应式语言切换按钮
- ✅ 完整的翻译覆盖

## 文件结构 (File Structure)

```
assets/
├── locales/
│   ├── en.json          # 英文翻译文件
│   └── zh.json          # 中文翻译文件
├── js/
│   ├── i18n.js          # 国际化核心系统
│   └── main.js          # 主要JavaScript功能（已集成i18n）
└── css/
    └── styles.css       # 样式文件（包含语言切换按钮样式）
```

## 使用方法 (Usage)

### 1. 在HTML中添加翻译标记

```html
<!-- 基本文本翻译 -->
<h1 data-i18n="navigation.home">Home</h1>

<!-- 按钮文本 -->
<button data-i18n="common.getInTouch">Get in Touch</button>

<!-- 页面标题 -->
<title data-i18n="home.title">Sophia Chen - Tech Portfolio</title>
```

### 2. 添加语言切换按钮

```html
<div class="flex items-center gap-2">
    <button class="language-btn" data-lang="en">EN</button>
    <button class="language-btn" data-lang="zh">中文</button>
</div>
```

### 3. 引入必要的脚本

```html
<!-- 在页面底部添加 -->
<script src="assets/js/i18n.js"></script>
<script src="assets/js/main.js"></script>
```

## 翻译文件格式 (Translation File Format)

翻译文件使用嵌套的JSON格式：

```json
{
  "navigation": {
    "home": "首页",
    "about": "关于我",
    "projects": "项目"
  },
  "common": {
    "getInTouch": "联系我",
    "viewResume": "查看简历"
  }
}
```

## API 使用 (API Usage)

### JavaScript API

```javascript
// 获取当前语言
const currentLang = window.i18n.getCurrentLanguage();

// 切换语言
window.i18n.changeLanguage('zh');

// 获取翻译文本
const text = window.i18n.t('navigation.home');

// 带参数的翻译（如果需要）
const text = window.i18n.t('welcome.message', { name: 'John' });
```

## 已完成的页面 (Completed Pages)

- ✅ 主页 (index.html) - 完全国际化
- ✅ 关于页面 (about/index.html) - 部分国际化
- ⏳ 项目页面 (projects/) - 待完成
- ⏳ 文章页面 (articles/) - 待完成
- ⏳ 视频页面 (videos/) - 待完成
- ⏳ 联系页面 (contact/) - 待完成

## 测试 (Testing)

1. 启动本地服务器：
   ```bash
   python3 -m http.server 8000
   ```

2. 访问测试页面：
   - 主页：http://localhost:8000
   - 测试页面：http://localhost:8000/test-i18n.html

3. 测试功能：
   - 点击语言切换按钮
   - 验证文本是否正确翻译
   - 检查浏览器控制台是否有错误

## 添加新翻译 (Adding New Translations)

1. 在 `assets/locales/en.json` 和 `assets/locales/zh.json` 中添加新的翻译键值对
2. 在HTML中使用 `data-i18n="your.translation.key"` 属性
3. 刷新页面测试

## 注意事项 (Notes)

- 语言偏好会自动保存到 localStorage
- 首次访问时会根据浏览器语言自动选择语言
- 所有翻译文件都使用UTF-8编码
- 支持嵌套的翻译键（如 `navigation.home`）

## 故障排除 (Troubleshooting)

1. **翻译不显示**：检查翻译文件路径和JSON格式
2. **语言切换不工作**：确保JavaScript文件正确加载
3. **控制台错误**：检查网络请求和文件路径

## 下一步计划 (Next Steps)

1. 完成所有页面的国际化
2. 添加更多语言支持
3. 优化加载性能
4. 添加RTL语言支持（如需要）
