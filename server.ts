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

  // Mock Data from Prototypes
  const projects = [
    { id: 1, city: "咸宁市", county: "赤壁市", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "咸宁市赤壁市青砖茶国家现代农业产业园创建项目", invest: 18.0, ci: 0.0, li: 0.0, ei: 18.0, fi: 0.0, contact: "孙永平", phone: "18888888888", sy: "2026年", ey: "2030年", builder: "赤壁市农业农村局", bt: "改扩建", lng: 113.88212, lat: 29.7383, stage: "实施中", type: "茶叶" },
    { id: 2, city: "襄阳市", county: "枣阳市", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "A", name: "襄阳市枣阳市“枣阳皇桃”全产业链建设项目", invest: 15.0, ci: 0.6, li: 14.1, ei: 0.0, fi: 0.0, contact: "张锐", phone: "18888888888", sy: "2026年", ey: "2030年", builder: "枣阳市农业农村局", bt: "新建", lng: 112.795, lat: 32.14691, stage: "实施中", type: "水果" },
    { id: 3, city: "襄阳市", county: "枣阳市", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "A", name: "襄阳市枣阳市皇桃标准种植化示范基地项目", invest: 10.0, ci: 2.0, li: 7.0, ei: 0.0, fi: 0.0, contact: "张锐", phone: "18888888888", sy: "2026年", ey: "2030年", builder: "枣阳市农业农村局", bt: "新建", lng: 112.7591, lat: 32.13077, stage: "实施中", type: "水果" },
    { id: 4, city: "荆门市", county: "荆州区", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A3.农业科技装备支撑工程", cat3: "现代设施农业项目", prep: "A", name: "荆州市荆州区富硒葡萄与食用菌种植项目", invest: 4.3, ci: 0.0, li: 4.3, ei: 0.0, fi: 0.0, contact: "雷宇天", phone: "18888888888", sy: "2026年", ey: "2027年", builder: "河北财举农业发展有限公司", bt: "新建", lng: 112.1772, lat: 30.33693, stage: "实施中", type: "水果" },
    { id: 5, city: "武汉市", county: "蔡甸区", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "武汉市蔡甸区现代农业产业园（淡水养殖）", invest: 78.15, ci: 1.11, li: 5.58, ei: 0.13, fi: 0.0, contact: "肖婕", phone: "18888888888", sy: "2027年", ey: "2029年", builder: "蔡甸区农业农村局", bt: "新建", lng: 114.03525, lat: 30.59107, stage: "立项中", type: "水产" },
    { id: 6, city: "武汉市", county: "江夏区", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "武汉市江夏区现代农业产业园（生猪）", invest: 24.89, ci: 3.5, li: 20.39, ei: 0.0, fi: 0.0, contact: "王宏君", phone: "18888888888", sy: "2027年", ey: "2029年", builder: "江夏区农业农村局", bt: "新建", lng: 114.57157, lat: 30.38788, stage: "立项中", type: "畜牧" },
    { id: 7, city: "襄阳市", county: "谷城县", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "襄阳市谷城县现代农业产业园（禽蛋）", invest: 1.25, ci: 0.1, li: 0.55, ei: 0.0, fi: 0.0, contact: "万锐", phone: "18888888888", sy: "2028年", ey: "2030年", builder: "谷城县农业农村局", bt: "新建", lng: 111.64219, lat: 32.24983, stage: "立项中", type: "畜牧" },
    { id: 8, city: "宜昌市", county: "宜都市", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "宜昌市宜都市现代农业产业园项目（柑橘）", invest: 12.47, ci: 2.16, li: 9.31, ei: 0.0, fi: 0.0, contact: "覃爱华", phone: "18888888888", sy: "2028年", ey: "2030年", builder: "宜都市农业农村局", bt: "新建", lng: 111.43634, lat: 30.39699, stage: "立项中", type: "水果" },
    { id: 9, city: "宜昌市", county: "当阳市", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "宜昌市当阳市现代农业产业园项目（水稻＋生猪 ）", invest: 10.24, ci: 8.56, li: 1.68, ei: 0.0, fi: 0.0, contact: "杨国梁", phone: "18888888888", sy: "2028年", ey: "2030年", builder: "当阳市农业农村局", bt: "新建", lng: 111.78635, lat: 30.81563, stage: "立项中", type: "粮食" },
    { id: 10, city: "宜昌市", county: "秭归县", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "宜昌市秭归县现代农业产业园项目（脐橙）", invest: 19.25, ci: 2.82, li: 15.43, ei: 0.0, fi: 0.0, contact: "姜华", phone: "18888888888", sy: "2028年", ey: "2030年", builder: "秭归县农业农村局", bt: "新建", lng: 110.98107, lat: 30.82256, stage: "立项中", type: "水果" },
    { id: 11, city: "黄石市", county: "阳新县", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "黄石市阳新县现代农业产业园项目（水稻＋油菜）", invest: 18.83, ci: 2.2, li: 15.63, ei: 0.0, fi: 0.0, contact: "何中坚", phone: "18888888888", sy: "2027年", ey: "2029年", builder: "阳新县农业农村局", bt: "新建", lng: 115.21312, lat: 29.83199, stage: "立项中", type: "粮食" },
    { id: 12, city: "十堰市", county: "郧阳区", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "十堰市郧阳区现代农业产业园项目（香菇＋生猪）", invest: 21.96, ci: 3.35, li: 17.61, ei: 0.0, fi: 0.0, contact: "李华敏", phone: "18888888888", sy: "2028年", ey: "2030年", builder: "郧阳区农业农村局", bt: "新建", lng: 110.82133, lat: 32.841, stage: "立项中", type: "菌菇" },
    { id: 13, city: "十堰市", county: "丹江口市", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "十堰市丹江口市现代农业产业园项目（柑桔＋设施农业）", invest: 18.5, ci: 2.0, li: 15.5, ei: 0.0, fi: 0.0, contact: "郭元成", phone: "18888888888", sy: "2028年", ey: "2030年", builder: "丹江口市农业农村局", bt: "新建", lng: 111.50105, lat: 32.54801, stage: "立项中", type: "水果" },
    { id: 14, city: "荆州市", county: "监利市", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "荆州市监利市现代农业产业园项目（水稻）", invest: 4.0, ci: 0.0, li: 3.0, ei: 0.0, fi: 0.0, contact: "高万林", phone: "18888888888", sy: "2027年", ey: "2029年", builder: "监利市农业农村局", bt: "新建", lng: 112.87884, lat: 29.8377, stage: "立项中", type: "粮食" },
    { id: 15, city: "荆州市", county: "公安县", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "荆州市公安县现代农业产业园项目（油菜）", invest: 9.38, ci: 1.9, li: 6.48, ei: 0.0, fi: 0.0, contact: "罗顺", phone: "18888888888", sy: "2027年", ey: "2029年", builder: "公安县农业农村局", bt: "新建", lng: 112.25246, lat: 29.97947, stage: "实施中", type: "油料" },
    { id: 16, city: "荆门市", county: "掇刀区", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "荆门市掇刀区现代农业产业园项目（肉牛）", invest: 4.09, ci: 0.0, li: 3.09, ei: 0.0, fi: 0.0, contact: "何衍程", phone: "18888888888", sy: "2029年", ey: "2031年", builder: "掇刀区农业农村局", bt: "新建", lng: 112.20078, lat: 30.97242, stage: "立项中", type: "畜牧" },
    { id: 17, city: "荆门市", county: "屈家岭管理区", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "荆门市屈家岭区现代农业产业园项目（稻米+梅花鹿）", invest: 18.1, ci: 2.06, li: 15.04, ei: 0.0, fi: 0.0, contact: "陈思远", phone: "18888888888", sy: "2029年", ey: "2031年", builder: "荆门市屈家岭管理区管理委员会", bt: "新建", lng: 112.5511, lat: 31.01227, stage: "立项中", type: "混合" },
    { id: 18, city: "鄂州市", county: "鄂城区", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "鄂州市鄂城区现代农业产业园项目（淡水养殖）", invest: 3.0, ci: 2.0, li: 0.0, ei: 0.0, fi: 0.0, contact: "张露", phone: "18888888888", sy: "2026年", ey: "2028年", builder: "鄂州市鄂城区农业农村局", bt: "新建", lng: 114.87466, lat: 30.40276, stage: "实施中", type: "水产" },
    { id: 19, city: "孝感市", county: "孝昌县", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "孝感市孝昌县现代农业产业园项目（太子米）", invest: 3.0, ci: 0.0, li: 1.0, ei: 0.0, fi: 0.0, contact: "李亚舟", phone: "18888888888", sy: "2028年", ey: "2030年", builder: "孝昌县农业农村局", bt: "新建", lng: 114.01116, lat: 31.267, stage: "立项中", type: "粮食" },
    { id: 20, city: "黄冈市", county: "浠水县", cat1: "A.江汉平原高效优质农产品生产样板区建设重大专项", cat2: "A2.农业产业融合发展工程", cat3: "产业融合发展项目", prep: "C", name: "黄冈市浠水县现代农业产业园项目（蛋鸡+水稻）", invest: 20.58, ci: 3.6, li: 12.7, ei: 3.28, fi: 0.0, contact: "潘海峰", phone: "18888888888", sy: "2029年", ey: "2031年", builder: "浠水县农业农村局", bt: "新建", lng: 115.28828, lat: 30.45875, stage: "立项中", type: "混合" },
  ];

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
