/**
 * Data Table Component
 * Manages the controls table with pagination and actions
 */

class DataTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.placeholder = document.getElementById('dataTablePlaceholder');
        this.table = null;
        this.currentFrameworkId = null;
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalItems = 0;
        this.totalPages = 0;
        this.data = [];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    async initTable(frameworkId, page = 1, pageSize = 10) {
        // Destroy existing table if it exists
        this.destroy();
        
        this.currentFrameworkId = frameworkId;
        this.currentPage = page;
        this.pageSize = pageSize;
        
        // Show loading state
        this.showLoading();
        
        try {
            // Load data
            const response = await api.getTablePage(frameworkId, page, pageSize);
            this.data = response.data || [];
            this.totalItems = response.pagination?.totalItems || 0;
            this.totalPages = response.pagination?.totalPages || 0;
            
            // Render table
            this.render();
            this.showTable();
            
        } catch (error) {
            console.error('Failed to load table data:', error);
            this.showError('Failed to load data');
        }
    }
    
    render() {
        if (!this.container) return;
        
        // Render table body
        const tbody = this.container.querySelector('#controlsTableBody');
        if (tbody) {
            tbody.innerHTML = this.data.map(control => 
                this.createTableRow(control)
            ).join('');
        }
        
        // Update pagination
        this.updatePagination();
        
        // Update pagination info
        this.updatePaginationInfo();
    }
    
    createTableRow(control) {
        return `
            <tr>
                <td>${control.id}</td>
                <td>
                    <span class="category-badge">${control.category}</span>
                </td>
                <td>
                    <div class="description-text" title="${control.description}">
                        ${control.description}
                    </div>
                </td>
            </tr>
        `;
    }
    
    updatePagination() {
        const paginationNav = this.container.querySelector('#paginationNav');
        if (!paginationNav) return;
        
        // Clear existing pagination
        paginationNav.innerHTML = '';
        
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'btn btn-sm btn-outline-secondary';
        prevBtn.id = 'prevBtn';
        prevBtn.textContent = 'Previous';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        paginationNav.appendChild(prevBtn);
        
        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, this.currentPage + 2);
        
        // First page
        if (startPage > 1) {
            const firstBtn = this.createPageButton(1);
            paginationNav.appendChild(firstBtn);
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationNav.appendChild(ellipsis);
            }
        }
        
        // Page range
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = this.createPageButton(i);
            paginationNav.appendChild(pageBtn);
        }
        
        // Last page
        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationNav.appendChild(ellipsis);
            }
            
            const lastBtn = this.createPageButton(this.totalPages);
            paginationNav.appendChild(lastBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-sm btn-outline-secondary';
        nextBtn.id = 'nextBtn';
        nextBtn.textContent = 'Next';
        nextBtn.disabled = this.currentPage === this.totalPages;
        nextBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        paginationNav.appendChild(nextBtn);
    }
    
    createPageButton(pageNumber) {
        const button = document.createElement('button');
        button.className = `btn btn-sm ${pageNumber === this.currentPage ? 'btn-primary' : 'btn-outline-secondary'}`;
        button.textContent = pageNumber;
        button.addEventListener('click', () => this.goToPage(pageNumber));
        return button;
    }
    
    updatePaginationInfo() {
        const paginationInfo = this.container.querySelector('#paginationInfo');
        if (!paginationInfo) return;
        
        const startItem = (this.currentPage - 1) * this.pageSize + 1;
        const endItem = Math.min(this.currentPage * this.pageSize, this.totalItems);
        
        paginationInfo.textContent = `Showing ${startItem} to ${endItem} of ${this.totalItems} entries`;
    }
    
    async goToPage(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) {
            return;
        }
        
        await this.initTable(this.currentFrameworkId, page, this.pageSize);
    }
    
    showTable() {
        if (this.placeholder) {
            this.placeholder.style.display = 'none';
        }
        if (this.container) {
            this.container.style.display = 'block';
        }
    }
    
    showPlaceholder() {
        if (this.placeholder) {
            this.placeholder.style.display = 'flex';
        }
        if (this.container) {
            this.container.style.display = 'none';
        }
    }
    
    showLoading() {
        if (this.container) {
            this.container.classList.add('data-table--loading');
        }
    }
    
    hideLoading() {
        if (this.container) {
            this.container.classList.remove('data-table--loading');
        }
    }
    
    showError(message) {
        this.hideLoading();
        if (this.container) {
            this.container.classList.add('data-table--empty');
            const tbody = this.container.querySelector('#controlsTableBody');
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center text-muted">
                            <i class="bi bi-exclamation-triangle"></i>
                            <p class="mt-2">${message}</p>
                        </td>
                    </tr>
                `;
            }
        }
    }
    
    bindEvents() {
        if (!this.container) return;
        
        // Search functionality
        const searchInput = document.querySelector('#searchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }
        
        // Page size change
        const entriesPerPage = document.querySelector('#entriesPerPage');
        if (entriesPerPage) {
            entriesPerPage.addEventListener('change', (e) => {
                this.pageSize = parseInt(e.target.value);
                this.initTable(this.currentFrameworkId, 1, this.pageSize);
            });
        }
        
        
        // Sorting
        this.container.addEventListener('click', (e) => {
            const sortableHeader = e.target.closest('.sortable');
            if (sortableHeader) {
                const sortField = sortableHeader.dataset.sort;
                this.handleSort(sortField);
            }
        });
    }
    
    handleSearch(query) {
        // Simple client-side search for demo
        if (!query.trim()) {
            this.render();
            return;
        }
        
        const filteredData = this.data.filter(control => 
            control.id.toLowerCase().includes(query.toLowerCase()) ||
            control.category.toLowerCase().includes(query.toLowerCase()) ||
            control.description.toLowerCase().includes(query.toLowerCase())
        );
        
        const tbody = this.container.querySelector('#controlsTableBody');
        if (tbody) {
            tbody.innerHTML = filteredData.map(control => 
                this.createTableRow(control)
            ).join('');
        }
    }
    
    handleSort(field) {
        // Simple client-side sorting for demo
        this.data.sort((a, b) => {
            const aVal = a[field] || '';
            const bVal = b[field] || '';
            return aVal.localeCompare(bVal);
        });
        
        this.render();
    }
    
    handleAction(action, controlId) {
        console.log(`Action: ${action} on control: ${controlId}`);
        
        switch (action) {
            case 'edit':
                this.editControl(controlId);
                break;
            case 'approve':
                this.approveControl(controlId);
                break;
            case 'delete':
                this.deleteControl(controlId);
                break;
        }
    }
    
    editControl(controlId) {
        // Mock edit functionality
        alert(`Edit control: ${controlId}`);
    }
    
    approveControl(controlId) {
        // Mock approve functionality
        alert(`Approve control: ${controlId}`);
    }
    
    deleteControl(controlId) {
        // Mock delete functionality
        if (confirm(`Are you sure you want to delete control: ${controlId}?`)) {
            alert(`Delete control: ${controlId}`);
        }
    }
    
    refresh() {
        if (this.currentFrameworkId) {
            this.initTable(this.currentFrameworkId, this.currentPage, this.pageSize);
        }
    }
    
    destroy() {
        // Remove event listeners and clean up
        this.hideLoading();
        this.showPlaceholder();
        this.data = [];
        this.currentFrameworkId = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataTable;
}
