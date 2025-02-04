// course1.js

class FinancialMastery {
    constructor() {
      this.state = {
        activeModule: 'financial-foundations',
        userProgress: this.loadProgress(),
        marketData: null,
        threeScene: null,
        calculationsWorker: null,
        riskSimulation: {
          assets: [],
          correlations: new Map()
        }
      };
  
      this.init();
    }
  
    init() {
      this.setupGlobalListeners();
      this.initCharts();
      this.initializeWebGL();
      this.initCalculationsWorker();
      this.initRiskSimulation();
      this.initParametricControls();
      this.restoreProgress();
      this.setupHotkeys();
    }
  
    // =====================
    // CORE SYSTEMS
    // =====================
  
    setupGlobalListeners() {
      window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 100));
      document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
      this.initHammerGestures();
    }
  
    initializeWebGL() {
      const canvas = document.querySelector('#financial-webgl');
      if (!canvas) return;
  
      // Three.js Scene Setup
      this.state.threeScene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias: true,
        alpha: true
      });
      
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      
      this.setupSceneLighting();
      this.createParametricSurface();
      this.setupOrbitControls();
      this.animate();
    }
  
    setupSceneLighting() {
      const ambientLight = new THREE.AmbientLight(0x404040, 2);
      this.state.threeScene.add(ambientLight);
  
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      this.state.threeScene.add(directionalLight);
    }
  
    createParametricSurface() {
      const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
      const material = new THREE.MeshPhongMaterial({
        color: 0x2F80ED,
        wireframe: true,
        transparent: true,
        opacity: 0.8
      });
  
      this.parametricSurface = new THREE.Mesh(geometry, material);
      this.parametricSurface.rotation.x = -Math.PI / 2;
      this.state.threeScene.add(this.parametricSurface);
      this.camera.position.set(0, 50, 100);
    }
  
    setupOrbitControls() {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
    }
  
    // =====================
    // FINANCIAL CALCULATIONS
    // =====================
  
    initCharts() {
      const ctx = document.getElementById('tvm-chart');
      if (!ctx) return;
  
      this.tvmChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({length: 30}, (_, i) => i + 1),
          datasets: [{
            label: 'Future Value',
            data: [],
            borderColor: '#2F80ED',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  
    initCalculationsWorker() {
      this.calculationsWorker = {
        postMessage: (payload) => {
          setTimeout(() => {
            const results = this.calculateTVMLocal(payload);
            this.updateTVMVisualization(results);
          }, 100);
        }
      };
    }
  
    calculateTVMLocal(params) {
      const principal = parseFloat(params.principal);
      const rate = parseFloat(params.rate) / 100;
      const years = parseInt(params.years);
      
      const futureValues = Array.from({length: years}, (_, i) => 
        principal * Math.pow(1 + rate, i + 1)
      );
      
      return {
        futureValues,
        interestProjection: {
          futureValue: futureValues[futureValues.length - 1],
          interest: futureValues[futureValues.length - 1] - principal
        }
      };
    }
  
    updateTVMVisualization({ futureValues, interestProjection }) {
      // Update 2D Chart
      this.tvmChart.data.datasets[0].data = futureValues;
      this.tvmChart.update();
  
      // Update 3D Surface
      this.updateParametricSurface(futureValues);
  
      // Update metrics display
      this.updateFinancialMetrics(interestProjection);
    }
  
    updateParametricSurface(dataSeries) {
      const geometry = this.parametricSurface.geometry;
      const vertices = geometry.attributes.position.array;
      
      dataSeries.forEach((value, index) => {
        vertices[index * 3 + 2] = this.normalizeValue(value);
      });
      
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  
    normalizeValue(value) {
      return Math.log(value + 1) * 0.5;
    }
  
    // =====================
    // USER INTERACTIONS
    // =====================
  
    initParametricControls() {
      document.querySelectorAll('[data-parametric-control]').forEach(control => {
        control.addEventListener('input', (e) => {
          this.handleParametricChange(e);
          this.calculateTVM({
            principal: document.getElementById('principal-input').value,
            rate: document.getElementById('rate-input').value,
            years: document.getElementById('term-input').value
          });
        });
      });
    }
  
    handleParametricChange(event) {
      const target = event.target;
      const param = target.dataset.parametricControl;
      const value = target.value;
      
      // Update linked controls
      if (target.type === 'range') {
        document.getElementById(`${param}-text`).value = value;
      } else {
        document.getElementById(`${param}-input`).value = value;
      }
      
      // Update output display
      const output = document.querySelector(`output[for="${param}-input, ${param}-text"]`);
      if (output) {
        output.textContent = param === 'rate' 
          ? `${parseFloat(value).toFixed(2)}%`
          : param === 'term'
          ? `${value} Years`
          : `$${parseFloat(value).toLocaleString('en-US')}`;
      }
  
      this.saveProgress();
    }
  
    updateFinancialMetrics(projection) {
      document.querySelector('[data-metric-id="future-value"] .metric-value')
        .textContent = `$${projection.futureValue.toLocaleString('en-US', { 
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 
        })}`;
      
      document.querySelector('[data-metric-id="interest-earned"] .metric-value')
        .textContent = `$${projection.interest.toLocaleString('en-US', { 
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 
        })}`;
    }
  
    // =====================
    // PROGRESS MANAGEMENT
    // =====================
  
    loadProgress() {
      const saved = localStorage.getItem('financialProgress');
      if (!saved) return {
        completedModules: [],
        parametricStates: new Map([
          ['principal', 100000],
          ['rate', 7],
          ['term', 10]
        ]),
        achievements: [],
        portfolioState: null
      };
  
      const data = JSON.parse(saved);
      return {
        ...data,
        parametricStates: new Map(data.parametricStates)
      };
    }
  
    saveProgress() {
      const progressData = {
        ...this.state.userProgress,
        parametricStates: Array.from(this.state.userProgress.parametricStates.entries())
      };
      localStorage.setItem('financialProgress', JSON.stringify(progressData));
    }
  
    restoreProgress() {
      this.state.userProgress.parametricStates.forEach((value, param) => {
        const input = document.getElementById(`${param}-input`);
        if (input) {
          input.value = value;
          input.dispatchEvent(new Event('input'));
        }
      });
    }
  
    // =====================
    // ANIMATION & RENDERING
    // =====================
  
    animate() {
      requestAnimationFrame(this.animate.bind(this));
      
      if (this.controls) {
        this.controls.update();
      }
      
      this.renderer.render(this.state.threeScene, this.camera);
    }
  
    handleResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  
    // =====================
    // UTILITIES
    // =====================
  
    debounce(func, wait) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    }
  
    setupHotkeys() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.navigate('previous');
        if (e.key === 'ArrowRight') this.navigate('next');
      });
    }
  
    initHammerGestures() {
      const hammer = new Hammer(document.body);
      hammer.on('swipeleft', () => this.navigate('next'));
      hammer.on('swiperight', () => this.navigate('previous'));
    }
  
    navigate(direction) {
      // Add navigation logic here
      console.log(`Navigating ${direction}`);
    }
  }
  
  // Initialize application
  document.addEventListener('DOMContentLoaded', () => {
    const financialPlatform = new FinancialMastery();
    window.financialPlatform = financialPlatform;
  });