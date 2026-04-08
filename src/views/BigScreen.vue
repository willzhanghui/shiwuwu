<template>
  <div class="big-screen">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="logo-icon">🌾</div>
        <div class="logo-text">
          <h1>湖北农业农村</h1>
          <p>重大项目监测管理平台</p>
        </div>
      </div>
      <div class="header-center">
        <div class="title">湖北省"十五五"农业农村重大项目监测管理平台</div>
        <div class="subtitle">一张图大屏端 · 2026—2030年规划期</div>
      </div>
      <div class="header-right">
        <el-button type="primary" plain size="small" @click="$router.push('/manage')">运营管理端</el-button>
        <div class="clock">
          <div class="time">{{ currentTime }}</div>
          <div class="date">{{ currentDate }}</div>
        </div>
      </div>
    </header>

    <div class="main-content">
      <!-- Left Panel -->
      <aside class="side-panel left-panel">
        <section class="section">
          <div class="section-title">总体概览</div>
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-value">369<span>个</span></div>
              <div class="kpi-label">项目总数</div>
            </div>
            <div class="kpi-card accent-green">
              <div class="kpi-value">3406<span>亿</span></div>
              <div class="kpi-label">估算总投资</div>
            </div>
            <div class="kpi-card accent-orange">
              <div class="kpi-value">17<span>个</span></div>
              <div class="kpi-label">覆盖市州</div>
            </div>
            <div class="kpi-card accent-purple">
              <div class="kpi-value">7<span>类</span></div>
              <div class="kpi-label">重大专项</div>
            </div>
          </div>
        </section>

        <section class="section flex-1 overflow-hidden flex flex-col">
          <div class="section-title">市州分布</div>
          <div class="city-list overflow-y-auto flex-1">
            <div v-for="city in cityStats" :key="city.name" class="city-item" @click="zoomToCity(city.name)">
              <span class="city-name">{{ city.name }}</span>
              <div class="progress-bar-wrap">
                <div class="progress-bar" :style="{ width: (city.count / maxCityCount * 100) + '%' }"></div>
              </div>
              <span class="city-invest">{{ city.invest }}亿</span>
              <span class="city-count">{{ city.count }}</span>
            </div>
          </div>
        </section>
      </aside>

      <!-- Center Map -->
      <main class="map-container">
        <div id="map" ref="mapContainer"></div>
        <div v-if="mapError" class="map-error-overlay">
          <div class="error-content">
            <el-icon size="40" color="#ff4d4f"><Warning /></el-icon>
            <h3>地图加载失败</h3>
            <p>请检查 Mapbox Access Token 是否正确配置。</p>
            <el-button type="primary" size="small" @click="retryMap">重试</el-button>
          </div>
        </div>
        <div class="map-overlay">
          <div class="breadcrumb">
            <span :class="{ active: !currentCity }" @click="resetView">湖北省</span>
            <span v-if="currentCity" class="separator">/</span>
            <span v-if="currentCity" class="active">{{ currentCity }}</span>
          </div>
        </div>

        <!-- Detail Panel -->
        <div class="detail-panel" :class="{ open: !!selectedProject }">
          <div class="detail-header">
            <div class="detail-title">项目详情</div>
            <button class="close-btn" @click="selectedProject = null">✕</button>
          </div>
          <div v-if="selectedProject" class="detail-body">
            <div class="detail-item">
              <div class="label">项目名称</div>
              <div class="value highlight">{{ selectedProject.name }}</div>
            </div>
            <div class="detail-item">
              <div class="label">筹备分类</div>
              <div class="value">
                <span class="tag" :class="'tag-' + selectedProject.prep">{{ selectedProject.prep }}类</span>
              </div>
            </div>
            <div class="detail-item">
              <div class="label">所在地</div>
              <div class="value">{{ selectedProject.city }} · {{ selectedProject.county }}</div>
            </div>
            <div class="detail-item">
              <div class="label">估算总投资</div>
              <div class="value invest-value">{{ selectedProject.invest }}<span> 亿元</span></div>
            </div>
            <div class="detail-item">
              <div class="label">建设单位</div>
              <div class="value">{{ selectedProject.builder }}</div>
            </div>
            <div class="detail-item">
              <div class="label">建设内容</div>
              <div class="value desc">{{ selectedProject.desc }}</div>
            </div>
          </div>
        </div>
      </main>

      <!-- Right Panel -->
      <aside class="side-panel right-panel">
        <section class="section">
          <div class="section-title">专项类别分布</div>
          <div ref="catChart" class="chart-box h-40"></div>
        </section>
        <section class="section">
          <div class="section-title">筹备分类占比</div>
          <div ref="prepChart" class="chart-box h-40"></div>
        </section>
        <section class="section flex-1 overflow-hidden flex flex-col">
          <div class="section-title">投资规模 Top10</div>
          <div class="top-list overflow-y-auto flex-1">
            <div v-for="(pj, index) in topProjects" :key="pj.id" class="top-item">
              <span class="rank">{{ index + 1 }}</span>
              <div class="pj-info">
                <div class="pj-name" :title="pj.name">{{ pj.name }}</div>
                <div class="pj-bar-wrap">
                  <div class="pj-bar" :style="{ width: (pj.invest / topProjects[0].invest * 100) + '%' }"></div>
                </div>
              </div>
              <span class="pj-invest">{{ pj.invest }}亿</span>
            </div>
          </div>
        </section>
      </aside>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-item"><span class="dot green"></span>系统运行正常</div>
      <div class="footer-item"><span class="dot orange"></span>数据更新：2026-03-23</div>
      <div class="footer-item">数据来源：湖北省农业农村厅</div>
      <div class="footer-item ml-auto">湖北省"十五五"农业农村重大项目监测管理平台 V2.0</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted, computed, markRaw } from 'vue';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as echarts from 'echarts';
