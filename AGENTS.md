# 项目规则

## 地图使用规范
- **禁止使用 Mapbox**：本项目所有地图组件必须使用 **MapLibre GL JS**。
- **底图服务**：统一使用 **天地图 (Tianditu)** 作为底图数据源。
- **天地图 Token**：必须使用指定的 Token：`b5de8c428b2dbb5e9894f02ffdc5cff8`。
- **字体资源**：为避免 Mapbox Token 验证错误，必须显式指定开源字体资源地址（如 `https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf`）。
