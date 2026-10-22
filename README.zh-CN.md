# mo-hardware

[English](README.md) | 简体中文

本仓库维护 InHand Mo 系列硬件资料、结构文件、配件与测试记录。
所有网页、导航与渲染逻辑仍由 [mo-docs](https://github.com/inhandnet/mo-docs) 维护。

## 当前状态

已提供目录骨架、贡献规范、CI 和 Tag 发布流程。
Mo62A 与 Mo68A 目前均为目录占位；Mo68A 没有填写任何产品资料。
占位目录不代表已验证或支持对应硬件能力。

各栏目 Excel 模板、字段级校验、Excel 转 JSON 与 mo-docs 自动接入尚未实现。
当前发布的 manifest 只是文件清单，不能作为已验证产品目录。

## 维护职责

硬件团队维护 `products/` 和 `accessories/` 下的表格、说明和附件。
模板位于 `templates/`；自动化由软件团队维护，不要求硬件同事编写代码。

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
Release 包含资料归档、文件清单、SPDX 软件物料清单、校验和、中英文更新记录。
SPDX 文件描述仓库发布物，不代表板卡器件 BOM。
当前流程不部署网页、不触发 mo-docs；接入完成后另行启用版本更新流程。

许可证与 mo-docs 一致，为 [CC BY-SA 4.0](LICENSE)。第三方资料保留原许可；
没有再分发许可时使用官方链接。请勿上传凭据、内部资料或未获公开授权的附件。
