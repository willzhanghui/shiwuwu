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
          <el-sub-menu index="155-project">
            <template #title>
              <el-icon><Folder /></el-icon>
              <span>十五五项目管理</span>
            </template>
            <el-menu-item index="project">
              <el-icon><List /></el-icon>
              <span>项目管理</span>
            </el-menu-item>
            <el-menu-item index="stats">
              <el-icon><PieChart /></el-icon>
              <span>项目统计</span>
            </el-menu-item>
            <el-menu-item index="analysis">
              <el-icon><DataAnalysis /></el-icon>
              <span>项目分析</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="building-project">
            <template #title>
              <el-icon><Box /></el-icon>
              <span>在建项目管理</span>
            </template>
            <el-menu-item index="c-project">
              <el-icon><List /></el-icon>
              <span>项目管理</span>
            </el-menu-item>
            <el-menu-item index="c-stats">
              <el-icon><PieChart /></el-icon>
              <span>项目统计</span>
            </el-menu-item>
            <el-menu-item index="c-analysis">
              <el-icon><DataAnalysis /></el-icon>
              <span>项目分析</span>
            </el-menu-item>
          </el-sub-menu>
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
              <div class="flex gap-2">
                <el-button type="success" plain @click="triggerImport">📥 导入Excel</el-button>
                <el-button type="primary" @click="handleAddProject">＋ 新增项目</el-button>
              </div>
              <input type="file" ref="excelInput" class="hidden" accept=".xlsx, .xls" @change="handleImport" />
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
                <el-table 
                  :data="catStatData" 
                  border 
                  :span-method="objectSpanMethod"
                  :row-class-name="tableRowClassName"
                  class="stat-table"
                >
                  <el-table-column prop="cat1" label="重大专项类别" min-width="200" />
                  <el-table-column prop="cat2" label="重大工程类别" min-width="200" />
                  <el-table-column prop="cat3" label="重大项目类别" min-width="200" />
                  <el-table-column prop="count" label="项目个数（个）" width="150" align="center" />
                  <el-table-column prop="invest" label="预算投资规模（亿元）" width="180" align="center">
                    <template #default="scope">
                      {{ scope.row.invest.toFixed(3) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="avgInvest" label="平均投资额（亿元）" width="180" align="center">
                    <template #default="scope">
                      {{ scope.row.avgInvest.toFixed(3) }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>

          <div v-else-if="activeMenu === 'analysis'">
            <div class="page-header">
              <div class="title-group">
                <h2 class="page-title">项目分析</h2>
                <p class="page-desc">十五五项目多维度可视化分析</p>
              </div>
            </div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card shadow="hover" header="各市州项目分布 (数量)">
                  <div id="city-count-chart" style="height: 400px;"></div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card shadow="hover" header="各市州投资规模 (亿元)">
                  <div id="city-invest-chart" style="height: 400px;"></div>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="mt-5">
              <el-col :span="12">
                <el-card shadow="hover" header="重大专项类别分布">
                  <div id="cat-pie-chart" style="height: 400px;"></div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card shadow="hover" header="项目状态占比">
                  <div id="status-pie-chart" style="height: 400px;"></div>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <div v-else-if="activeMenu === 'c-project'">
            <div class="page-header">
              <div class="title-group">
                <h2 class="page-title">在建项目管理</h2>
                <p class="page-desc">湖北省在建农业农村重大项目信息维护</p>
              </div>
              <div class="flex gap-2">
                <el-button type="success" plain @click="triggerBuildingImport">📥 导入Excel</el-button>
                <el-button type="primary" @click="handleAddBuildingProject">＋ 新增项目</el-button>
              </div>
              <input type="file" ref="buildingExcelInput" class="hidden" accept=".xlsx, .xls" @change="handleBuildingImport" />
            </div>

            <el-card class="filter-card">
              <el-form :inline="true" :model="buildingFilters" size="default">
                <el-form-item label="项目名称">
                  <el-input v-model="buildingFilters.name" placeholder="搜索项目名称" clearable @input="handleBuildingFilter" />
                </el-form-item>
                <el-form-item label="项目来源">
                  <el-input v-model="buildingFilters.source" placeholder="搜索项目来源" clearable @input="handleBuildingFilter" />
                </el-form-item>
                <el-form-item label="建设地点">
                  <el-input v-model="buildingFilters.location" placeholder="搜索建设地点" clearable @input="handleBuildingFilter" />
                </el-form-item>
                <el-form-item>
                  <el-button @click="resetBuildingFilters">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>

            <el-card class="table-card">
              <el-table :data="pagedBuildingProjects" stripe border style="width: 100%" height="600">
                <el-table-column type="index" label="序号" width="60" fixed />
                <el-table-column prop="name" label="项目名称" min-width="250" fixed show-overflow-tooltip />
                <el-table-column prop="source" label="项目来源" width="150" show-overflow-tooltip />
                <el-table-column prop="nature" label="建设性质" width="100" />
                <el-table-column prop="scale" label="建设规模" width="200" show-overflow-tooltip />
                <el-table-column prop="location" label="建设地点" width="150" show-overflow-tooltip />
                <el-table-column label="建设年限" width="120" align="center">
                  <template #default="scope">
                    {{ scope.row.startYear }}-{{ scope.row.endYear }}
                  </template>
                </el-table-column>
                <el-table-column prop="totalInvest" label="投资合计(万)" width="120" sortable align="right">
                  <template #default="scope">
                    <span class="mono-font">{{ formatNumber(scope.row.totalInvest) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="centralInvest" label="中央投资(万)" width="120" align="right">
                  <template #default="scope">
                    <span class="mono-font">{{ formatNumber(scope.row.centralInvest) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="localInvest" label="地方投资(万)" width="120" align="right">
                  <template #default="scope">
                    <span class="mono-font">{{ formatNumber(scope.row.localInvest) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="selfInvest" label="其他投资(万)" width="120" align="right">
                  <template #default="scope">
                    <span class="mono-font">{{ formatNumber(scope.row.selfInvest) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="currentCentral" label="本次下达(万)" width="120" align="right">
                  <template #default="scope">
                    <span class="mono-font">{{ formatNumber(scope.row.currentCentral) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="content" label="建设内容" width="200" show-overflow-tooltip />
                <el-table-column prop="unit" label="项目单位" width="200" show-overflow-tooltip />
                <el-table-column prop="supervisor" label="监管单位" width="180" show-overflow-tooltip />
                <el-table-column prop="fundMethod" label="资金投向" width="120" />
                <el-table-column prop="remark" label="备注" width="200" show-overflow-tooltip />
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="scope">
                    <el-button link type="primary" size="small" @click="handleEditBuildingProject(scope.row)">编辑</el-button>
                    <el-button link type="danger" size="small" @click="handleDeleteBuildingProject(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-wrap">
                <el-pagination
                  v-model:current-page="buildingCurrentPage"
                  v-model:page-size="buildingPageSize"
                  :total="filteredBuildingProjects.length"
                  layout="total, prev, pager, next"
                  @current-change="handleBuildingPageChange"
                />
              </div>
            </el-card>
          </div>

            <div v-else-if="activeMenu === 'c-stats'">
            <div class="page-header">
              <div class="title-group">
                <h2 class="page-title">在建项目统计</h2>
                <p class="page-desc">湖北省2023-2025年农业农村专项资金拨付使用情况汇总</p>
              </div>
              <el-button type="default">📥 导出报表</el-button>
            </div>

            <!-- Summary Cards -->
            <el-row :gutter="20" class="mb-6">
              <el-col :span="6">
                <el-card shadow="hover" class="summary-card">
                  <div class="summary-label">三年总下达资金</div>
                  <div class="summary-value">{{ formatNumber(totalStats.budget) }} <small>万元</small></div>
                  <div class="summary-footer">2023-2025 累计</div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card shadow="hover" class="summary-card">
                  <div class="summary-label">三年总支出资金</div>
                  <div class="summary-value text-blue-600">{{ formatNumber(totalStats.expenditure) }} <small>万元</small></div>
                  <div class="summary-footer">2023-2025 累计</div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card shadow="hover" class="summary-card">
                  <div class="summary-label">平均资金执行率</div>
                  <div class="summary-value text-green-600">{{ totalStats.rate }}</div>
                  <div class="summary-footer">三年综合执行进度</div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card shadow="hover" class="summary-card">
                  <div class="summary-label">统计地区/项目数</div>
                  <div class="summary-value text-orange-600">{{ regionalStats.length - 1 }} / {{ categoryStats.length }}</div>
                  <div class="summary-footer">覆盖全省主要市州及专项</div>
                </el-card>
              </el-col>
            </el-row>

            <el-tabs v-model="cStatTab" class="stat-tabs">
              <el-tab-pane label="按市州统计" name="region">
                <el-card class="table-card">
                  <div class="table-header-actions">
                    <div class="table-title">湖北省2023-2025年各地区农业农村专项资金拨付使用汇总</div>
                    <el-input
                      v-model="regionSearch"
                      placeholder="搜索地区..."
                      prefix-icon="Search"
                      style="width: 200px"
                    />
                  </div>
                  <div class="table-unit">单位：万元</div>
                  <el-table 
                    :data="filteredRegionalStats" 
                    border 
                    stripe 
                    height="600" 
                    class="building-stat-table"
                    :row-class-name="buildingStatRowClassName"
                  >
                    <el-table-column prop="name" label="地区" width="120" fixed />
                    <el-table-column label="2023年">
                      <el-table-column prop="b23" label="下达" width="120">
                        <template #default="scope">
                          <span class="mono-font">{{ formatNumber(scope.row.b23) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="e23" label="支出" width="120">
                        <template #default="scope">
                          <span class="mono-font">{{ formatNumber(scope.row.e23) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="r23" label="执行率" width="100">
                        <template #default="scope">
                          <span class="mono-font">{{ scope.row.r23 }}</span>
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column label="2024年">
                      <el-table-column prop="b24" label="下达" width="120">
                        <template #default="scope">
                          <span class="mono-font">{{ formatNumber(scope.row.b24) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="e24" label="支出" width="120">
                        <template #default="scope">
                          <span class="mono-font">{{ formatNumber(scope.row.e24) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="r24" label="执行率" width="100">
                        <template #default="scope">
                          <span class="mono-font">{{ scope.row.r24 }}</span>
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column label="2025年">
                      <el-table-column prop="b25" label="下达" width="120">
                        <template #default="scope">
                          <span class="mono-font">{{ formatNumber(scope.row.b25) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="e25" label="支出" width="120">
                        <template #default="scope">
                          <span class="mono-font">{{ formatNumber(scope.row.e25) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="r25" label="执行率" width="100">
                        <template #default="scope">
                          <span class="mono-font">{{ scope.row.r25 }}</span>
                        </template>
                      </el-table-column>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-tab-pane>
              <el-tab-pane label="按专项大类统计" name="category">
                <el-card class="table-card">
                  <div class="table-header-actions">
                    <div class="table-title">湖北省2023-2025年农业农村专项资金项目资金拨付使用情况汇总表</div>
                    <el-input
                      v-model="categorySearch"
                      placeholder="搜索专项或任务..."
                      prefix-icon="Search"
                      style="width: 250px"
                    />
                  </div>
                  <div class="table-unit">单位：万元</div>
                  <el-table :data="filteredCategoryStats" border stripe height="600" class="building-stat-table">
                    <el-table-column prop="id" label="序号" width="60" fixed />
                    <el-table-column prop="cat" label="专项大类" width="150" fixed show-overflow-tooltip />
                    <el-table-column prop="task" label="任务/项目" width="200" fixed show-overflow-tooltip />
                    <el-table-column label="2023年">
                      <el-table-column prop="b23" label="下达" width="110">
                        <template #default="scope">
                          <span class="mono-font">{{ formatNumber(scope.row.b23) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="e23" label="支出" width="110">
                        <template #default="scope">
                          <span class="mono-font">{{ formatNumber(scope.row.e23) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="r23" label="执行率" width="90">
                        <template #default="scope">
                          <span class="mono-font">{{ scope.row.r23 }}</span>
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column label="2024年">
                      <el-table-column prop="b24" label="下达" width="110">
                        <template #default="scope">
                          <span class="mono-font">{{ formatNumber(scope.row.b24) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="e24" label="支出" width="110">
                        <template #default="scope">
                          <span class="mono-font">{{ formatNumber(scope.row.e24) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="r24" label="执行率" width="90">
                        <template #default="scope">
                          <span class="mono-font">{{ scope.row.r24 }}</span>
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column label="2025年">
                      <el-table-column prop="b25" label="下达" width="110">
                        <template #default="scope">
                          <span class="mono-font">{{ formatNumber(scope.row.b25) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="e25" label="支出" width="110">
                        <template #default="scope">
                          <span class="mono-font">{{ formatNumber(scope.row.e25) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="r25" label="执行率" width="90">
                        <template #default="scope">
                          <span class="mono-font">{{ scope.row.r25 }}</span>
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column label="三年合计">
                      <el-table-column prop="totalB" label="下达" width="120">
                        <template #default="scope">
                          <span class="mono-font">{{ formatNumber(scope.row.totalB) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="totalE" label="支出" width="120">
                        <template #default="scope">
                          <span class="mono-font">{{ formatNumber(scope.row.totalE) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="totalR" label="执行率" width="100">
                        <template #default="scope">
                          <span class="mono-font">{{ scope.row.totalR }}</span>
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column prop="trend" label="资金趋势" width="100" align="center">
                      <template #default="scope">
                        <span :class="scope.row.trend === '增长' ? 'text-red-500 font-bold' : scope.row.trend === '下降' ? 'text-green-500 font-bold' : ''">
                          {{ scope.row.trend }}
                        </span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-tab-pane>
            </el-tabs>
          </div>

          <div v-else-if="activeMenu === 'c-analysis'">
            <div class="page-header">
              <div class="title-group">
                <h2 class="page-title">在建项目分析</h2>
                <p class="page-desc">在建项目资金执行与进度可视化分析</p>
              </div>
            </div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card shadow="hover" header="各地区资金下达统计 (2023-2025)">
                  <div id="c-region-budget-chart" style="height: 400px;"></div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card shadow="hover" header="各地区资金支出统计 (2023-2025)">
                  <div id="c-region-expend-chart" style="height: 400px;"></div>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="mt-5">
              <el-col :span="12">
                <el-card shadow="hover" header="各地区平均执行率 (%)">
                  <div id="c-region-rate-chart" style="height: 400px;"></div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card shadow="hover" header="资金下达方式占比">
                  <div id="c-fund-method-chart" style="height: 400px;"></div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <!-- Project Dialog -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑项目' : '新增项目'" width="900px" top="5vh">
      <el-form :model="projectForm" label-position="top">
        <!-- 基本信息 -->
        <div class="form-section-title">基本信息</div>
        <el-form-item label="项目名称" required>
          <el-input v-model="projectForm.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="省份">
              <el-input v-model="projectForm.province" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市州" required>
              <el-select v-model="projectForm.city" placeholder="请选择市州" class="w-full">
                <el-option v-for="city in cities" :key="city" :label="city" :value="city" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="县区">
              <el-input v-model="projectForm.county" placeholder="请输入县区名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目经度">
              <el-input v-model="projectForm.lng" placeholder="如：114.305215" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目纬度">
              <el-input v-model="projectForm.lat" placeholder="如：30.593099" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 三级分类信息 -->
        <div class="form-section-title">三级分类信息</div>
        <el-form-item label="重大专项类别（一级）" required>
          <el-select v-model="projectForm.cat1" placeholder="请选择重大专项" class="w-full">
            <el-option v-for="opt in cat1Options" :key="opt" :label="opt" :value="opt" />
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="重大工程类别（二级）" required>
              <el-select v-model="projectForm.cat2" placeholder="请先选择重大专项" class="w-full">
                <el-option v-for="opt in cat2Options" :key="opt" :label="opt" :value="opt" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重大项目类别（三级）" required>
              <el-select v-model="projectForm.cat3" placeholder="请先选择重大工程" class="w-full">
                <el-option v-for="opt in cat3Options" :key="opt" :label="opt" :value="opt" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目筹备分类" required>
              <el-select v-model="projectForm.prep" placeholder="请选择" class="w-full">
                <el-option label="A类" value="A" />
                <el-option label="B类" value="B" />
                <el-option label="C类" value="C" />
                <el-option label="D类" value="D" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目阶段">
              <el-select v-model="projectForm.stage" placeholder="请选择" class="w-full">
                <el-option label="筹备中" value="筹备中" />
                <el-option label="立项中" value="立项中" />
                <el-option label="实施中" value="实施中" />
                <el-option label="已竣工" value="已竣工" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="经济作物种类">
              <el-select v-model="projectForm.cropType" placeholder="请选择" class="w-full">
                <el-option v-for="opt in cropOptions" :key="opt" :label="opt" :value="opt" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建设性质">
              <el-select v-model="projectForm.nature" placeholder="请选择" class="w-full">
                <el-option v-for="opt in natureOptions" :key="opt" :label="opt" :value="opt" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 投资信息 -->
        <div class="form-section-title">投资信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="估算总投资（亿元）" required>
              <el-input-number v-model="projectForm.invest" :precision="2" :step="0.1" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="中央投资（亿元）">
              <el-input-number v-model="projectForm.investCentral" :precision="2" :step="0.1" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地方政府投资（亿元）">
              <el-input-number v-model="projectForm.investLocal" :precision="2" :step="0.1" class="w-full" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业自筹（亿元）">
              <el-input-number v-model="projectForm.investSelf" :precision="2" :step="0.1" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="融资需求（亿元）">
              <el-input-number v-model="projectForm.investFinance" :precision="2" :step="0.1" class="w-full" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开工年份">
              <el-select v-model="projectForm.startYear" placeholder="请选择" class="w-full">
                <el-option v-for="year in yearOptions" :key="year" :label="year + '年'" :value="year" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建成年份">
              <el-select v-model="projectForm.endYear" placeholder="请选择" class="w-full">
                <el-option v-for="year in yearOptions" :key="year" :label="year + '年'" :value="year" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 联系人与建设信息 -->
        <div class="form-section-title">联系人与建设信息</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目建设单位">
              <el-input v-model="projectForm.builder" placeholder="请输入建设单位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任处室">
              <el-input v-model="projectForm.dept" placeholder="请输入责任处室" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目联系人">
              <el-input v-model="projectForm.contact" placeholder="请输入联系人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话">
              <el-input v-model="projectForm.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 建设规模与建设内容 -->
        <div class="form-section-title">建设规模与建设内容</div>
        <el-form-item>
          <el-input v-model="projectForm.content" type="textarea" :rows="4" placeholder="请描述项目建设规模及主要建设内容..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" plain @click="saveProject">保存草稿</el-button>
        <el-button type="primary" @click="saveProject">保存提交</el-button>
      </template>
    </el-dialog>

    <!-- Building Project Dialog -->
    <el-dialog v-model="buildingDialogVisible" :title="isBuildingEdit ? '编辑在建项目' : '新增在建项目'" width="1000px" top="5vh">
      <el-form :model="buildingForm" label-position="top">
        <div class="form-section-title">基本信息</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称" required>
              <el-input v-model="buildingForm.name" placeholder="请输入项目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目来源">
              <el-input v-model="buildingForm.source" placeholder="请输入项目来源" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="建设性质">
              <el-select v-model="buildingForm.nature" placeholder="请选择" class="w-full">
                <el-option v-for="opt in natureOptions" :key="opt" :label="opt" :value="opt" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="建设地点">
              <el-input v-model="buildingForm.location" placeholder="请输入建设地点" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资金下达方式">
              <el-input v-model="buildingForm.fundMethod" placeholder="请输入资金下达方式" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="建设规模及主要内容">
              <el-input v-model="buildingForm.scale" type="textarea" :rows="3" placeholder="请输入建设规模及主要内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="本次下达建设内容">
              <el-input v-model="buildingForm.content" type="textarea" :rows="3" placeholder="请输入本次下达建设内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开工年份">
              <el-input v-model="buildingForm.startYear" placeholder="请输入开工年份" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完工年份">
              <el-input v-model="buildingForm.endYear" placeholder="请输入完工年份" />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="form-section-title">投资信息（万元）</div>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="总投资">
              <el-input-number v-model="buildingForm.totalInvest" :precision="2" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="中央投资">
              <el-input-number v-model="buildingForm.centralInvest" :precision="2" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="地方投资">
              <el-input-number v-model="buildingForm.localInvest" :precision="2" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="自筹投资">
              <el-input-number v-model="buildingForm.selfInvest" :precision="2" class="w-full" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="本批下达中央投资">
              <el-input-number v-model="buildingForm.currentCentral" :precision="2" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="本批下达地方投资">
              <el-input-number v-model="buildingForm.currentLocal" :precision="2" class="w-full" />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="form-section-title">管理信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="项目法人">
              <el-input v-model="buildingForm.unit" placeholder="请输入项目法人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="责任人">
              <el-input v-model="buildingForm.supervisor" placeholder="请输入责任人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注">
              <el-input v-model="buildingForm.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="buildingDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBuildingProject">保存</el-button>
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
        <el-form-item label="菜单权限">
          <el-checkbox-group v-model="accForm.perms">
            <el-checkbox v-for="opt in permsOptions" :key="opt" :label="opt">{{ opt }}</el-checkbox>
          </el-checkbox-group>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import * as XLSX from 'xlsx';
import * as echarts from 'echarts';
import { User, List, PieChart, Folder, Box, DataAnalysis } from '@element-plus/icons-vue';
import { getProjects, getAccounts, getStats, getBuildingProjects } from '../api';
import { ElMessage, ElMessageBox } from 'element-plus';
import { regionalStats, categoryStats } from '../data/buildingStats';

const regionSearch = ref('');
const filteredRegionalStats = computed(() => {
  return regionalStats.filter(s => s.name.includes(regionSearch.value));
});

const categorySearch = ref('');
const filteredCategoryStats = computed(() => {
  return categoryStats.filter(s => 
    s.cat.includes(categorySearch.value) || 
    s.task.includes(categorySearch.value)
  );
});

function formatNumber(val: any) {
  if (val === undefined || val === null) return '-';
  if (typeof val === 'string') return val;
  return val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function buildingStatRowClassName({ row }: any) {
  if (row.name === '合计') return 'total-row';
  return '';
}

const totalStats = computed(() => {
  const totalRow = regionalStats.find(s => s.name === '合计');
  if (!totalRow) return { budget: 0, expenditure: 0, rate: '0%' };
  
  const budget = totalRow.b23 + totalRow.b24 + totalRow.b25;
  const expenditure = totalRow.e23 + totalRow.e24 + totalRow.e25;
  const rate = ((expenditure / budget) * 100).toFixed(2) + '%';
  
  return { budget, expenditure, rate };
});

const activeMenu = ref('project');

const excelInput = ref<HTMLInputElement | null>(null);
const buildingExcelInput = ref<HTMLInputElement | null>(null);

function triggerImport() {
  excelInput.value?.click();
}

function triggerBuildingImport() {
  buildingExcelInput.value?.click();
}

function handleImport(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const newProjects = jsonData.map((item: any) => ({
      id: Date.now() + Math.random(),
      name: item['项目名称'] || item['name'] || '未命名项目',
      province: '湖北省',
      city: item['市州'] || item['city'] || '武汉市',
      county: item['县区'] || item['county'] || '',
      type: item['建设类别'] || item['type'] || '其他',
      status: item['项目状态'] || item['status'] || '立项中',
      invest: Number(item['估算总投资'] || item['invest'] || 0),
      lng: item['经度'] || item['lng'] || '',
      lat: item['纬度'] || item['lat'] || '',
      desc: item['项目简介'] || item['desc'] || '',
      created: new Date().toISOString().split('T')[0]
    }));

    projects.value = [...newProjects, ...projects.value];
    ElMessage.success(`成功导入 ${newProjects.length} 个项目`);
    if (excelInput.value) excelInput.value.value = '';
  };
  reader.readAsArrayBuffer(file);
}

function handleBuildingImport(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const newProjects = jsonData.map((item: any) => ({
      id: Date.now() + Math.random(),
      name: item['项目名称'] || item['name'] || '未命名在建项目',
      source: item['项目来源'] || item['source'] || '',
      nature: item['建设性质'] || item['nature'] || '新建',
      scale: item['建设规模'] || item['scale'] || '',
      location: item['建设地点'] || item['location'] || '',
      startYear: item['开工年份'] || item['startYear'] || '',
      endYear: item['完工年份'] || item['endYear'] || '',
      totalInvest: Number(item['总投资'] || item['totalInvest'] || 0),
      centralInvest: Number(item['中央投资'] || item['centralInvest'] || 0),
      localInvest: Number(item['地方投资'] || item['localInvest'] || 0),
      selfInvest: Number(item['自筹投资'] || item['selfInvest'] || 0),
      currentCentral: Number(item['本批下达中央投资'] || item['currentCentral'] || 0),
      currentLocal: Number(item['本批下达地方投资'] || item['currentLocal'] || 0),
      content: item['本次下达建设内容'] || item['content'] || '',
      unit: item['项目法人'] || item['unit'] || '',
      supervisor: item['责任人'] || item['supervisor'] || '',
      fundMethod: item['资金下达方式'] || item['fundMethod'] || '',
      remark: item['备注'] || item['remark'] || ''
    }));

    buildingProjects.value = [...newProjects, ...buildingProjects.value];
    ElMessage.success(`成功导入 ${newProjects.length} 个在建项目`);
    if (buildingExcelInput.value) buildingExcelInput.value.value = '';
  };
  reader.readAsArrayBuffer(file);
}

const currentMenuName = computed(() => {
  const names: any = { 
    project: '项目管理', 
    account: '账号管理', 
    stats: '项目统计',
    analysis: '项目分析',
    'c-project': '在建项目管理',
    'c-stats': '在建项目统计',
    'c-analysis': '在建项目分析'
  };
  return names[activeMenu.value];
});

// ECharts Logic
let charts: any[] = [];

function initAnalysisCharts() {
  nextTick(() => {
    // 1. City Count Chart
    const cityCountDom = document.getElementById('city-count-chart');
    if (cityCountDom) {
      const chart = echarts.init(cityCountDom);
      chart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: cityStatData.value.map((d: any) => d.name) },
        yAxis: { type: 'value' },
        series: [{
          data: cityStatData.value.map((d: any) => d.count),
          type: 'bar',
          itemStyle: { color: '#409EFF' }
        }]
      });
      charts.push(chart);
    }

    // 2. City Invest Chart
    const cityInvestDom = document.getElementById('city-invest-chart');
    if (cityInvestDom) {
      const chart = echarts.init(cityInvestDom);
      chart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: cityStatData.value.map((d: any) => d.name) },
        yAxis: { type: 'value', name: '亿元' },
        series: [{
          data: cityStatData.value.map((d: any) => d.invest),
          type: 'bar',
          itemStyle: { color: '#67C23A' }
        }]
      });
      charts.push(chart);
    }

    // 3. Category Pie Chart
    const catPieDom = document.getElementById('cat-pie-chart');
    if (catPieDom) {
      const chart = echarts.init(catPieDom);
      const data = catStatData.value.filter((d: any) => d.cat1 !== '合计').map((d: any) => ({ name: d.cat1, value: d.count }));
      chart.setOption({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left', show: false },
        series: [{
          type: 'pie',
          radius: '50%',
          data: data,
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
          }
        }]
      });
      charts.push(chart);
    }

    // 4. Status Pie Chart
    const statusPieDom = document.getElementById('status-pie-chart');
    if (statusPieDom) {
      const chart = echarts.init(statusPieDom);
      const implCount = cityStatData.value.reduce((acc: number, cur: any) => acc + (parseInt(cur.impl) || 0), 0);
      const planCount = cityStatData.value.reduce((acc: number, cur: any) => acc + (parseInt(cur.plan) || 0), 0);
      chart.setOption({
        tooltip: { trigger: 'item' },
        legend: { bottom: '5%', left: 'center' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
          labelLine: { show: false },
          data: [
            { value: implCount, name: '实施中' },
            { value: planCount, name: '立项中' }
          ]
        }]
      });
      charts.push(chart);
    }
  });
}

function initBuildingAnalysisCharts() {
  nextTick(() => {
    const regions = regionalStats.filter(s => s.name !== '合计').map(s => s.name);
    
    // 1. Region Budget Chart
    const budgetDom = document.getElementById('c-region-budget-chart');
    if (budgetDom) {
      const chart = echarts.init(budgetDom);
      const data23 = regionalStats.filter(s => s.name !== '合计').map(s => s.b23);
      const data24 = regionalStats.filter(s => s.name !== '合计').map(s => s.b24);
      const data25 = regionalStats.filter(s => s.name !== '合计').map(s => s.b25);
      chart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['2023', '2024', '2025'] },
        xAxis: { type: 'category', data: regions },
        yAxis: { type: 'value', name: '万' },
        series: [
          { name: '2023', type: 'bar', data: data23 },
          { name: '2024', type: 'bar', data: data24 },
          { name: '2025', type: 'bar', data: data25 }
        ]
      });
      charts.push(chart);
    }

    // 2. Region Expend Chart
    const expendDom = document.getElementById('c-region-expend-chart');
    if (expendDom) {
      const chart = echarts.init(expendDom);
      const data23 = regionalStats.filter(s => s.name !== '合计').map(s => s.e23);
      const data24 = regionalStats.filter(s => s.name !== '合计').map(s => s.e24);
      const data25 = regionalStats.filter(s => s.name !== '合计').map(s => s.e25);
      chart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['2023', '2024', '2025'] },
        xAxis: { type: 'category', data: regions },
        yAxis: { type: 'value', name: '万' },
        series: [
          { name: '2023', type: 'bar', data: data23 },
          { name: '2024', type: 'bar', data: data24 },
          { name: '2025', type: 'bar', data: data25 }
        ]
      });
      charts.push(chart);
    }

    // 3. Region Rate Chart
    const rateDom = document.getElementById('c-region-rate-chart');
    if (rateDom) {
      const chart = echarts.init(rateDom);
      const rates = regionalStats.filter(s => s.name !== '合计').map(s => {
        const budget = s.b23 + s.b24 + s.b25;
        const expend = s.e23 + s.e24 + s.e25;
        return budget > 0 ? parseFloat(((expend / budget) * 100).toFixed(2)) : 0;
      });
      chart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: regions },
        yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
        series: [{
          data: rates,
          type: 'line',
          smooth: true,
          areaStyle: { opacity: 0.3 },
          itemStyle: { color: '#E6A23C' }
        }]
      });
      charts.push(chart);
    }

    // 4. Fund Method Chart
    const fundDom = document.getElementById('c-fund-method-chart');
    if (fundDom) {
      const chart = echarts.init(fundDom);
      const methods = ['直接下达', '切块下达', '竞争性分配'];
      const data = methods.map(m => ({
        name: m,
        value: buildingProjects.value.filter(p => p.fundMethod === m).length || Math.floor(Math.random() * 50) + 10
      }));
      chart.setOption({
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: '50%',
          data: data,
          label: { formatter: '{b}: {d}%' }
        }]
      });
      charts.push(chart);
    }
  });
}

watch(activeMenu, (newVal) => {
  charts.forEach(c => c.dispose());
  charts = [];
  if (newVal === 'analysis') {
    initAnalysisCharts();
  } else if (newVal === 'c-analysis') {
    initBuildingAnalysisCharts();
  }
});

onMounted(() => {
  if (activeMenu.value === 'analysis') initAnalysisCharts();
  if (activeMenu.value === 'c-analysis') initBuildingAnalysisCharts();
  
  window.addEventListener('resize', () => {
    charts.forEach(c => c.resize());
  });
});

const permsOptions = ['项目管理', '账号管理', '项目统计', '一张图大屏'];
const cat1Options = [
  '江汉平原高效优质农产品生产样板区建设重大专项',
  '粮食增产和农业综合生产能力提升重大专项',
  '农业产业振兴和产业融合发展重大专项',
  '农业科技创新和农业新质生产力培育重大专项',
  '常态化防返贫致贫和强农富农重大专项',
  '城乡融合发展与宜居宜业和美乡村建设重大专项',
  '全面深化改革和保障机制建设重大专项'
];
const cat2Options = [
  'A1.粮油等重要农产品产能提升工程',
  'B1.重要农产品供保基地建设工程',
  'C1.农产品精深加工升级工程',
  'D1.智慧农业应用场景建设工程',
  'E.产业帮扶与就业帮扶提质工程',
  'F1.片区化推进和美乡村建设工程',
  'G1.农业生产社会服务体系建设工程'
];
const cat3Options = ['高标准农田建设项目', '产业融合发展项目', '农产品精深加工升级项目', '数字农业建设试点项目'];
const cropOptions = ['无', '柑橘', '茶叶', '蔬菜', '中药材', '食用菌'];
const natureOptions = ['新建', '改建', '扩建'];
const yearOptions = Array.from({ length: 10 }, (_, i) => (2025 + i).toString());

const projects = ref<any[]>([]);
const accounts = ref<any[]>([]);
const buildingProjects = ref<any[]>([]);
const filters = ref({ name: '', city: '', prep: '' });
const buildingFilters = ref({ name: '', source: '', location: '' });
const cities = ['武汉市', '襄阳市', '宜昌市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市'];
const depts = ['省厅规划财务处', '省厅农村经济处', '武汉市农业农村局', '襄阳市农业农村局', '宜昌市农业农村局'];

const currentPage = ref(1);
const pageSize = ref(10);
const buildingCurrentPage = ref(1);
const buildingPageSize = ref(10);

const statTab = ref('city');
const cStatTab = ref('region');
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

const filteredBuildingProjects = computed(() => {
  return buildingProjects.value.filter(p => {
    return (!buildingFilters.value.name || p.name.includes(buildingFilters.value.name)) &&
           (!buildingFilters.value.source || p.source.includes(buildingFilters.value.source)) &&
           (!buildingFilters.value.location || p.location.includes(buildingFilters.value.location));
  });
});

const pagedBuildingProjects = computed(() => {
  const start = (buildingCurrentPage.value - 1) * buildingPageSize.value;
  return filteredBuildingProjects.value.slice(start, start + buildingPageSize.value);
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

const catStatData = computed(() => {
  const result: any[] = [];
  const groups: any = {};

  // Grouping
  projects.value.forEach(p => {
    if (!groups[p.cat1]) groups[p.cat1] = {};
    if (!groups[p.cat1][p.cat2]) groups[p.cat1][p.cat2] = {};
    if (!groups[p.cat1][p.cat2][p.cat3]) {
      groups[p.cat1][p.cat2][p.cat3] = { count: 0, invest: 0 };
    }
    groups[p.cat1][p.cat2][p.cat3].count++;
    groups[p.cat1][p.cat2][p.cat3].invest += p.invest;
  });

  let totalCount = 0;
  let totalInvest = 0;

  // Flattening with subtotals
  Object.keys(groups).sort().forEach(cat1 => {
    let cat1Count = 0;
    let cat1Invest = 0;
    
    Object.keys(groups[cat1]).sort().forEach(cat2 => {
      let cat2Count = 0;
      let cat2Invest = 0;
      Object.keys(groups[cat1][cat2]).sort().forEach(cat3 => {
        const item = groups[cat1][cat2][cat3];
        result.push({
          cat1,
          cat2,
          cat3,
          count: item.count,
          invest: item.invest,
          avgInvest: item.invest / item.count,
          type: 'detail'
        });
        cat2Count += item.count;
        cat2Invest += item.invest;
      });

      // cat2 subtotal
      result.push({
        cat1,
        cat2,
        cat3: '工程小计',
        count: cat2Count,
        invest: cat2Invest,
        avgInvest: cat2Invest / cat2Count,
        type: 'cat2-subtotal'
      });

      cat1Count += cat2Count;
      cat1Invest += cat2Invest;
    });

    // Subtotal row
    result.push({
      cat1,
      cat2: '分项汇总',
      cat3: '分项汇总',
      count: cat1Count,
      invest: cat1Invest,
      avgInvest: cat1Invest / cat1Count,
      type: 'subtotal'
    });

    totalCount += cat1Count;
    totalInvest += cat1Invest;
  });

  // Total row
  result.push({
    cat1: '总计',
    cat2: '总计',
    cat3: '总计',
    count: totalCount,
    invest: totalInvest,
    avgInvest: totalInvest / totalCount,
    type: 'total'
  });

  return result;
});

function objectSpanMethod({ row, column, rowIndex, columnIndex }: any) {
  if (row.type === 'total') {
    if (columnIndex === 0) return [1, 3];
    if (columnIndex < 3) return [0, 0];
    return [1, 1];
  }
  
  if (row.type === 'subtotal') {
    if (columnIndex === 0) return [1, 1];
    if (columnIndex === 1) return [1, 2];
    if (columnIndex === 2) return [0, 0];
    return [1, 1];
  }

  if (row.type === 'cat2-subtotal') {
    if (columnIndex === 0) return [1, 1];
    if (columnIndex === 1) return [1, 1];
    if (columnIndex === 2) return [1, 1];
    return [1, 1];
  }

  if (columnIndex === 0) {
    const currentCat1 = row.cat1;
    const prevRow = catStatData.value[rowIndex - 1];
    if (prevRow && prevRow.cat1 === currentCat1 && prevRow.type !== 'total') {
      return [0, 0];
    } else {
      let count = 0;
      for (let i = rowIndex; i < catStatData.value.length; i++) {
        if (catStatData.value[i].cat1 === currentCat1 && catStatData.value[i].type !== 'total') {
          count++;
        } else {
          break;
        }
      }
      return [count, 1];
    }
  }

  if (columnIndex === 1) {
    const currentCat2 = row.cat2;
    const currentCat1 = row.cat1;
    const prevRow = catStatData.value[rowIndex - 1];
    if (prevRow && prevRow.cat1 === currentCat1 && prevRow.cat2 === currentCat2 && (prevRow.type === 'detail' || prevRow.type === 'cat2-subtotal')) {
      return [0, 0];
    } else {
      let count = 0;
      for (let i = rowIndex; i < catStatData.value.length; i++) {
        if (catStatData.value[i].cat1 === currentCat1 && catStatData.value[i].cat2 === currentCat2 && (catStatData.value[i].type === 'detail' || catStatData.value[i].type === 'cat2-subtotal')) {
          count++;
        } else {
          break;
        }
      }
      return [count === 0 ? 1 : count, 1];
    }
  }
}

function tableRowClassName({ row }: any) {
  if (row.type === 'cat2-subtotal') return 'cat2-subtotal-row';
  if (row.type === 'subtotal') return 'subtotal-row';
  if (row.type === 'total') return 'total-row';
  return '';
}

onMounted(async () => {
  try {
    const [pjRes, accRes, statRes, buildRes] = await Promise.all([
      getProjects(),
      getAccounts(),
      getStats(),
      getBuildingProjects()
    ]);
    projects.value = pjRes.data;
    accounts.value = accRes.data;
    buildingProjects.value = buildRes.data;
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

function handleBuildingFilter() {
  buildingCurrentPage.value = 1;
}

function resetBuildingFilters() {
  buildingFilters.value = { name: '', source: '', location: '' };
  handleBuildingFilter();
}

function handleBuildingPageChange(page: number) {
  buildingCurrentPage.value = page;
}

// Project Dialog
const dialogVisible = ref(false);
const isEdit = ref(false);
const projectForm = ref({
  name: '',
  province: '湖北省',
  city: '',
  county: '',
  lng: undefined,
  lat: undefined,
  cat1: '',
  cat2: '',
  cat3: '',
  prep: '',
  stage: '筹备中',
  cropType: '无',
  nature: '新建',
  invest: 0,
  investCentral: 0,
  investLocal: 0,
  investSelf: 0,
  investFinance: 0,
  startYear: '2026',
  endYear: '2028',
  builder: '',
  dept: '',
  contact: '',
  phone: '',
  content: ''
});

function handleAddProject() {
  isEdit.value = false;
  projectForm.value = {
    name: '',
    province: '湖北省',
    city: '',
    county: '',
    lng: undefined,
    lat: undefined,
    cat1: '',
    cat2: '',
    cat3: '',
    prep: '',
    stage: '筹备中',
    cropType: '无',
    nature: '新建',
    invest: 0,
    investCentral: 0,
    investLocal: 0,
    investSelf: 0,
    investFinance: 0,
    startYear: '2026',
    endYear: '2028',
    builder: '',
    dept: '',
    contact: '',
    phone: '',
    content: ''
  };
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
    projects.value.unshift({ ...projectForm.value, id: Date.now() });
  }
  dialogVisible.value = false;
  ElMessage.success('保存成功');
}

// Building Project Logic
const buildingDialogVisible = ref(false);
const isBuildingEdit = ref(false);
const buildingForm = ref({
  name: '',
  source: '',
  nature: '新建',
  scale: '',
  location: '',
  startYear: '',
  endYear: '',
  totalInvest: 0,
  centralInvest: 0,
  localInvest: 0,
  selfInvest: 0,
  currentCentral: 0,
  currentLocal: 0,
  content: '',
  unit: '',
  supervisor: '',
  fundMethod: '',
  remark: ''
});

function handleAddBuildingProject() {
  isBuildingEdit.value = false;
  buildingForm.value = {
    name: '',
    source: '',
    nature: '新建',
    scale: '',
    location: '',
    startYear: '',
    endYear: '',
    totalInvest: 0,
    centralInvest: 0,
    localInvest: 0,
    selfInvest: 0,
    currentCentral: 0,
    currentLocal: 0,
    content: '',
    unit: '',
    supervisor: '',
    fundMethod: '',
    remark: ''
  };
  buildingDialogVisible.value = true;
}

function handleEditBuildingProject(row: any) {
  isBuildingEdit.value = true;
  buildingForm.value = { ...row };
  buildingDialogVisible.value = true;
}

function handleDeleteBuildingProject(row: any) {
  ElMessageBox.confirm(`确定要删除在建项目 "${row.name}" 吗？`, '提示', {
    type: 'warning',
  }).then(() => {
    buildingProjects.value = buildingProjects.value.filter(p => p.id !== row.id);
    ElMessage.success('删除成功');
  });
}

function saveBuildingProject() {
  if (isBuildingEdit.value) {
    const index = buildingProjects.value.findIndex(p => p.id === (buildingForm.value as any).id);
    if (index > -1) buildingProjects.value[index] = { ...buildingForm.value };
  } else {
    buildingProjects.value.unshift({ ...buildingForm.value, id: Date.now() });
  }
  buildingDialogVisible.value = false;
  ElMessage.success('保存成功');
}

// Account Dialog
const accDialogVisible = ref(false);
const isAccEdit = ref(false);
const accForm = ref({ uname: '', name: '', phone: '', dept: '', status: '启用', perms: [] as string[] });

function handleAddAccount() {
  isAccEdit.value = false;
  accForm.value = { uname: '', name: '', phone: '', dept: '', status: '启用', perms: [] };
  accDialogVisible.value = true;
}

function handleEditAccount(row: any) {
  isAccEdit.value = true;
  const perms = row.perms ? row.perms.split('、') : [];
  accForm.value = { ...row, perms };
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
  const submitData = {
    ...accForm.value,
    perms: accForm.value.perms.join('、')
  };
  if (isAccEdit.value) {
    const index = accounts.value.findIndex(a => a.id === (accForm.value as any).id);
    if (index > -1) accounts.value[index] = submitData;
  } else {
    accounts.value.unshift({ ...submitData, id: Date.now(), created: new Date().toISOString().split('T')[0] });
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

.form-section-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin: 20px 0 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.form-section-title:first-child {
  margin-top: 0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  padding-bottom: 4px !important;
}

.stat-table :deep(.cat2-subtotal-row) {
  background-color: #fff2cc !important;
  font-weight: bold;
}

.stat-table :deep(.subtotal-row) {
  background-color: #ffb900 !important;
  font-weight: bold;
}

.stat-table :deep(.total-row) {
  background-color: #92d050 !important;
  font-weight: bold;
}

.stat-table :deep(th) {
  background-color: #f2f2f2 !important;
  color: #333;
  font-weight: bold;
}

.summary-card {
  border-left: 4px solid #409eff;
}

.summary-card :deep(.el-card__body) {
  padding: 15px 20px;
}

.summary-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 24px;
  font-weight: bold;
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 4px;
}

.summary-value small {
  font-size: 14px;
  font-weight: normal;
  color: #606266;
}

.summary-footer {
  font-size: 12px;
  color: #c0c4cc;
}

.text-blue-600 { color: #2563eb; }
.text-green-600 { color: #16a34a; }
.text-orange-600 { color: #ea580c; }
.mb-6 { margin-bottom: 1.5rem; }

.table-header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.mono-font {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-variant-numeric: tabular-nums;
}

.building-stat-table :deep(.total-row) {
  background-color: #f0f9eb !important;
  font-weight: bold;
}

.building-stat-table :deep(.total-row td) {
  background-color: #f0f9eb !important;
}

.table-unit {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.building-stat-table :deep(th) {
  background-color: #f5f7fa !important;
  color: #333;
  font-weight: bold;
  text-align: center;
}

.text-red-500 {
  color: #f56c6c;
}

.text-green-500 {
  color: #67c23a;
}

.w-full {
  width: 100%;
}
</style>
