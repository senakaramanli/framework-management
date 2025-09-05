/**
 * API Module - Handles all API calls and data fetching
 */
class API {
  constructor() {
    this.baseUrl = '/mock';
  }

  /**
   * Fetch frameworks list
   * @returns {Promise<Object>} Object with custom and system frameworks
   */
  async getFrameworks() {
    try {
      const response = await fetch(`${this.baseUrl}/frameworks.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching frameworks:', error);
      throw error;
    }
  }

  /**
   * Fetch controls for a specific framework
   * @param {number} frameworkId - The framework ID
   * @returns {Promise<Array>} Array of controls
   */
  async getControls(frameworkId) {
    try {
      const response = await fetch(`${this.baseUrl}/controls-${frameworkId}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching controls for framework ${frameworkId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new framework
   * @param {Object} frameworkData - Framework data
   * @returns {Promise<Object>} Created framework
   */
  async createFramework(frameworkData) {
    try {
      // In a real app, this would be a POST request
      // For now, we'll simulate success
      const newFramework = {
        id: Date.now(), // Simple ID generation
        ...frameworkData,
        status: 'ready',
        icon: 'custom'
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newFramework;
    } catch (error) {
      console.error('Error creating framework:', error);
      throw error;
    }
  }

  /**
   * Update framework controls
   * @param {number} frameworkId - Framework ID
   * @param {Array} controls - Controls array
   * @returns {Promise<Object>} Updated framework
   */
  async updateFrameworkControls(frameworkId, controls) {
    try {
      // In a real app, this would be a PUT request
      // For now, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        id: frameworkId,
        controlsCount: controls.length
      };
    } catch (error) {
      console.error('Error updating framework controls:', error);
      throw error;
    }
  }
}

// Export for use in other modules
window.API = API;