import { getProjects } from '../api';

interface Project {
  id: number;
  name: string;
  city: string;
  county: string;
  lat: number;
  lng: number;
  invest: number;
  prep: 'A' | 'B' | 'C';
  cat1: string;
  builder: string;
  desc: string;
}

interface CityStat {
  name: string;
  count: number;
  invest: number;
}

// Tianditu (天地图) Configuration
const TIANDITU_KEY = 'b5de8c428b2dbb5e9894f02ffdc5cff8';

// Tianditu Style Definition for MapLibre GL JS
const tiandituStyle: any = {
  version: 8,
  sources: {
    'tdt-vec': {
      type: 'raster',
      tiles: [
        `https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`
      ],
      tileSize: 256
    },
    'tdt-cva': {
      type: 'raster',
      tiles: [
        `https://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`
      ],
      tileSize: 256
    }
  },
  layers: [
    {
      id: 'tdt-vec-layer',
      type: 'raster',
      source: 'tdt-vec'
    },
    {
      id: 'tdt-cva-layer',
      type: 'raster',
      source: 'tdt-cva'
    }
  ]
};

const mapContainer = ref<HTMLElement | null>(null);
const map = shallowRef<any>(null);
const mapError = ref(false);
const catChart = ref<HTMLElement | null>(null);
const prepChart = ref<HTMLElement | null>(null);

const currentTime = ref('');
const currentDate = ref('');
const projects = ref<Project[]>([]);
const currentCity = ref<string | null>(null);
const selectedProject = ref<Project | null>(null);

const currentTimeInterval = setInterval(() => {
  const now = new Date();
  currentTime.value = now.toTimeString().slice(0, 8);
  currentDate.value = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
}, 1000);

