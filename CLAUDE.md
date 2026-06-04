# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

高速公路路产损害赔偿金额计算器 — 微信小程序。基于粤交路〔1998〕38号、粤交路〔1999〕263号和粤公路函〔2020〕352号三份官方标准，纯前端实现。

## 项目结构

```
├── app.js / app.json / app.wxss   # 小程序入口，tabBar 三页配置
├── data/prices.js                 # 赔偿标准数据（~160项，合并两份标准）
├── utils/
│   ├── calculator.js              # 购物车计算 + 文本报告生成
│   ├── calc-id-matcher.js         # ID 匹配工具（7策略级联，100%覆盖）
│   ├── usage-tracker.js           # 使用频次追踪（wx.Storage）
│   └── history.js                 # 历史记录读写（wx.Storage）
├── tests/                         # 单元测试（217用例，node:test）
│   ├── wx-mock.js                 # 微信 API Mock
│   ├── calculator.test.js         # 工具函数测试
│   ├── calc-id-matcher.test.js    # ID 匹配算法测试（56用例）
│   └── calculator-page.test.js    # 页面状态管理测试（29用例）
├── custom-tab-bar/                # 自定义 TabBar 组件
├── pages/
│   ├── calculator/                # Tab1 计算：搜索展开 + 物品选择 + 清单 + 中文大写金额
│   ├── standards/                 # Tab2 标准：三份标准文件卡片列表
│   ├── standard-items/            # 标准详情：只读浏览某标准的分类和项目
│   └── profile/                   # Tab3 我的：历史记录 + 版本 + 作者 + 免责声明
```

## 开发命令

在微信开发者工具中直接打开项目根目录即可运行，无需构建/安装依赖。

## 核心数据流

1. `data/prices.js` 导出 `categories`（合并后分类列表，供计算器用）和 `standards`（按来源分组的原始数据，供标准页浏览）
2. 购物车状态 `{ [itemId]: quantity }` 通过 `wx.Storage('current_cart')` 持久化
3. 使用频次 `wx.Storage('usage_count')` 在 `addItem` 时累加，搜索展开时按此排序
4. 历史记录 `wx.Storage('calc_history')` 在 `copyReport` 时保存
5. 已选清单和中文大写金额直接在计算页展示，无独立明细页

## 关键约定

- "按实计算"项目 `price: 0`，前端显示提示文字不参与金额计算
- 同名项目在38号和352号标准中出现时以 2020 年价格为准（`source: 'both'`）
- 263号（1999年）为增补标准，单独标记 `source: '1999'`
- 历史记录最多保留 50 条
