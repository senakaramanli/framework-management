/**
 * Framework List Component
 * Manages the sidebar framework list and selection
 */
class FrameworkList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.frameworks = [];
    this.selectedFramework = null;
    this.onFrameworkSelect = null;

    this.init();
  }

  async init() {
    await this.loadFrameworks();
    this.render();
    this.bindEvents();
  }

  async loadFrameworks() {
    try {
      this.frameworks = await api.getFrameworks();
    } catch (error) {
      console.error("Failed to load frameworks:", error);
      this.frameworks = [];
    }
  }

  render() {
    if (!this.container) return;

    if (this.frameworks.length === 0) {
      this.container.innerHTML = `
                <div class="text-center text-muted p-4">
                    <i class="bi bi-exclamation-circle"></i>
                    <p class="mt-2">No frameworks available</p>
                </div>
            `;
      return;
    }

    const frameworksHtml = this.frameworks
      .filter((framework) => true)
      .map((framework) => this.createFrameworkCard(framework))
      .join("");

    this.container.innerHTML = `
            <div class="framework-list">
                ${frameworksHtml}
            </div>
        `;
  }

  createFrameworkCard(framework) {
    const statusClass = this.getStatusClass(framework.status);
    const statusText = this.getStatusText(framework.status);
    const statusIcon = this.getStatusIcon(framework.status);
    const isSelected = this.selectedFramework?.id === framework.id;

    return `
            <div class="framework-list__item">
                <div class="framework-card ${
                  isSelected ? "framework-card--active" : ""
                }" 
                     data-framework-id="${framework.id}">
                    <div class="framework-card__badge" style="display: ${
                      framework.status ? "block" : "none"
                    }">
                        <span class="badge badge--${statusClass}">
                            ${this.renderStatusIcon(
                              statusIcon
                            )} ${statusText}</span>
                    </div>
                    <div class="framework-card__header">
                        <div class="framework-card__icon">
                            <img src="${framework.icon}" alt="${
      framework.name
    }" 
                                 onerror="this.src='assets/icons/Vector.svg'">
                        </div>
                        <div class="framework-card__content">
                            <div class="framework-card__type">${
                              framework.type
                            }</div>
                            <div class="framework-card__title">${
                              framework.name
                            }</div>
                            <div class="framework-card__description">${
                              framework.description
                            }</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  getStatusClass(status) {
    const statusMap = {
      "ready-to-map": "ready-to-map",
      "mapping-in-progress": "mapping-in-progress",
      "ready-to-publish": "ready-to-publish",
      "mapping-failed": "mapping-failed",
      published: "published",
      deactivated: "deactivated",
    };
    return statusMap[status] || "deactivated";
  }

  renderStatusIcon(iconName) {
    if (iconName === "playlist-check") {
      return '<img src="assets/icons/playlist-check.svg" alt="playlist-check" class="status-icon">';
    } else if (iconName === "archive-lock") {
      return '<img src="assets/icons/archive-lock.svg" alt="archive-lock" class="status-icon">';
    } else {
      return `${iconName ? `<i class="bi ${iconName}"></i>` : ""}`;
    }
  }

  getStatusIcon(status) {
    const statusIconMap = {
      "ready-to-map": "bi-info-circle-fill",
      "mapping-in-progress": "bi-gear-fill",
      "ready-to-publish": "playlist-check",
      "mapping-failed": "bi-x-lg",
      published: "bi-check2",
      deactivated: "archive-lock",
    };
    return statusIconMap[status] || "bi-archive";
  }

  getStatusText(status) {
    const statusMap = {
      "ready-to-map": "Ready to Map",
      "mapping-in-progress": "Mapping in Progress",
      "ready-to-publish": "Ready to Publish",
      "mapping-failed": "Mapping Failed",
      published: "Published",
      deactivated: "Deactivated",
    };
    return statusMap[status] || "Unknown";
  }

  bindEvents() {
    if (!this.container) return;

    // Use event delegation for dynamic content
    this.container.addEventListener("click", (e) => {
      const frameworkCard = e.target.closest(".framework-card");
      if (frameworkCard) {
        const frameworkId = parseInt(frameworkCard.dataset.frameworkId);
        this.selectFramework(frameworkId);
      }
    });
  }

  selectFramework(frameworkId) {
    // Find the framework
    const framework = this.frameworks.find((f) => f.id === frameworkId);
    if (!framework) return;

    // Update selection
    this.selectedFramework = framework;

    // Update UI
    this.updateSelection();

    // Notify callback
    if (this.onFrameworkSelect) {
      this.onFrameworkSelect(framework);
    }
  }

  updateSelection() {
    // Remove active class from all cards
    const allCards = this.container.querySelectorAll(".framework-card");
    allCards.forEach((card) => {
      card.classList.remove("framework-card--active");
    });

    // Add active class to selected card
    if (this.selectedFramework) {
      const selectedCard = this.container.querySelector(
        `[data-framework-id="${this.selectedFramework.id}"]`
      );
      if (selectedCard) {
        selectedCard.classList.add("framework-card--active");
      }
    }
  }

  getSelectedFramework() {
    return this.selectedFramework;
  }

  setOnFrameworkSelect(callback) {
    this.onFrameworkSelect = callback;
  }

  refresh() {
    this.loadFrameworks().then(() => {
      this.render();
      this.bindEvents();
    });
  }

  destroy() {
    if (this.container) {
      this.container.removeEventListener("click", this.handleClick);
    }
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = FrameworkList;
}
