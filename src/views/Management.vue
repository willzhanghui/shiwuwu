<template>
  <div class="management-layout">
    <el-container class="h-screen">
      <!-- Sidebar -->
      <el-aside width="220px" class="sidebar">
        <div class="logo">
          <div class="logo-icon">🌾</div>
          <div class="logo-text">
            <div class="main-text">湖北农业农村</div>
            <div class="sub-text">监测管理平台</div>
          </div>
        </div>
        <el-menu
          default-active="project"
          class="el-menu-vertical"
          background-color="#001529"
          text-color="rgba(255,255,255,0.65)"
          active-text-color="#fff"
          @select="handleMenuSelect"
        >
          <el-menu-item index="account">
            <el-icon><User /></el-icon>
            <span>账号管理</span>
          </el-menu-item>
          <el-menu-item index="project">
            <el-icon><List /></el-icon>
            <span>项目管理</span>
          </el-menu-item>
          <el-menu-item index="stats">
            <el-icon><PieChart /></el-icon>
            <span>项目统计</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- Header -->
        <el-header class="header">
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentMenuName }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-button type="primary" plain size="small" @click="$router.push('/')">一张图大屏</el-button>
            <el-dropdown>
              <div class="user-info">
                <el-avatar :size="32" class="bg-blue-500">管</el-avatar>
                <span class="username">系统管理员</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- Main Content -->
        <el-main class="main-content">
          <div v-if="activeMenu === 'project'">
            <div class="page-header">
              <div class="title-group">
                <h2 class="page-title">项目管理</h2>
                <p class="page-desc">湖北省"十五五"农业农村重大项目信息维护</p>
              </div>
              <el-button type="primary" @click="handleAddProject">＋ 新增项目</el-button>
            </div>

            <el-card class="filter-card">
              <el-form :inline="true" :model="filters" size="default">
                <el-form-item label="项目名称">
                  <el-input v-model="filters.name" placeholder="搜索项目名称" clearable @input="handleFilter" />
                </el-form-item>
                <el-form-item label="市州">
                  <el-select v-model="filters.city" placeholder="全部" clearable @change="handleFilter" style="width: 120px">
                    <el-option v-for="city in cities" :key="city" :label="city" :value="city" />
                  </el-select>
                </el-form-item>
                <el-form-item label="筹备分类">
                  <el-select v-model="filters.prep" placeholder="全部" clearable @change="handleFilter" style="width: 100px">
                    <el-option label="A类" value="A" />
                    <el-option label="B类" value="B" />
                    <el-option label="C类" value="C" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button @click="resetFilters">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>

            <el-card class="table-card">
              <el-table :data="pagedProjects" stripe style="width: 100%">
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column prop="name" label="项目名称" min-width="200" show-overflow-tooltip />
                <el-table-column prop="city" label="市州" width="100" />
                <el-table-column prop="county" label="县区" width="100" />
                <el-table-column prop="prep" label="筹备分类" width="100">
                  <template #default="scope">
                    <el-tag :type="getTagType(scope.row.prep)">{{ scope.row.prep }}类</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="invest" label="总投资(亿)" width="120" sortable />
                <el-table-column prop="stage" label="阶段" width="100" />
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="scope">
                    <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-wrap">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :total="filteredProjects.length"
                  layout="total, prev, pager, next"
                  @current-change="handlePageChange"
                />
              </div>
            </el-card>
          </div>

          <div v-else-if="activeMenu === 'account'">
            <div class="page-header">
              <div class="title-group">
                <h2 class="page-title">账号管理</h2>
                <p class="page-desc">管理平台用户账号与权限配置</p>
              </div>
              <el-button type="primary" @click="handleAddAccount">＋ 新增账号</el-button>
            </div>
            <el-card class="filter-card">
              <el-form :inline="true" :model="accFilters" size="default">
                <el-form-item label="搜索">
                  <el-input v-model="accFilters.query" placeholder="姓名/账号/手机号" clearable @input="handleAccFilter" />
                </el-form-item>
                <el-form-item label="部门">
                  <el-select v-model="accFilters.dept" placeholder="全部" clearable @change="handleAccFilter" style="width: 180px">
                    <el-option v-for="dept in depts" :key="dept" :label="dept" :value="dept" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button @click="resetAccFilters">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>
            <el-card class="table-card">
              <el-table :data="pagedAccounts" stripe style="width: 100%">
                <el-table-column prop="uname" label="账号名" width="120" />
                <el-table-column prop="name" label="姓名" width="100" />
                <el-table-column prop="phone" label="手机号" width="120" />
                <el-table-column prop="dept" label="部门" min-width="180" />
                <el-table-column prop="perms" label="菜单权限" show-overflow-tooltip />
                <el-table-column prop="status" label="状态" width="80">
                  <template #default="scope">
                    <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">{{ scope.row.status }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="created" label="创建时间" width="120" />
                <el-table-column label="操作" width="180" fixed="right">
                  <template #default="scope">
                    <el-button link type="primary" size="small" @click="handleEditAccount(scope.row)">编辑</el-button>
                    <el-button link type="warning" size="small">重置密码</el-button>
                    <el-button link type="danger" size="small" @click="handleDeleteAccount(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-wrap">
                <el-pagination
                  v-model:current-page="accCurrentPage"
                  v-model:page-size="accPageSize"
                  :total="filteredAccounts.length"
                  layout="total, prev, pager, next"
                  @current-change="handleAccPageChange"
                />
              </div>
            </el-card>
          </div>

          <div v-else-if="activeMenu === 'stats'">
            <div class="page-header">
              <div class="title-group">
                <h2 class="page-title">项目统计</h2>
                <p class="page-desc">多维度项目数量与投资规模统计</p>
              </div>
              <el-button type="default">📥 导出报表</el-button>
            </div>
            <el-row :gutter="20" class="mb-5">
              <el-col :span="6" v-for="stat in stats" :key="stat.label">
                <el-card shadow="hover" class="stat-card">
                  <div class="stat-value">{{ stat.value }}</div>
                  <div class="stat-label">{{ stat.label }}</div>
                </el-card>
              </el-col>
            </el-row>

            <el-tabs v-model="statTab" class="stat-tabs">
              <el-tab-pane label="按市州统计" name="city">
                <el-table :data="cityStatData" border stripe>
                  <el-table-column prop="name" label="市州" />
                  <el-table-column prop="count" label="项目数" sortable />
                  <el-table-column prop="invest" label="估算总投资(亿)" sortable />
                  <el-table-column prop="impl" label="实施中" />
                  <el-table-column prop="plan" label="立项中" />
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="按类别统计" name="cat">
                <el-empty description="类别统计数据加载中" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <!-- Project Dialog -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑项目' : '新增项目'" width="600px">
      <el-form :model="projectForm" label-width="100px">
        <el-form-item label="项目名称" required>
          <el-input v-model="projectForm.name" />
        </el-form-item>
        <el-form-item label="所在市州" required>
          <el-select v-model="projectForm.city" class="w-full">
            <el-option v-for="city in cities" :key="city" :label="city" :value="city" />
          </el-select>
        </el-form-item>
        <el-form-item label="总投资(亿)" required>
          <el-input-number v-model="projectForm.invest" :precision="2" :step="0.1" class="w-full" />
        </el-form-item>
        <el-form-item label="筹备分类" required>
          <el-radio-group v-model="projectForm.prep">
            <el-radio label="A">A类</el-radio>
            <el-radio label="B">B类</el-radio>
            <el-radio label="C">C类</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProject">保存</el-button>
      </template>
    </el-dialog>

    <!-- Account Dialog -->
    <el-dialog v-model="accDialogVisible" :title="isAccEdit ? '编辑账号' : '新增账号'" width="500px">
      <el-form :model="accForm" label-width="80px">
        <el-form-item label="账号名" required>
          <el-input v-model="accForm.uname" />
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="accForm.name" />
        </el-form-item>
        <el-form-item label="手机号" required>
          <el-input v-model="accForm.phone" />
        </el-form-item>
        <el-form-item label="部门" required>
          <el-select v-model="accForm.dept" class="w-full">
            <el-option v-for="dept in depts" :key="dept" :label="dept" :value="dept" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="accDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAccount">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { User, List, PieChart } from '@element-plus/icons-vue';