const cityStats = computed<CityStat[]>(() => {
  const map: Record<string, CityStat> = {};
  projects.value.forEach(p => {
    if (!map[p.city]) map[p.city] = { name: p.city, count: 0, invest: 0 };
    map[p.city].count++;
    map[p.city].invest = parseFloat((map[p.city].invest + p.invest).toFixed(1));
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
});

const maxCityCount = computed(() => {
  const counts = cityStats.value.map((c: any) => c.count);
  return counts.length ? Math.max(...counts) : 1;
});
const topProjects = computed(() => [...projects.value].sort((a, b) => b.invest - a.invest).slice(0, 10));

onMounted(async () => {
  window.addEventListener('resize', handleResize);
  // Fetch data
  try {
    const res = await getProjects();
    projects.value = res.data;
    // Re-init markers and charts after data load
    if (map.value && map.value.isStyleLoaded()) {
      addProjectMarkers();
    }
    initCharts();
  } catch (e) {
    console.error('Failed to fetch projects', e);
  }

  // Init Map
  initMap();
});

function initMap() {
  if (mapContainer.value) {
    try {
      // Hubei Bounding Box
      const bounds: [number, number, number, number] = [108.37, 29.02, 116.13, 33.27];
      
      const mapInstance = new maplibregl.Map({
        container: mapContainer.value,
        style: tiandituStyle,
        center: [112.20, 30.96],
        zoom: 6.5,
        minZoom: 6,
        maxZoom: 12,
        maxBounds: bounds as any
      });

      map.value = markRaw(mapInstance);

      map.value.on('load', async () => {
        mapError.value = false;
        
        // Add Hubei Boundary Mask
        try {
          const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/420000.json');
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Received non-JSON response:', text.substring(0, 100));
            throw new Error('Received non-JSON response from GeoJSON provider');
          }

          const hubeiGeoJSON = await response.json();
          
          // Create a mask: a large polygon covering the world with a hole for Hubei
          const geometry = hubeiGeoJSON.features[0].geometry;
          let hubeiRings = [];
          if (geometry.type === 'Polygon') {
            hubeiRings = geometry.coordinates;
          } else if (geometry.type === 'MultiPolygon') {
            // Flatten all rings from all polygons to use as holes in the mask
            hubeiRings = geometry.coordinates.flat();
          }

          const maskGeoJSON = {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-180, -90],
                  [180, -90],
                  [180, 90],
                  [-180, 90],
                  [-180, -90]
                ],
                ...hubeiRings
              ]
            }
          };

          map.value.addSource('hubei-mask', {
            type: 'geojson',
            data: maskGeoJSON
          });

          map.value.addLayer({
            id: 'hubei-mask-layer',
            type: 'fill',
            source: 'hubei-mask',
            paint: {
              'fill-color': '#000814',
              'fill-opacity': 0.8
            }
          });

          // Add Hubei Border Source
          map.value.addSource('hubei-border', {
            type: 'geojson',
            data: hubeiGeoJSON
          });

          // Add Hubei Border Glow
          map.value.addLayer({
            id: 'hubei-border-glow',
            type: 'line',
            source: 'hubei-border',
            paint: {
              'line-color': '#00d4ff',
              'line-width': 8,
              'line-opacity': 0.2,
              'line-blur': 4
            }
          });

          // Add Hubei Border
          map.value.addLayer({
            id: 'hubei-border-layer',
            type: 'line',
            source: 'hubei-border',
            paint: {
              'line-color': '#00d4ff',
              'line-width': 2,
              'line-opacity': 0.8
            }
          });
        } catch (err) {
          console.error('Failed to load Hubei GeoJSON:', err);
        }

        addProjectMarkers();
      });

      map.value.on('error', (e: any) => {
        console.error('Mapbox error:', e.message || (e.error && e.error.message) || 'Unknown map error');
        mapError.value = true;
      });
    } catch (e: any) {
      console.error('Failed to initialize map:', e.message || e);
      mapError.value = true;
    }
  }
}

function retryMap() {
  if (map.value) {
    map.value.remove();
    map.value = null;
  }
  mapError.value = false;
  initMap();
}

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  clearInterval(currentTimeInterval);
  if (map.value) map.value.remove();
});

function addProjectMarkers() {
  if (!map.value) return;
  projects.value.forEach(p => {
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundColor = p.prep === 'A' ? '#00ff9d' : p.prep === 'B' ? '#00d4ff' : '#ff8c42';
    el.style.width = '10px';
    el.style.height = '10px';
    el.style.borderRadius = '50%';
    el.style.cursor = 'pointer';
    el.style.boxShadow = `0 0 8px ${el.style.backgroundColor}`;

    el.addEventListener('click', () => {
      selectedProject.value = p;
    });

    new maplibregl.Marker(el)
      .setLngLat([p.lng, p.lat])
      .addTo(map.value!);
  });
}

