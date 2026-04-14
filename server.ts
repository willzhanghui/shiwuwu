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

  // Real Three-Level Project Categories
  const categoryData = [
    {
      cat1: "江汉平原高效优质农产品生产样板区建设重大专项",
      cat2List: [
        { name: "A1.粮油等重要农产品产能提升工程", cat3List: ["高标准农田建设项目", "粮食环保基地建设项目", "优质稻产能提升工程项目", "油菜单产提升工程项目", "玉米单产提升工程项目", "大豆单产提升工程项目"] },
        { name: "A2.农业产业融合发展工程", cat3List: ["产业融合发展项目"] },
        { name: "A3.农业科技装备支撑工程", cat3List: ["现代设施农业项目", "农业科技创新能力条件建设项目", "种养业良种工程项目", "现代种业提升工程项目", "数字农业建设试点项目"] },
        { name: "A4.农业发展绿色转型工程", cat3List: ["长江经济带农业面源污染治理", "长江生物多样性保护工程项目", "农村人居环境整治"] }
      ]
    },
    {
      cat1: "粮食增产和农业综合生产能力提升重大专项",
      cat2List: [
        { name: "B1.重要农产品供保基地建设工程", cat3List: ["草原畜牧业转型升级试点项目", "生猪规模化养殖场建设补助项目", "蔬菜供保基地建设项目", "肉蛋奶供保基地建设项目", "优质农产品供保基地建设项目", "水产品供保基地建设项目"] },
        { name: "B2.高标准农田与耕地质量提升工程", cat3List: ["高标准农田建设项目", "盐碱地综合利用", "耕地质量提升项目"] },
        { name: "B3.粮油产能提质与结构优化工程", cat3List: ["大豆单产提升工程项目", "玉米单产提升工程项目", "油菜单产提升工程项目", "花生单产提升工程项目"] },
        { name: "B4.农业绿色低碳转型工程", cat3List: ["重点流域农业面源污染治理"] },
        { name: "B5.农业防灾控害设施提升工程", cat3List: ["动植物保护能力提升工程"] }
      ]
    },
    {
      cat1: "农业产业振兴和产业融合发展重大专项",
      cat2List: [
        { name: "C1.农产品精深加工升级工程", cat3List: ["农产品精深加工升级项目"] },
        { name: "C2.农业品牌培育与市场拓展工程", cat3List: ["产业融合发展项目"] },
        { name: "C3.农业产业融合发展工程", cat3List: ["产业融合发展项目"] },
        { name: "C4.农村电子商务发展工程", cat3List: ["产业融合发展项目"] }
      ]
    },
    {
      cat1: "农业科技创新和农业新质生产力培育重大专项",
      cat2List: [
        { name: "D1.智慧农业应用场景建设工程", cat3List: ["数字农业建设试点项目"] },
        { name: "D2.农机装备产业转型升级工程", cat3List: ["现代设施农业项目"] },
        { name: "D3.科研成果转化应用平台建设工程", cat3List: ["农业科技创新能力条件建设项目"] },
        { name: "D4.农业种质资源保护利用工程", cat3List: ["种养业良种工程项目"] },
        { name: "D5.良种繁育基地现代化提升工程", cat3List: ["现代种业提升工程项目", "农业野生植物原生境保护点建设项目"] }
      ]
    },
    {
      cat1: "常态化防返贫致贫和强农富农重大专项",
      cat2List: [
        { name: "E.产业帮扶与就业帮扶提质工程", cat3List: ["产业帮扶与就业帮扶提质项目"] }
      ]
    },
    {
      cat1: "城乡融合发展与宜居宜业和美乡村建设重大专项",
      cat2List: [
        { name: "F1.片区化推进和美乡村建设工程", cat3List: ["片区化推进和美乡村建设项目"] },
        { name: "F2.农村基础设施提档升级工程", cat3List: ["农村基础设施提档升级项目"] },
        { name: "F3.农村人居环境整治提升工程", cat3List: ["农村人居环境整治"] },
        { name: "F4.乡村治理提升工程", cat3List: ["乡村治理提升项目"] }
      ]
    },
    {
      cat1: "全面深化改革和保障机制建设重大专项",
      cat2List: [
        { name: "G1.农业生产社会服务体系建设工程", cat3List: ["农业生产社会服务体系建设项目"] },
        { name: "G2.新型农业经营主体培育工程", cat3List: ["新型农业经营主体培育项目"] }
      ]
    }
  ];

  const projects: any[] = [];
  const totalProjectCount = 369;
  const preps = ["A", "B", "C", "D"];
  const stages = ["谋划", "立项", "实施", "竣工", "验收"];
  const natures = ["新建", "改建", "扩建"];

  for (let i = 1; i <= totalProjectCount; i++) {
    const cityObj = cities[Math.floor(Math.random() * cities.length)];
    const lng = cityObj.coords[0] + (Math.random() - 0.5) * 0.5;
    const lat = cityObj.coords[1] + (Math.random() - 0.5) * 0.5;
    
    const cat1Obj = categoryData[Math.floor(Math.random() * categoryData.length)];
    const cat2Obj = cat1Obj.cat2List[Math.floor(Math.random() * cat1Obj.cat2List.length)];
    const cat3 = cat2Obj.cat3List[Math.floor(Math.random() * cat2Obj.cat3List.length)];

    projects.push({
      id: i,
      city: cityObj.name,
      province: "湖北省",
      county: cityObj.name.replace(/[市州]/, "") + "某区",
      cat1: cat1Obj.cat1,
      cat2: cat2Obj.name,
      cat3: cat3,
      prep: preps[Math.floor(Math.random() * preps.length)],
      stage: stages[Math.floor(Math.random() * stages.length)],
      name: `${cityObj.name}${cat3.replace("项目", "")}建设工程`,
      invest: parseFloat((Math.random() * 50 + 5).toFixed(1)),
      investCentral: parseFloat((Math.random() * 10).toFixed(1)),
      investLocal: parseFloat((Math.random() * 10).toFixed(1)),
      investSelf: parseFloat((Math.random() * 20).toFixed(1)),
      investFinance: parseFloat((Math.random() * 10).toFixed(1)),
      startYear: "2026",
      endYear: "2028",
      builder: cityObj.name + "农业农村局",
      dept: "规划财务处",
      contact: "张经理",
      phone: "13800138000",
      nature: natures[Math.floor(Math.random() * natures.length)],
      cropType: "无",
      paidAmount: parseFloat((Math.random() * 5).toFixed(1)),
      lng: parseFloat(lng.toFixed(5)),
      lat: parseFloat(lat.toFixed(5)),
      content: "该项目旨在提升当地农业现代化水平，促进产业融合发展。"
    });
  }

  const accounts = [
    { id: 1, uname: "admin_hb", name: "张伟", phone: "13800138001", email: "zhangwei@hubei.gov.cn", dept: "省厅规划财务处", perms: "全部权限", status: "启用", created: "2025-01-15" },
    { id: 2, uname: "wh_proj", name: "李娜", phone: "13700137001", email: "lina@wuhan.gov.cn", dept: "武汉市农业农村局", perms: "项目管理、项目统计、大屏", status: "启用", created: "2025-02-20" },
    { id: 3, uname: "xg_proj", name: "王磊", phone: "13600136001", email: "wanglei@xiaogan.gov.cn", dept: "孝感市农业农村局", perms: "项目管理", status: "启用", created: "2025-03-01" },
    { id: 4, uname: "viewer_01", name: "陈晓", phone: "13500135001", email: "chenxiao@hubei.gov.cn", dept: "省厅种植业管理处", perms: "项目统计、项目分析", status: "启用", created: "2025-03-10" },
    { id: 5, uname: "admin_02", name: "刘芳", phone: "13400134001", email: "liufang@hubei.gov.cn", dept: "省厅科技教育处", perms: "项目管理、账号管理", status: "启用", created: "2025-04-01" },
  ];

  const buildingProjects: any[] = [
    {
      id: 1,
      source: "相关专项2024年",
      nature: "新建",
      name: "宜昌市夷陵区畜禽粪污资源化利用整县推进项目",
      scale: "整县推进畜禽粪污资源化利用",
      location: "宜昌市夷陵区",
      startYear: "2024",
      endYear: "2025",
      totalInvest: 9459.00,
      centralInvest: 4000.00,
      localInvest: 0,
      selfInvest: 5459.00,
      currentCentral: 8150.00,
      currentLocal: 0,
      content: "土建工程/仪器设备购置",
      unit: "宜昌市夷陵区农业农村局",
      supervisor: "宜昌市农业农村局-王某某",
      fundMethod: "直接投资",
      paidAmount: 1500.00,
      completionRate: 45,
      isAccepted: false,
      remark: "本次下达中央投资150万元，自筹资金4556万元"
    },
    {
      id: 2,
      source: "相关专项2024年",
      nature: "新建",
      name: "宜昌市点军区畜禽粪污资源化利用整县推进项目",
      scale: "整县推进畜禽粪污资源化利用",
      location: "宜昌市点军区",
      startYear: "2024",
      endYear: "2025",
      totalInvest: 10115.00,
      centralInvest: 2000.00,
      localInvest: 0,
      selfInvest: 8115.00,
      currentCentral: 8115.00,
      currentLocal: 0,
      content: "土建工程/仪器设备购置",
      unit: "宜昌市点军区农业农村局",
      supervisor: "宜昌市农业农村局-王某某",
      fundMethod: "直接投资",
      paidAmount: 2000.00,
      completionRate: 60,
      isAccepted: false,
      remark: "本次下达中央投资500万元，自筹资金750万元"
    },
    {
      id: 3,
      source: "相关专项2024年",
      nature: "新建",
      name: "荆门市东宝区畜禽粪污资源化利用整县推进项目",
      scale: "整县推进畜禽粪污资源化利用",
      location: "荆门市东宝区",
      startYear: "2024",
      endYear: "2025",
      totalInvest: 6537.00,
      centralInvest: 3103.00,
      localInvest: 0,
      selfInvest: 3434.00,
      currentCentral: 3434.00,
      currentLocal: 0,
      content: "土建工程/仪器设备购置",
      unit: "荆门市东宝区农业农村局",
      supervisor: "荆门市农业农村局-孙某某",
      fundMethod: "直接投资",
      remark: "本次下达中央投资1500万元，自筹资金1934万元"
    },
    {
      id: 4,
      source: "相关专项2024年",
      nature: "新建",
      name: "丹江口市2024年畜禽粪污资源化利用整县推进项目",
      scale: "整县推进畜禽粪污资源化利用",
      location: "丹江口市",
      startYear: "2024",
      endYear: "2025",
      totalInvest: 5514.00,
      centralInvest: 2100.00,
      localInvest: 0,
      selfInvest: 3414.00,
      currentCentral: 3414.00,
      currentLocal: 0,
      content: "土建工程/仪器设备购置",
      unit: "丹江口市农业农村局",
      supervisor: "十堰市农业农村局-孙某某",
      fundMethod: "直接投资",
      remark: "本次下达中央投资1400万元，自筹资金2014万元"
    },
    {
      id: 5,
      source: "生态保护专项2024年",
      nature: "新建",
      name: "武汉市江夏区农业面源污染综合治理项目",
      scale: "建设50亩试验基地、1轨、2无人机、1基站、2视频监控、1气象站",
      location: "武汉市江夏区",
      startYear: "2024",
      endYear: "2025",
      totalInvest: 5881.00,
      centralInvest: 3000.00,
      localInvest: 280.00,
      selfInvest: 2601.00,
      currentCentral: 4429.00,
      currentLocal: 0,
      content: "面源污染治理设施、购置安装设备等",
      unit: "武汉市江夏区农业农村局",
      supervisor: "武汉市农业农村局-孙某某",
      fundMethod: "直接投资",
      remark: "本次下达中央投资1500万元，地方投资280万元"
    },
    {
      id: 6,
      source: "相关专项2025年",
      nature: "新建",
      name: "随州市曾都区现代种业提升工程项目",
      scale: "建设良种繁育基地1000亩",
      location: "随州市曾都区",
      startYear: "2025",
      endYear: "2026",
      totalInvest: 2600.00,
      centralInvest: 1000.00,
      localInvest: 0,
      selfInvest: 1600.00,
      currentCentral: 2600.00,
      currentLocal: 1600.00,
      content: "土建工程/仪器设备购置",
      unit: "湖北省神农种业科技股份有限公司",
      supervisor: "湖北省农业农村厅种业管理处",
      fundMethod: "直接投资",
      remark: "本次下达中央投资1000万元，自筹资金1600万元"
    },
    {
      id: 7,
      source: "相关专项2025年",
      nature: "新建",
      name: "2025年国家级湖北省神农架中药材种质资源库（省级）建设项目",
      scale: "建设中药材种质资源库1座",
      location: "神农架林区",
      startYear: "2025",
      endYear: "2026",
      totalInvest: 5625.00,
      centralInvest: 4500.00,
      localInvest: 1125.00,
      selfInvest: 0,
      currentCentral: 5625.00,
      currentLocal: 4500.00,
      content: "土建工程/仪器设备购置",
      unit: "湖北省种子集团有限公司",
      supervisor: "湖北省农业农村厅种业管理处",
      fundMethod: "直接投资",
      remark: "本次下达中央投资4500万元，地方投资1125万元"
    },
    {
      id: 8,
      source: "相关专项2025年",
      nature: "新建",
      name: "2025年湖北省荆州市合丰种业广适性高产优质水稻品种研发中心建设项目",
      scale: "建设研发中心1座",
      location: "荆州市",
      startYear: "2025",
      endYear: "2026",
      totalInvest: 1425.00,
      centralInvest: 500.00,
      localInvest: 0,
      selfInvest: 925.00,
      currentCentral: 1425.00,
      currentLocal: 500.00,
      content: "土建工程/仪器设备购置",
      unit: "荆州市合丰种业有限公司",
      supervisor: "湖北省农业农村厅种业管理处",
      fundMethod: "直接投资",
      remark: "本次下达中央投资500万元，自筹资金925万元"
    },
    {
      id: 9,
      source: "农业专项2024年",
      nature: "新建",
      name: "湖北省咸宁市咸安区高标准农田建设试点项目",
      scale: "建设高标准农田2万亩",
      location: "咸宁市咸安区",
      startYear: "2024",
      endYear: "2025",
      totalInvest: 6000.00,
      centralInvest: 4000.00,
      localInvest: 1000.00,
      selfInvest: 1000.00,
      currentCentral: 5000.00,
      currentLocal: 4000.00,
      content: "土地平整/灌溉与排水工程",
      unit: "咸宁市咸安区农业农村局",
      supervisor: "咸宁市农业农村局-陈某某",
      fundMethod: "投资补助",
      remark: ""
    },
    {
      id: 10,
      source: "农业专项2024年",
      nature: "新建",
      name: "湖北省荆门市钟祥市高标准农田建设项目",
      scale: "建设高标准农田3.5万亩",
      location: "钟祥市",
      startYear: "2024",
      endYear: "2025",
      totalInvest: 10500.00,
      centralInvest: 7000.00,
      localInvest: 1500.00,
      selfInvest: 2000.00,
      currentCentral: 8500.00,
      currentLocal: 7000.00,
      content: "土地平整/灌溉与排水/田间道路",
      unit: "钟祥市农业农村局",
      supervisor: "荆门市农业农村局-李某某",
      fundMethod: "投资补助",
      remark: ""
    },
    {
      id: 11,
      source: "相关专项2024年",
      nature: "新建",
      name: "湖北省黄冈市蕲春县中药材产业融合发展项目",
      scale: "建设中药材加工车间及配套设施",
      location: "蕲春县",
      startYear: "2024",
      endYear: "2026",
      totalInvest: 4500.00,
      centralInvest: 1500.00,
      localInvest: 500.00,
      selfInvest: 2500.00,
      currentCentral: 2000.00,
      currentLocal: 1500.00,
      content: "厂房建设/设备购置",
      unit: "蕲春县农业农村局",
      supervisor: "黄冈市农业农村局-王某某",
      fundMethod: "直接投资",
      remark: ""
    },
    {
      id: 12,
      source: "生态保护专项2025年",
      nature: "新建",
      name: "湖北省十堰市丹江口库区农业面源污染治理项目",
      scale: "库区周边农田面源污染综合治理",
      location: "丹江口市",
      startYear: "2025",
      endYear: "2027",
      totalInvest: 8200.00,
      centralInvest: 5000.00,
      localInvest: 1200.00,
      selfInvest: 2000.00,
      currentCentral: 6200.00,
      currentLocal: 5000.00,
      content: "生态拦截沟渠/缓冲带建设",
      unit: "丹江口市农业农村局",
      supervisor: "十堰市农业农村局-张某某",
      fundMethod: "直接投资",
      remark: ""
    },
    {
      id: 13,
      source: "农业专项2024年",
      nature: "新建",
      name: "湖北省孝感市汉川市设施蔬菜基地建设项目",
      scale: "建设高标准蔬菜大棚500亩",
      location: "汉川市",
      startYear: "2024",
      endYear: "2025",
      totalInvest: 3500.00,
      centralInvest: 1200.00,
      localInvest: 800.00,
      selfInvest: 1500.00,
      currentCentral: 2000.00,
      currentLocal: 1200.00,
      content: "大棚骨架/灌溉系统/冷链物流",
      unit: "汉川市农业农村局",
      supervisor: "孝感市农业农村局-刘某某",
      fundMethod: "投资补助",
      remark: ""
    },
    {
      id: 14,
      source: "相关专项2024年",
      nature: "改建",
      name: "湖北省恩施州利川市高山蔬菜产业园升级项目",
      scale: "原有产业园设施改造升级",
      location: "利川市",
      startYear: "2024",
      endYear: "2025",
      totalInvest: 2800.00,
      centralInvest: 1000.00,
      localInvest: 500.00,
      selfInvest: 1300.00,
      currentCentral: 1500.00,
      currentLocal: 1000.00,
      content: "道路硬化/排灌设施更新",
      unit: "利川市农业农村局",
      supervisor: "恩施州农业农村局-向某某",
      fundMethod: "投资补助",
      remark: ""
    },
    {
      id: 15,
      source: "农业专项2025年",
      nature: "新建",
      name: "湖北省襄阳市宜城市现代设施渔业建设项目",
      scale: "建设工厂化循环水养殖车间",
      location: "宜城市",
      startYear: "2025",
      endYear: "2026",
      totalInvest: 5200.00,
      centralInvest: 2000.00,
      localInvest: 1000.00,
      selfInvest: 2200.00,
      currentCentral: 3000.00,
      currentLocal: 2000.00,
      content: "循环水处理系统/养殖池建设",
      unit: "宜城市农业农村局",
      supervisor: "襄阳市农业农村局-郭某某",
      fundMethod: "直接投资",
      remark: ""
    },
    {
      id: 16,
      source: "生态保护专项2024年",
      nature: "新建",
      name: "丹江口市2024年农业面源污染综合治理项目",
      scale: "建设面源污染治理设施",
      location: "丹江口市",
      startYear: "2024",
      endYear: "2025",
      totalInvest: 5601.00,
      centralInvest: 3000.00,
      localInvest: 280.00,
      selfInvest: 2321.00,
      currentCentral: 4201.00,
      currentLocal: 0,
      content: "面源污染治理设施、购置安装设备等",
      unit: "丹江口市农业农村局",
      supervisor: "十堰市农业农村局-孙某某",
      fundMethod: "直接投资",
      remark: ""
    },
    {
      id: 17,
      source: "农业专项2024年",
      nature: "新建",
      name: "湖北省荆州市江陵县高标准农田建设项目",
      scale: "建设高标准农田2.5万亩",
      location: "江陵县",
      startYear: "2024",
      endYear: "2025",
      totalInvest: 5829.00,
      centralInvest: 5000.00,
      localInvest: 829.00,
      selfInvest: 0,
      currentCentral: 2800.00,
      currentLocal: 0,
      content: "土地平整/灌溉与排水/田间道路",
      unit: "江陵县农业农村局",
      supervisor: "荆州市农业农村局-孙某某",
      fundMethod: "投资补助",
      remark: ""
    },
    {
      id: 18,
      source: "相关专项2024年",
      nature: "新建",
      name: "湖北省黄冈市麻城市中药材产业融合发展项目",
      scale: "建设中药材加工中心",
      location: "麻城市",
      startYear: "2024",
      endYear: "2026",
      totalInvest: 8000.00,
      centralInvest: 3000.00,
      localInvest: 1000.00,
      selfInvest: 4000.00,
      currentCentral: 4000.00,
      currentLocal: 0,
      content: "厂房建设/设备购置",
      unit: "麻城市农业农村局",
      supervisor: "黄冈市农业农村局-王某某",
      fundMethod: "直接投资",
      remark: ""
    },
    {
      id: 19,
      source: "农业专项2024年",
      nature: "新建",
      name: "湖北省咸宁市赤壁市高标准农田建设项目",
      scale: "建设高标准农田4万亩",
      location: "赤壁市",
      startYear: "2024",
      endYear: "2025",
      totalInvest: 12118.00,
      centralInvest: 8000.00,
      localInvest: 1500.00,
      selfInvest: 2618.00,
      currentCentral: 5000.00,
      currentLocal: 0,
      content: "土地平整/灌溉与排水/田间道路",
      unit: "赤壁市农业农村局",
      supervisor: "咸宁市农业农村局-陈某某",
      fundMethod: "投资补助",
      remark: ""
    },
    {
      id: 20,
      source: "相关专项2024年",
      nature: "新建",
      name: "湖北省宜昌市当阳市现代设施农业建设项目",
      scale: "建设高标准设施蔬菜基地",
      location: "当阳市",
      startYear: "2024",
      endYear: "2026",
      totalInvest: 6000.00,
      centralInvest: 2000.00,
      localInvest: 1000.00,
      selfInvest: 3000.00,
      currentCentral: 3000.00,
      currentLocal: 0,
      content: "设施大棚/喷滴灌系统",
      unit: "当阳市农业农村局",
      supervisor: "宜昌市农业农村局-王某某",
      fundMethod: "直接投资",
      remark: ""
    }
  ];

  // API Routes
  app.get("/api/projects", (req, res) => {
    res.json(projects);
  });

  app.get("/api/accounts", (req, res) => {
    res.json(accounts);
  });

  app.get("/api/building-projects", (req, res) => {
    res.json(buildingProjects);
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