import { getProjects, getAccounts, getStats } from '../api';
import { ElMessage, ElMessageBox } from 'element-plus';

const activeMenu = ref('project');
const currentMenuName = computed(() => {
  const names: any = { project: '项目管理', account: '账号管理', stats: '项目统计' };
  return names[activeMenu.value];
});

const projects = ref<any[]>([]);
const accounts = ref<any[]>([]);
const filters = ref({ name: '', city: '', prep: '' });
const cities = ['武汉市', '襄阳市', '宜昌市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市'];
const depts = ['省厅规划财务处', '省厅农村经济处', '武汉市农业农村局', '襄阳市农业农村局', '宜昌市农业农村局'];

const currentPage = ref(1);
const pageSize = ref(10);

const statTab = ref('city');
const stats = ref([
  { label: '项目总数', value: '369' },
  { label: '投资总额(亿)', value: '5599.5' },
  { label: '覆盖市州', value: '17' },
  { label: '重大专项', value: '7' },
]);

const filteredProjects = computed(() => {
  return projects.value.filter(p => {
    return (!filters.value.name || p.name.includes(filters.value.name)) &&
           (!filters.value.city || p.city === filters.value.city) &&
           (!filters.value.prep || p.prep === filters.value.prep);
  });
});

const pagedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredProjects.value.slice(start, start + pageSize.value);
});

// Account Logic
const accFilters = ref({ query: '', dept: '' });
const accCurrentPage = ref(1);
const accPageSize = ref(10);

const filteredAccounts = computed(() => {
  return accounts.value.filter(a => {
    const q = accFilters.value.query.toLowerCase();
    return (!q || a.name.includes(q) || a.uname.includes(q) || a.phone.includes(q)) &&
           (!accFilters.value.dept || a.dept === accFilters.value.dept);
  });
});