const catChartInstance = shallowRef<echarts.ECharts | null>(null);
const prepChartInstance = shallowRef<echarts.ECharts | null>(null);

function initCharts() {
  if (catChart.value) {
    catChartInstance.value = echarts.init(catChart.value);
    const catData: any = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0 };
    projects.value.forEach(p => {
      const k = p.cat1.slice(0, 1);
      if (catData[k] !== undefined) catData[k]++;
    });

    catChartInstance.value.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '10%', bottom: '3%', top: '10%', containLabel: true },
      xAxis: { type: 'value', axisLabel: { color: '#7aa5cc', fontSize: 10 }, splitLine: { lineStyle: { color: '#0e3060' } } },
      yAxis: { type: 'category', data: ['专项A', '专项B', '专项C', '专项D', '专项E', '专项F', '专项G'], axisLabel: { color: '#7aa5cc', fontSize: 10 } },
      series: [{ type: 'bar', data: Object.values(catData), itemStyle: { color: '#00d4ff' }, barWidth: '60%' }]
    });
  }

  if (prepChart.value) {
    prepChartInstance.value = echarts.init(prepChart.value);
    const prepData = [
      { value: projects.value.filter(p => p.prep === 'A').length, name: 'A类', itemStyle: { color: '#00ff9d' } },
      { value: projects.value.filter(p => p.prep === 'B').length, name: 'B类', itemStyle: { color: '#00d4ff' } },
      { value: projects.value.filter(p => p.prep === 'C').length, name: 'C类', itemStyle: { color: '#ff8c42' } },
    ];
    prepChartInstance.value.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: '0', textStyle: { color: '#7aa5cc', fontSize: 10 }, icon: 'circle' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '40%'],
        data: prepData,
        label: { show: false }
      }]
    });
  }
}

const handleResize = () => {
  catChartInstance.value?.resize();
  prepChartInstance.value?.resize();
};

function zoomToCity(cityName: string) {
  currentCity.value = cityName;
  // In a real app, you'd have city coordinates
  if (map.value) {
    map.value.flyTo({ center: [114.30, 30.60], zoom: 9 });
  }
}

function resetView() {
  currentCity.value = null;
  if (map.value) {
    map.value.flyTo({ center: [112.20, 30.96], zoom: 6.5 });
  }
}

function resetF() {
  // Reset filters logic
}
</script>

