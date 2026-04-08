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
    { id: 1, city: "咸宁市", county: "赤壁市", cat1: "专项A", cat2: "工程1", cat3: "产业融合发展项目", prep: "C", name: "咸宁市赤壁市青砖茶国家现代农业产业园创建项目", invest: 18.0, builder: "赤壁市农业农村局", nature: "改建", lng: 113.88212, lat: 29.7383, desc: "建设青砖茶标准化生产基地，完善加工物流体系。" },
    { id: 2, city: "襄阳市", county: "枣阳市", cat1: "专项A", cat2: "工程2", cat3: "产业融合发展项目", prep: "A", name: "襄阳市枣阳市“枣阳皇桃”全产业链建设项目", invest: 15.0, builder: "枣阳市农业农村局", nature: "新建", lng: 112.795, lat: 32.14691, desc: "打造皇桃全产业链，提升品牌价值。" },
    { id: 3, city: "襄阳市", county: "枣阳市", cat1: "专项B", cat2: "工程1", cat3: "产业融合发展项目", prep: "A", name: "襄阳市枣阳市皇桃标准种植化示范基地项目", invest: 10.0, builder: "枣阳市农业农村局", nature: "新建", lng: 112.7591, lat: 32.13077, desc: "建设高标准皇桃种植示范区。" },
    { id: 4, city: "荆门市", county: "荆州区", cat1: "专项C", cat2: "工程3", cat3: "现代设施农业项目", prep: "A", name: "荆州市荆州区富硒葡萄与食用菌种植项目", invest: 4.3, builder: "河北财举农业发展有限公司", nature: "新建", lng: 112.1772, lat: 30.33693, desc: "富硒葡萄与食用菌规模化种植。" },
    { id: 5, city: "武汉市", county: "蔡甸区", cat1: "专项D", cat2: "工程2", cat3: "产业融合发展项目", prep: "D", name: "武汉市蔡甸区现代农业产业园（淡水养殖）", invest: 78.15, builder: "蔡甸区农业农村局", nature: "新建", lng: 114.03525, lat: 30.59107, desc: "淡水养殖现代化升级。" },
    { id: 6, city: "武汉市", county: "江夏区", cat1: "专项A", cat2: "工程2", cat3: "产业融合发展项目", prep: "C", name: "武汉市江夏区现代农业产业园（生猪）", invest: 24.89, builder: "江夏区农业农村局", nature: "新建", lng: 114.57157, lat: 30.38788, desc: "生猪养殖全产业链建设。" },
    { id: 7, city: "襄阳市", county: "谷城县", cat1: "专项E", cat2: "工程1", cat3: "产业融合发展项目", prep: "D", name: "襄阳市谷城县现代农业产业园（禽蛋）", invest: 1.25, builder: "谷城县农业农村局", nature: "新建", lng: 111.64219, lat: 32.24983, desc: "禽蛋深加工及物流配送。" },
    { id: 8, city: "宜昌市", county: "宜都市", cat1: "专项F", cat2: "工程2", cat3: "产业融合发展项目", prep: "C", name: "宜昌市宜都市现代农业产业园项目（柑橘）", invest: 12.47, builder: "宜都市农业农村局", nature: "新建", lng: 111.43634, lat: 30.39699, desc: "柑橘标准化生产基地建设。" },
    { id: 9, city: "宜昌市", county: "当阳市", cat1: "专项G", cat2: "工程3", cat3: "产业融合发展项目", prep: "B", name: "宜昌市当阳市现代农业产业园项目（水稻＋生猪 ）", invest: 10.24, builder: "当阳市农业农村局", nature: "新建", lng: 111.78635, lat: 30.81563, desc: "稻猪循环农业示范区。" },
    { id: 10, city: "宜昌市", county: "秭归县", cat1: "专项A", cat2: "工程1", cat3: "产业融合发展项目", prep: "D", name: "宜昌市秭归县现代农业产业园项目（脐橙）", invest: 19.25, builder: "秭归县农业农村局", nature: "新建", lng: 110.98107, lat: 30.82256, desc: "脐橙产业升级项目。" },
    { id: 11, city: "黄石市", county: "阳新县", cat1: "专项B", cat2: "工程2", cat3: "产业融合发展项目", prep: "C", name: "黄石市阳新县现代农业产业园项目（水稻＋油菜）", invest: 18.83, builder: "阳新县农业农村局", nature: "新建", lng: 115.21312, lat: 29.83199, desc: "粮油规模化生产基地。" },
    { id: 12, city: "十堰市", county: "郧阳区", cat1: "专项C", cat2: "工程3", cat3: "产业融合发展项目", prep: "D", name: "十堰市郧阳区现代农业产业园项目（香菇＋生猪）", invest: 21.96, builder: "郧阳区农业农村局", nature: "新建", lng: 110.82133, lat: 32.841, desc: "香菇生猪循环产业园。" },
    { id: 13, city: "十堰市", county: "丹江口市", cat1: "专项D", cat2: "工程1", cat3: "产业融合发展项目", prep: "C", name: "十堰市丹江口市现代农业产业园项目（柑桔＋设施农业）", invest: 18.5, builder: "丹江口市农业农村局", nature: "新建", lng: 111.50105, lat: 32.54801, desc: "柑桔设施农业示范区。" },
    { id: 14, city: "荆州市", county: "监利市", cat1: "专项E", cat2: "工程2", cat3: "产业融合发展项目", prep: "C", name: "荆州市监利市现代农业产业园项目（水稻）", invest: 4.0, builder: "监利市农业农村局", nature: "新建", lng: 112.87884, lat: 29.8377, desc: "优质水稻生产基地。" },
    { id: 15, city: "荆州市", county: "公安县", cat1: "专项F", cat2: "工程3", cat3: "产业融合发展项目", prep: "B", name: "荆州市公安县现代农业产业园项目（油菜）", invest: 9.38, builder: "公安县农业农村局", nature: "新建", lng: 112.25246, lat: 29.97947, desc: "油菜全产业链提升。" },
    { id: 16, city: "荆门市", county: "掇刀区", cat1: "专项G", cat2: "工程1", cat3: "产业融合发展项目", prep: "D", name: "荆门市掇刀区现代农业产业园项目（肉牛）", invest: 4.09, builder: "掇刀区农业农村局", nature: "新建", lng: 112.20078, lat: 30.97242, desc: "肉牛养殖加工一体化。" },
    { id: 17, city: "荆门市", county: "屈家岭管理区", cat1: "专项A", cat2: "工程2", cat3: "产业融合发展项目", prep: "C", name: "荆门市屈家岭区现代农业产业园项目（稻米+梅花鹿）", invest: 18.1, builder: "荆门市屈家岭管理区管理委员会", nature: "新建", lng: 112.5511, lat: 31.01227, desc: "特色稻米与梅花鹿养殖。" },
    { id: 18, city: "鄂州市", county: "鄂城区", cat1: "专项B", cat2: "工程3", cat3: "产业融合发展项目", prep: "C", name: "鄂州市鄂城区现代农业产业园项目（淡水养殖）", invest: 3.0, builder: "鄂州市鄂城区农业农村局", nature: "新建", lng: 114.87466, lat: 30.40276, desc: "现代化淡水养殖基地。" },
    { id: 19, city: "孝感市", county: "孝昌县", cat1: "专项C", cat2: "工程1", cat3: "产业融合发展项目", prep: "D", name: "孝感市孝昌县现代农业产业园项目（太子米）", invest: 3.0, builder: "孝昌县农业农村局", nature: "新建", lng: 114.01116, lat: 31.267, desc: "太子米品牌提升项目。" },
    { id: 20, city: "黄冈市", county: "浠水县", cat1: "专项D", cat2: "工程2", cat3: "产业融合发展项目", prep: "C", name: "黄冈市浠水县现代农业产业园项目（蛋鸡+水稻）", invest: 20.58, builder: "浠水县农业农村局", nature: "新建", lng: 115.28828, lat: 30.45875, desc: "蛋鸡水稻循环农业。" },
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
