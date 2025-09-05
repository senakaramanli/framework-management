/**
 * Data Table - Manages the display of control data
 */
class DataTable {
  constructor(container, api) {
    this.container = container;
    this.api = api;
    this.controls = [];
    this.filteredControls = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.sortColumn = null;
    this.sortDirection = 'asc';
    
    this.init();
  }

  init() {
    console.log('DataTable initialized');
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterControls(e.target.value);
      });
    }

    // Sort functionality
    const sortableHeaders = this.container.querySelectorAll('.sortable');
    sortableHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const column = header.dataset.sort;
        this.sortControls(column);
      });
    });

    // Entries per page dropdown
    const entriesPerPage = document.getElementById('entriesPerPage');
    if (entriesPerPage) {
      entriesPerPage.addEventListener('change', (e) => {
        this.itemsPerPage = parseInt(e.target.value);
        this.currentPage = 1;
        this.render();
      });
    }

    // Pagination functionality
    this.setupPaginationListeners();
  }

  setupPaginationListeners() {
    // Previous button
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.render();
        }
      });
    }

    // Next button
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(this.filteredControls.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.render();
        }
      });
    }

    // Page number buttons
    const pageButtons = document.querySelectorAll('[data-page]');
    pageButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const pageNumber = parseInt(btn.dataset.page);
        if (!isNaN(pageNumber)) {
          this.currentPage = pageNumber;
          this.render();
        }
      });
    });
  }

  loadControls(controls) {
    console.log('Loading controls:', controls);
    this.controls = controls || [];
    this.filteredControls = [...this.controls];
    this.currentPage = 1;
    
    // Show data table and hide empty state
    this.showDataTable();
    this.render();
  }

  showDataTable() {
    const placeholder = document.getElementById('dataTablePlaceholder');
    const dataTable = document.getElementById('dataTable');
    
    if (placeholder) {
      placeholder.style.display = 'none';
    }
    
    if (dataTable) {
      dataTable.style.display = 'block';
    }
  }

  showEmptyState() {
    const placeholder = document.getElementById('dataTablePlaceholder');
    const dataTable = document.getElementById('dataTable');
    
    if (placeholder) {
      placeholder.style.display = 'block';
    }
    
    if (dataTable) {
      dataTable.style.display = 'none';
    }
  }

  render() {
    if (!this.container) {
      console.error('DataTable container not found');
      return;
    }

    const tbody = this.container.querySelector('#controlsTableBody');
    if (!tbody) {
      console.error('Table body not found');
      return;
    }

    if (this.filteredControls.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No controls available</td></tr>';
      this.updatePaginationInfo();
      this.updatePaginationButtons();
      return;
    }

    // Calculate pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const pageControls = this.filteredControls.slice(startIndex, endIndex);

    // Render table rows
    tbody.innerHTML = pageControls.map(control => `
      <tr>
        <td>${this.escapeHtml(control.id)}</td>
        <td>${this.escapeHtml(control.category)}</td>
        <td>${this.escapeHtml(control.description)}</td>
      </tr>
    `).join('');

    // Update pagination info and buttons
    this.updatePaginationInfo();
    this.updatePaginationButtons();
  }

  filterControls(searchTerm) {
    if (!searchTerm.trim()) {
      this.filteredControls = [...this.controls];
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredControls = this.controls.filter(control => 
        control.id.toLowerCase().includes(term) ||
        control.category.toLowerCase().includes(term) ||
        control.description.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.render();
  }

  sortControls(column) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Sort filtered controls
    this.filteredControls.sort((a, b) => {
      let aVal = a[column] || '';
      let bVal = b[column] || '';
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (this.sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    this.render();
    this.updateSortIndicators();
  }

  updateSortIndicators() {
    const headers = this.container.querySelectorAll('.sortable');
    headers.forEach(header => {
      const indicator = header.querySelector('.sort-indicator');
      if (header.dataset.sort === this.sortColumn) {
        indicator.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
      } else {
        indicator.textContent = '↕';
      }
    });
  }

  updatePaginationInfo() {
    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
      const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredControls.length);
      paginationInfo.textContent = `Showing ${startIndex} to ${endIndex} of ${this.filteredControls.length} entries`;
    }
  }

  updatePaginationButtons() {
    const totalPages = Math.ceil(this.filteredControls.length / this.itemsPerPage);
    
    // Update Previous button
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
      prevBtn.disabled = this.currentPage === 1;
      if (this.currentPage === 1) {
        prevBtn.classList.add('disabled');
      } else {
        prevBtn.classList.remove('disabled');
      }
    }

    // Update Next button
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      nextBtn.disabled = this.currentPage === totalPages;
      if (this.currentPage === totalPages) {
        nextBtn.classList.add('disabled');
      } else {
        nextBtn.classList.remove('disabled');
      }
    }

    // Update page number buttons
    const pageButtons = document.querySelectorAll('[data-page]');
    pageButtons.forEach(btn => {
      const pageNumber = parseInt(btn.dataset.page);
      if (!isNaN(pageNumber)) {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-secondary');
        
        if (pageNumber === this.currentPage) {
          btn.classList.remove('btn-outline-secondary');
          btn.classList.add('btn-primary');
        }
      }
    });
  }

  // Utility method to escape HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Export for use in other modules
window.DataTable = DataTable;
