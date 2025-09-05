/**
 * Framework List - Manages the display of framework cards
 */
class FrameworkList {
  constructor(container, api) {
    this.container = container;
    this.api = api;
    this.frameworks = { custom: [], system: [] };
    this.activeFramework = null;
    
    this.init();
  }

  async init() {
    try {
      await this.loadFrameworks();
      this.render();
      this.setupEventListeners();
      console.log('FrameworkList initialized with data:', this.frameworks);
    } catch (error) {
      console.error('Error initializing FrameworkList:', error);
    }
  }

  async loadFrameworks() {
    try {
      this.frameworks = await this.api.getFrameworks();
      console.log('Frameworks loaded:', this.frameworks);
    } catch (error) {
      console.error('Error loading frameworks:', error);
    }
  }

  render() {
    const customContainer = document.getElementById('customFrameworkList');
    const systemContainer = document.getElementById('systemFrameworkList');

    if (!customContainer || !systemContainer) {
      console.error('Container elements not found');
      return;
    }

    // Render custom frameworks
    if (this.frameworks.custom && this.frameworks.custom.length > 0) {
      customContainer.innerHTML = '';
      this.frameworks.custom.forEach(framework => {
        const card = this.createFrameworkCard(framework);
        customContainer.appendChild(card);
      });
    } else {
      customContainer.innerHTML = '<p class="text-muted">No custom frameworks available</p>';
    }

    // Render system frameworks
    if (this.frameworks.system && this.frameworks.system.length > 0) {
      systemContainer.innerHTML = '';
      this.frameworks.system.forEach(framework => {
        const card = this.createFrameworkCard(framework);
        systemContainer.appendChild(card);
      });
    } else {
      systemContainer.innerHTML = '<p class="text-muted">No system frameworks available</p>';
    }
  }

  createFrameworkCard(framework) {
    const card = document.createElement('div');
    card.className = 'framework-card';
    card.dataset.frameworkId = framework.id;
    
    // Add active class if this is the active framework
    if (this.activeFramework && this.activeFramework.id === framework.id) {
      card.classList.add('framework-card--active');
    }

    // Status badge mapping
    const statusMap = {
      'ready': 'Ready to Map',
      'mapping': 'Mapping in Progress',
      'publish': 'Ready to Publish',
      'failed': 'Mapping Failed',
      'published': 'Published',
      'deactivated': 'Deactivated',
      'active': 'Active'
    };

    const statusClass = framework.status === 'active' ? 'framework-card__badge--active' : 
                       framework.status === 'published' ? 'framework-card__badge--published' :
                       framework.status === 'failed' ? 'framework-card__badge--failed' :
                       framework.status === 'mapping' ? 'framework-card__badge--mapping' :
                       framework.status === 'deactivated' ? 'framework-card__badge--deactivated' :
                       'framework-card__badge--ready';

    card.innerHTML = `
      <div class="framework-card__header">
        <h4 class="framework-card__title">${this.escapeHtml(framework.name)}</h4>
        <span class="framework-card__badge ${statusClass}">
          ${statusMap[framework.status] || framework.status}
        </span>
      </div>
      <div class="framework-card__content">
        <p class="framework-card__description">${this.escapeHtml(framework.description)}</p>
        <div class="framework-card__meta">
          <span class="framework-card__version">v${framework.version}</span>
          <span class="framework-card__controls">${framework.controlCount} controls</span>
        </div>
      </div>
    `;

    return card;
  }

  setupEventListeners() {
    const customContainer = document.getElementById('customFrameworkList');
    const systemContainer = document.getElementById('systemFrameworkList');

    if (customContainer) {
      customContainer.addEventListener('click', (e) => {
        const frameworkCard = e.target.closest('.framework-card');
        if (frameworkCard) {
          const frameworkId = frameworkCard.dataset.frameworkId;
          this.selectFramework(frameworkId);
        }
      });
    }

    if (systemContainer) {
      systemContainer.addEventListener('click', (e) => {
        const frameworkCard = e.target.closest('.framework-card');
        if (frameworkCard) {
          const frameworkId = frameworkCard.dataset.frameworkId;
          this.selectFramework(frameworkId);
        }
      });
    }
  }

  async selectFramework(frameworkId) {
    try {
      // Update active state
      this.activeFramework = this.findFrameworkById(frameworkId);
      this.updateActiveState();

      // Load controls for this framework
      const controls = await this.api.getControls(frameworkId);
      
      // Notify DataTable to update
      if (window.dataTable) {
        window.dataTable.loadControls(controls);
      }

      // Update header title
      this.updateHeaderTitle(this.activeFramework);

      console.log(`Selected framework: ${this.activeFramework.name}`);
    } catch (error) {
      console.error('Error selecting framework:', error);
    }
  }

  findFrameworkById(id) {
    const allFrameworks = [
      ...this.frameworks.custom,
      ...this.frameworks.system
    ];
    return allFrameworks.find(f => f.id == id);
  }

  updateActiveState() {
    // Remove active class from all cards
    const allCards = document.querySelectorAll('.framework-card');
    allCards.forEach(card => card.classList.remove('framework-card--active'));

    // Add active class to selected card
    if (this.activeFramework) {
      const activeCard = document.querySelector(`[data-framework-id="${this.activeFramework.id}"]`);
      if (activeCard) {
        activeCard.classList.add('framework-card--active');
      }
    }
  }

  updateHeaderTitle(framework) {
    const titleElement = document.querySelector('.header__title');
    const breadcrumbActive = document.querySelector('.breadcrumb__item--active');
    
    if (titleElement) {
      titleElement.textContent = `Compliance Frameworks: ${framework.name}`;
    }
    
    if (breadcrumbActive) {
      breadcrumbActive.textContent = framework.name;
    }
  }

  addFramework(framework) {
    // Add to custom frameworks
    this.frameworks.custom.push(framework);
    this.render();
  }

  updateFramework(framework) {
    // Update framework in the list
    const index = this.frameworks.custom.findIndex(f => f.id === framework.id);
    if (index !== -1) {
      this.frameworks.custom[index] = framework;
      this.render();
    }
  }

  deleteFramework(frameworkId) {
    // Remove from custom frameworks
    this.frameworks.custom = this.frameworks.custom.filter(f => f.id !== frameworkId);
    this.render();
  }

  // Utility method to escape HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Export for use in other modules
window.FrameworkList = FrameworkList;
