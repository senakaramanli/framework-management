/**
 * API Module
 * Handles all API calls with mock data fallback
 */
class API {
    constructor() {
        this.baseUrl = '/api';
        this.mockDelay = 200;
    }
    
    async getJSON(url, params = {}) {
        try {
            // Add query parameters
            const queryString = new URLSearchParams(params).toString();
            const fullUrl = queryString ? `${url}?${queryString}` : url;
            
            const response = await fetch(fullUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.warn(`API call failed: ${error.message}, using mock data`);
            return this.getMockData(url, params);
        }
    }
    
    async getFrameworks() {
        return this.getJSON(`${this.baseUrl}/frameworks`);
    }
    
    async getControls(frameworkId, page = 1, pageSize = 10) {
        const params = {
            limit: pageSize,
            page: page
        };
        return this.getJSON(`${this.baseUrl}/frameworks/${frameworkId}/controls`, params);
    }
    
    async getTablePage(frameworkId, page, pageSize) {
        return this.getControls(frameworkId, page, pageSize);
    }
    
    async getMockData(url, params = {}) {
        await new Promise(resolve => setTimeout(resolve, this.mockDelay));
        
        if (url.includes('/frameworks') && !url.includes('/controls')) {
            return this.getMockFrameworks();
        } else if (url.includes('/controls')) {
            const frameworkId = url.match(/\/frameworks\/(\d+)\/controls/)?.[1] || '1';
            return this.getMockControls(frameworkId, params.page || 1, params.limit || 10);
        }
        
        return null;
    }
    
    getMockFrameworks() {
        return [
            {
                id: 1,
                name: 'ECF 2023',
                shortName: 'ECF-2023',
                description: 'Example Custom Framework',
                status: 'ready-to-map',
                icon: 'assets/icons/ECF-2023.svg',
                controlsCount: 25,
                type: 'Custom Framework'
            },
            {
                id: 2,
                name: 'CSHRTN',
                shortName: 'CSHRTN',
                description: 'Custom Framework',
                status: 'mapping-in-progress',
                icon: 'assets/icons/CSHRTN.svg',
                controlsCount: 18,
                type: 'Custom Framework'
            },
            {
                id: 3,
                name: 'DCF 2023',
                shortName: 'DCF-2023',
                description: 'Demo Custom Framework',
                status: 'ready-to-publish',
                icon: 'assets/icons/DCF-2023.svg',
                controlsCount: 32,
                type: 'Custom Framework'
            },
            {
                id: 4,
                name: 'CF',
                shortName: 'CF',
                description: 'Cybersecurity Framework',
                status: 'mapping-failed',
                icon: 'assets/icons/CF.svg',
                controlsCount: 0,
                type: 'Custom Framework'
            },
            {
                id: 5,
                name: 'ISCF',
                shortName: 'ISCF',
                description: 'Internet Security Custom Framework',
                icon: 'assets/icons/ISCF.svg',
                controlsCount: 45,
                type: 'Custom Framework'
            },
            {
                id: 6,
                name: 'CSHRTN 2',
                shortName: 'CSHRTN-2',
                description: 'Custom Framework',
                status: 'deactivated',
                icon: 'assets/icons/CSHRTN-2.svg',
                controlsCount: 12,
                type: 'Custom Framework'
            },
            {
                id: 7,
                name: 'GDPR',
                shortName: 'GDPR',
                description: 'General Data Protection Regulation',
                icon: 'assets/icons/GDPR.svg',
                controlsCount: 53,
                type: 'System Framework'
            },
            {
                id: 8,
                name: 'NIST CSF',
                shortName: 'NIST-CSF',
                description: 'NIST Cybersecurity Framework',
                icon: 'assets/icons/CF.svg',
                controlsCount: 67,
                type: 'System Framework'
            },
            {
                id: 9,
                name: 'ISO27001',
                shortName: 'ISO27001',
                description: 'Internet Security Management',
                icon: 'assets/icons/ISCF.svg',
                controlsCount: 89,
                type: 'System Framework'
            }
        ];
    }
    
    getMockControls(frameworkId, page = 1, pageSize = 10) {
        const allControls = this.generateMockControls(frameworkId);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const controls = allControls.slice(startIndex, endIndex);
        
        return {
            data: controls,
            pagination: {
                currentPage: page,
                pageSize: pageSize,
                totalItems: allControls.length,
                totalPages: Math.ceil(allControls.length / pageSize),
                hasNext: endIndex < allControls.length,
                hasPrev: page > 1
            }
        };
    }
    
    generateMockControls(frameworkId) {
        const controls = [
            {
                id: 'Article I-0-1.1',
                category: 'Article I, Business Contact Information',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
            },
            {
                id: 'Article I-0-1.2',
                category: 'Article I, Business Contact Information',
                description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
            },
            {
                id: 'Article I-0-1.3',
                category: 'Article I, Business Contact Information',
                description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            },
            {
                id: 'Article II-0',
                category: 'Article II, Technical and Organizational Measures',
                description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.'
            },
            {
                id: 'Article VIII-1-1.4',
                category: 'Article VIII, Data Protection Impact Assessment',
                description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
            },
            {
                id: 'Article III-2-1.1',
                category: 'Article III, Data Subject Rights',
                description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.'
            },
            {
                id: 'Article IV-1-2.3',
                category: 'Article IV, Data Processing Principles',
                description: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.'
            },
            {
                id: 'Article V-0-1.5',
                category: 'Article V, Data Security Measures',
                description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.'
            },
            {
                id: 'Article VI-2-1.2',
                category: 'Article VI, Data Breach Notification',
                description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.'
            },
            {
                id: 'Article VII-1-3.4',
                category: 'Article VII, Cross-Border Data Transfers',
                description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.'
            }
        ];
        
        // Generate more controls to reach 53 total
        const additionalControls = [];
        for (let i = 11; i <= 53; i++) {
            const articleNum = Math.floor((i - 1) / 10) + 1;
            const sectionNum = Math.floor(((i - 1) % 10) / 3) + 1;
            const controlNum = ((i - 1) % 3) + 1;
            
            additionalControls.push({
                id: `Article ${String.fromCharCode(64 + articleNum)}-${sectionNum}-${controlNum}.${i}`,
                category: `Article ${String.fromCharCode(64 + articleNum)}, ${this.getCategoryName(articleNum)}`,
                description: `Control description for Article ${String.fromCharCode(64 + articleNum)}-${sectionNum}-${controlNum}.${i}. This control ensures compliance with data protection requirements and establishes necessary safeguards for personal data processing activities.`
            });
        }
        
        return [...controls, ...additionalControls];
    }
    
    getCategoryName(articleNum) {
        const categories = [
            'Business Contact Information',
            'Technical and Organizational Measures',
            'Data Subject Rights',
            'Data Processing Principles',
            'Data Security Measures',
            'Data Breach Notification',
            'Cross-Border Data Transfers',
            'Data Protection Impact Assessment',
            'Supervisory Authority Cooperation'
        ];
        return categories[articleNum - 1] || 'General Compliance Requirements';
    }
}

const api = new API();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
