# mo-hardware

[English](README.md) | 简体中文

本仓库维护 InHand Mo 系列硬件资料、结构文件、配件与测试记录。
硬件页面在本仓库独立构建和发布，与
[mo-docs](https://github.com/inhandnet/mo-docs) 保持视觉一致。
硬件同事维护资料；页面模板和自动化由软件团队维护。

## 当前状态

第一版迁入 mo-docs 提交 `cbc6053` 的 33 个硬件、配件和合规源页，另生成
三个入口。沿用原主题、字体、搜索与表格规则，保留 Mo62A 公开图片、STEP
和原理图 PDF。来源与路由记录在 `site/content-map.json`。
Mo68A 网页保留原站内容（Overview 已有规格），其产品资料目录仍为空；
不新增验证结论，不修改 Mo68A 代码。Coming soon 页面不代表已支持或已认证。

PR CI 使用正式站构建并发布 Pages 预览。Excel 模板、字段级校验及转换仍待实现。
当前先维护普通 Markdown 和附件，不要求硬件同事编辑 MDX 或前端代码。
manifest 区分继承页面与验证记录，不能当作已验证产品目录。

## 维护职责

硬件团队维护 `products/` 和 `accessories/` 下的表格、说明和附件。
模板位于 `templates/`；自动化由软件团队维护，不要求硬件同事编写代码。
网站代码在 `site/`，由软件团队维护；日常硬件发布无需重编 mo-docs。

| 目录 | 职责 |
| --- | --- |
| `products/<产品>/images/` | 标准产品图 |
| `products/<产品>/interfaces/` | 接口、引脚、电气定义 |
| `products/<产品>/schematics/` | 原理图和硬件模块说明 |
| `products/<产品>/pcb/` | 经确认可公开的 PCB 资料 |
| `products/<产品>/mechanical/` | STEP、尺寸、公差、装配资料 |
| `products/<产品>/revisions/` | 硬件识别和变更记录 |
| `products/<产品>/validation/` | 功耗温度、接口测试条件与结果 |
| `products/<产品>/compliance/` | 认证、声明及适用范围 |
| `accessories/` | 跨产品共用配件及兼容记录 |

详细页面对应关系见 [CONTENT-CONTRACT.md](CONTENT-CONTRACT.md)。
产品元数据规划使用 `product.xlsx`，每类独立记录规划使用 `record.xlsx`。
长说明使用 `description.zh-CN.md`、`description.en-US.md`，附件放入记录的
`files/`、`images/`。模板定稿前不把这些约定描述为已完成的数据接口。

## 提交与发布

所有 GitHub 用户均可 Fork 后向 `master` 提 PR。
只有管理员可以合并 PR、创建 Tag；管理员也必须通过 PR 和必需检查。
仅接受 squash 合并，PR 标题与正文形成提交信息，正文含中英 `Message` 块。
首次克隆后运行 `git config core.hooksPath .githooks`。

管理员推送指向 master 历史中提交的 annotated Tag 后自动发布：
`VX.Y.Z` 为正式版，`VX.Y.Z-rcN` 为预发布版。已发布 Tag 不覆盖、不删除。
Release 包含资料归档、独立静态站包、文件清单、SPDX 软件物料清单、校验和、中英文更新记录。
SPDX 文件描述仓库发布物，不代表板卡器件 BOM。
Tag 发布后经受限 `deploy-hardware` 动作部署测试平台 `/hardware-docs/`。
流水线校验压缩包和上线版本，冒烟检查失败时回滚；缺少部署凭据会报错。
正式平台尚未接入，RC 不部署正式平台。mo-docs 旧硬件页逐页跳转并保留锚点。
GitHub Pages 只用于完整站点的工程预览，不替代公网测试平台发布。

本地运行：`npm ci --ignore-scripts` 后使用 `npm run start`（8042）；
生产构建用 `npm run build`，输出 `site/build/`；生成目录不得手工编辑。
检查包括 `npm test`、`npm run typecheck` 和安装 Chromium 后的 `npm run test:site`。

许可证与 mo-docs 一致，为 [CC BY-SA 4.0](LICENSE)。第三方资料保留原许可；
没有再分发许可时使用官方链接。请勿上传凭据、内部资料或未获公开授权的附件。
markdown-it 等维护依赖遵循各自的软件许可证，不适用本仓库的 CC BY-SA 声明。
