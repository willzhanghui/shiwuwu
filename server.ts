import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Mock Data Generation
  const cities = [
    { name: "武汉市", coords: [114.30, 30.60] },
    { name: "黄石市", coords: [115.03, 30.19] },
    { name: "十堰市", coords: [110.79, 32.62] },
    { name: "宜昌市", coords: [111.28, 30.69] },
    { name: "襄阳市", coords: [112.12, 32.00] },
    { name: "鄂州市", coords: [114.89, 30.38] },
    { name: "荆门市", coords: [112.19, 31.04] },
    { name: "孝感市", coords: [113.91, 30.92] },
    { name: "荆州市", coords: [112.23, 30.33] },
    { name: "黄冈市", coords: [114.87, 30.45] },
    { name: "咸宁市", coords: [114.32, 29.84] },
    { name: "随州市", coords: [113.38, 31.69] },
    { name: "恩施州", coords: [109.48, 30.28] },
    { name: "仙桃市", coords: [113.45, 30.36] },
    { name: "潜江市", coords: [112.89, 30.42] },
    { name: "天门市", coords: [113.16, 30.66] },
    { name: "神农架", coords: [110.67, 31.74] }
  ];

  const projects: any[] = [];
  const totalProjectCount = 369;
  const categories = ["专项A", "专项B", "专项C", "专项D", "专项E", "专项F", "专项G"];
  const preps = ["A", "B", "C", "D"];
  const stages = ["筹备中", "已立项", "实施中", "已竣工"];
  const natures = ["新建", "改建", "扩建"];

  for (let i = 1; i <= totalProjectCount; i++) {
    const cityObj = cities[Math.floor(Math.random() * cities.length)];
    const lng = cityObj.coords[0] + (Math.random() - 0.5) * 0.5;
    const lat = cityObj.coords[1] + (Math.random() - 0.5) * 0.5;
    
    projects.push({
      id: i,
      city: cityObj.name,
      county: cityObj.name.replace(/[市州]/, "") + "某区",
      cat1: categories[Math.floor(Math.random() * categories.length)],
      cat2: "工程" + (Math.floor(Math.random() * 3) + 1),
      cat3: "重大项目",
      prep: preps[Math.floor(Math.random() * preps.length)],
      stage: stages[Math.floor(Math.random() * stages.length)],
      name: `${cityObj.name}第${i}号重大农业建设项目`,
      invest: parseFloat((Math.random() * 50 + 5).toFixed(1)),
      builder: cityObj.name + "农业农村局",
      nature: natures[Math.floor(Math.random() * natures.length)],
      lng: parseFloat(lng.toFixed(5)),
      lat: parseFloat(lat.toFixed(5)),
      desc: "该项目旨在提升当地农业现代化水平，促进产业融合发展。"
    });
  }

  const accounts = [
    { id: 1, uname: "admin_hb", name: "张伟", phone: "13800138001", email: "zhangwei@hubei.gov.cn", dept: "省厅规划财务处", perms: "全部权限", status: "启用", created: "2025-01-15" },
    { id: 2, uname: "wh_proj", name: "李娜", phone: "13700137001", email: "lina@wuhan.gov.cn", dept: "武汉市农业农村局", perms: "项目管理、项目统计、大屏", status: "启用", created: "2025-02-20" },
    { id: 3, uname: "xg_proj", name: "王磊", phone: "13600136001", email: "wanglei@xiaogan.gov.cn", dept: "孝感市农业农村局", perms: "项目管理", status: "启用", created: "2025-03-01" },
    { id: 4, uname: "viewer_01", name: "陈晓", phone: "13500135001", email: "chenxiao@hubei.gov.cn", dept: "省厅种植业管理处", perms: "项目统计、项目分析", status: "启用", created: "2025-03-10" },
    { id: 5, uname: "admin_02", name: "刘芳", phone: "13400134001", email: "liufang@hubei.gov.cn", dept: "省厅科技教育处", perms: "项目管理、账号管理", status: "启用", created: "2025-04-01" },
  ];

  // API Routes
  app.get("/api/projects", (req, res) => {
    res.json(projects);
  });

  app.get("/api/accounts", (req, res) => {
    res.json(accounts);
  });

  app.get("/api/stats", (req, res) => {
    // Basic stats calculation
    const totalInvest = projects.reduce((sum, p) => sum + p.invest, 0);
    const cityCount = new Set(projects.map(p => p.city)).size;
    res.json({
      totalProjects: projects.length,
      totalInvest: totalInvest.toFixed(2),
      cityCount,
      categoryCount: 7
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
