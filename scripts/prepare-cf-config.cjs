
const fs = require("node:fs");

const source = "wrangler.jsonc";
const target = "wrangler.deploy.jsonc";

// Wrangler 的 JSONC 配置可能包含注释。
// 使用项目安装的 Wrangler 依赖解析 JSONC。
const { parse } = require("jsonc-parser");

const config = parse(fs.readFileSync(source, "utf8"));

if (!config || !config.main || !config.name) {
  throw new Error("Wrangler 配置缺少 name 或 main");
}

// 移除上游的占位环境变量
delete config.vars;

// 保留 Cloudflare 后台设置的运行时变量
config.keep_vars = true;

// 不修改原始 wrangler.jsonc
fs.writeFileSync(
  target,
  JSON.stringify(config, null, 2)
);

console.log("已生成部署配置:", target);
