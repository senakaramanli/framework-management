class Header {
  constructor() {
    this.headerElement = null;
    this.titleElement = null;
    this.init();
  }

  init() {
    this.headerElement = document.getElementById('mainHeader');
    this.titleElement = document.getElementById('headerFrameworkTitle');
    
    if (this.headerElement) {
      this.setupEventListeners();
    } else {
    }
  }

  setupEventListeners() {
    const helpButton = document.getElementById('helpButton');
    if (helpButton) {
      helpButton.addEventListener('click', () => {
      });
    }

    const newFrameworkButton = document.getElementById('newFrameworkButton');
    if (newFrameworkButton) {
      newFrameworkButton.addEventListener('click', () => {
      });
    }
  }

  updateTitle(title) {
    if (this.titleElement) {
      this.titleElement.textContent = title;
    }
  }

  getTitle() {
    return this.titleElement ? this.titleElement.textContent : '';
  }

  updateBadge(step, totalSteps) {
    const badge = document.getElementById('headerBadge');
    if (badge) {
      badge.textContent = `${step}/${totalSteps}`;
    }
  }

  setLoading(isLoading) {
    const newFrameworkButton = document.getElementById('newFrameworkButton');
    if (newFrameworkButton) {
      if (isLoading) {
        newFrameworkButton.disabled = true;
        newFrameworkButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
      } else {
        newFrameworkButton.disabled = false;
        newFrameworkButton.innerHTML = '<i class="fas fa-plus me-2"></i>New Custom Framework <span class="badge bg-success ms-2" id="headerBadge">1/3</span>';
      }
    }
  }
}

window.Header = Header;