<style scoped>
.big-screen {
  background: #040d1a;
  color: #c8e0f4;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 60px;
  background: linear-gradient(180deg, #071e3d, #04122a);
  border-bottom: 1px solid #0e3060;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 24px;
  background: linear-gradient(135deg, #00d4ff, #006896);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.logo-text h1 {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  margin: 0;
}

.logo-text p {
  font-size: 10px;
  color: #7aa5cc;
  margin: 0;
}

.header-center {
  text-align: center;
}

.header-center .title {
  font-size: 22px;
  font-weight: bold;
  background: linear-gradient(90deg, #00d4ff, #00ff9d, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
}

.header-center .subtitle {
  font-size: 12px;
  color: #7aa5cc;
}

.clock {
  text-align: right;
  margin-left: 20px;
}

.clock .time {
  font-size: 18px;
  color: #00d4ff;
}

.clock .date {
  font-size: 10px;
  color: #7aa5cc;
}

.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 10px;
  padding: 10px;
  overflow: hidden;
}

.side-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section {
  background: #071428;
  border: 1px solid #0e3060;
  border-radius: 8px;
  padding: 15px;
  position: relative;
}

.section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #00d4ff, transparent);
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 14px;
  background: #00d4ff;
  border-radius: 2px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.kpi-card {
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 6px;
  padding: 10px;
  text-align: center;
  position: relative;
}

.kpi-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #00d4ff;
}

.kpi-card.accent-green::after { background: #00ff9d; }
.kpi-card.accent-orange::after { background: #ff8c42; }
.kpi-card.accent-purple::after { background: #a855f7; }

.kpi-value {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
}

.kpi-value span {
  font-size: 12px;
  color: #7aa5cc;
  margin-left: 4px;
}

.kpi-label {
  font-size: 11px;
  color: #7aa5cc;
  margin-top: 5px;
}

.city-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
}

.city-item:hover {
  background: rgba(0, 212, 255, 0.1);
}

.city-name {
  width: 60px;
  font-size: 12px;
}

.progress-bar-wrap {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 10px;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #00d4ff;
}

.city-invest {
  font-size: 11px;
  color: #7aa5cc;
  width: 40px;
  text-align: right;
}

.city-count {
  font-size: 12px;
  color: #00d4ff;
  width: 30px;
  text-align: right;
}

.map-container {
  position: relative;
  border: 1px solid #0e3060;
  border-radius: 8px;
  overflow: hidden;
}

.map-error-overlay {
  position: absolute;
  inset: 0;
  background: rgba(7, 20, 40, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  text-align: center;
}

.error-content h3 {
  color: #ff4d4f;
  margin: 10px 0;
}

.error-content p {
  color: #7aa5cc;
  margin-bottom: 15px;
  font-size: 13px;
}

#map {
  width: 100%;
  height: 100%;
}

.map-overlay {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 5;
}

.breadcrumb {
  background: rgba(4, 13, 26, 0.8);
  padding: 5px 15px;
  border-radius: 4px;
  border: 1px solid #0e3060;
  font-size: 12px;
}

.breadcrumb span {
  cursor: pointer;
}

.breadcrumb span.active {
  color: #00d4ff;
  font-weight: bold;
}

.detail-panel {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 320px;
  background: rgba(4, 13, 26, 0.95);
  border: 1px solid #0e3060;
  border-radius: 8px;
  z-index: 10;
  transform: translateX(350px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  max-height: calc(100% - 30px);
}

.detail-panel.open {
  transform: translateX(0);
}

.detail-header {
  padding: 15px;
  border-bottom: 1px solid #0e3060;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-title {
  font-size: 16px;
  font-weight: bold;
  color: #00d4ff;
}

.close-btn {
  background: none;
  border: none;
  color: #7aa5cc;
  cursor: pointer;
  font-size: 18px;
}

.detail-body {
  padding: 15px;
  overflow-y: auto;
}

.detail-item {
  margin-bottom: 15px;
}

.detail-item .label {
  font-size: 12px;
  color: #7aa5cc;
  margin-bottom: 5px;
}

.detail-item .value {
  font-size: 14px;
  color: #fff;
  line-height: 1.6;
}

.detail-item .value.highlight {
  color: #00d4ff;
  font-weight: bold;
}

.detail-item .value.invest-value {
  font-size: 24px;
  font-weight: bold;
  color: #00ff9d;
}

.detail-item .value.invest-value span {
  font-size: 14px;
  font-weight: normal;
}

.detail-item .value.desc {
  font-size: 13px;
  color: #c8e0f4;
  text-align: justify;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.tag-A { background: rgba(0, 255, 157, 0.1); color: #00ff9d; border: 1px solid rgba(0, 255, 157, 0.3); }
.tag-B { background: rgba(0, 212, 255, 0.1); color: #00d4ff; border: 1px solid rgba(0, 212, 255, 0.3); }
.tag-C { background: rgba(255, 140, 66, 0.1); color: #ff8c42; border: 1px solid rgba(255, 140, 66, 0.3); }

.separator {
  margin: 0 8px;
  color: #7aa5cc;
}

.top-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.rank {
  font-size: 12px;
  color: #7aa5cc;
  width: 15px;
}

.pj-info {
  flex: 1;
  min-width: 0;
}

.pj-name {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pj-bar-wrap {
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  margin-top: 4px;
  border-radius: 2px;
}

.pj-bar {
  height: 100%;
  background: linear-gradient(90deg, #00ff9d, #00d4ff);
  border-radius: 2px;
}

.pj-invest {
  font-size: 12px;
  color: #00ff9d;
  width: 45px;
  text-align: right;
}

.footer {
  height: 30px;
  background: #030c18;
  border-top: 1px solid #0e3060;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 20px;
  font-size: 11px;
  color: #7aa5cc;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.dot.green { background: #00ff9d; }
.dot.orange { background: #ff8c42; }
</style>