const pagedAccounts = computed(() => {
  const start = (accCurrentPage.value - 1) * accPageSize.value;
  return filteredAccounts.value.slice(start, start + accPageSize.value);
});

const cityStatData = computed(() => {
  const map: any = {};
  projects.value.forEach(p => {
    if (!map[p.city]) map[p.city] = { name: p.city, count: 0, invest: 0, impl: 0, plan: 0 };
    map[p.city].count++;
    map[p.city].invest = parseFloat((map[p.city].invest + p.invest).toFixed(2));
    if (p.stage === '实施中') map[p.city].impl++;
    else map[p.city].plan++;
  });
  return Object.values(map).sort((a: any, b: any) => b.count - a.count);
});

onMounted(async () => {
  try {
    const [pjRes, accRes, statRes] = await Promise.all([
      getProjects(),
      getAccounts(),
      getStats()
    ]);
    projects.value = pjRes.data;
    accounts.value = accRes.data;
    const s = statRes.data;
    stats.value = [
      { label: '项目总数', value: s.totalProjects },
      { label: '投资总额(亿)', value: s.totalInvest },
      { label: '覆盖市州', value: s.cityCount },
      { label: '重大专项', value: s.categoryCount },
    ];
  } catch (e) {
    console.error(e);
  }
});

function handleMenuSelect(index: string) {
  activeMenu.value = index;
}

function handleFilter() {
  currentPage.value = 1;
}

function resetFilters() {
  filters.value = { name: '', city: '', prep: '' };
  handleFilter();
}

function handleAccFilter() {
  accCurrentPage.value = 1;
}

function resetAccFilters() {
  accFilters.value = { query: '', dept: '' };
  handleAccFilter();
}

function getTagType(prep: string) {
  if (prep === 'A') return 'success';
  if (prep === 'B') return 'primary';
  return 'warning';
}

function handlePageChange(page: number) {
  currentPage.value = page;
}

function handleAccPageChange(page: number) {
  accCurrentPage.value = page;
}

// Project Dialog
const dialogVisible = ref(false);
const isEdit = ref(false);
const projectForm = ref({ name: '', city: '', invest: 0, prep: 'C' });

function handleAddProject() {
  isEdit.value = false;
  projectForm.value = { name: '', city: '', invest: 0, prep: 'C' };
  dialogVisible.value = true;
}

function handleEdit(row: any) {
  isEdit.value = true;
  projectForm.value = { ...row };
  dialogVisible.value = true;
}

function handleDelete(row: any) {
  ElMessageBox.confirm(`确定要删除项目 "${row.name}" 吗？`, '提示', {
    type: 'warning',
  }).then(() => {
    projects.value = projects.value.filter(p => p.id !== row.id);
    ElMessage.success('删除成功');
  });
}

function saveProject() {
  if (isEdit.value) {
    const index = projects.value.findIndex(p => p.id === (projectForm.value as any).id);
    if (index > -1) projects.value[index] = { ...projectForm.value };
  } else {
    projects.value.unshift({ ...projectForm.value, id: Date.now(), stage: '立项中', county: '未指定' });
  }
  dialogVisible.value = false;
  ElMessage.success('保存成功');
}

// Account Dialog
const accDialogVisible = ref(false);
const isAccEdit = ref(false);
const accForm = ref({ uname: '', name: '', phone: '', dept: '', status: '启用' });

function handleAddAccount() {
  isAccEdit.value = false;
  accForm.value = { uname: '', name: '', phone: '', dept: '', status: '启用' };
  accDialogVisible.value = true;
}

function handleEditAccount(row: any) {
  isAccEdit.value = true;
  accForm.value = { ...row };
  accDialogVisible.value = true;
}

function handleDeleteAccount(row: any) {
  ElMessageBox.confirm(`确定要删除账号 "${row.uname}" 吗？`, '提示', {
    type: 'warning',
  }).then(() => {
    accounts.value = accounts.value.filter(a => a.id !== row.id);
    ElMessage.success('删除成功');
  });
}

function saveAccount() {
  if (isAccEdit.value) {
    const index = accounts.value.findIndex(a => a.id === (accForm.value as any).id);
    if (index > -1) accounts.value[index] = { ...accForm.value };
  } else {
    accounts.value.unshift({ ...accForm.value, id: Date.now(), created: new Date().toISOString().split('T')[0], perms: '项目管理' });
  }
  accDialogVisible.value = false;
  ElMessage.success('保存成功');
}
</script>

<style scoped>
.management-layout {
  background: #f0f2f5;
}

.sidebar {
  background: #001529;
  color: #fff;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 10px;
  background: #002140;
}

.logo-icon {
  font-size: 24px;
}

.logo-text .main-text {
  font-size: 14px;
  font-weight: bold;
}

.logo-text .sub-text {
  font-size: 10px;
  opacity: 0.6;
}

.header {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: #666;
}

.main-content {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.page-desc {
  font-size: 12px;
  color: #999;
  margin: 5px 0 0;
}

.filter-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination-wrap {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.stat-card {
  text-align: center;
  padding: 10px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.w-full {
  width: 100%;
}
</style>
