// src/utils/antiBot.js
class AntiBotProtection {
    constructor() {
      this.startTime = Date.now();
      this.interactions = [];
    }
  
    recordInteraction(type, element) {
      this.interactions.push({
        type,
        element: element.tagName,
        timestamp: Date.now() - this.startTime,
        coordinates: this.getMousePosition()
      });
    }
  
    getMousePosition() {
      return {
        x: this.lastMouseX || 0,
        y: this.lastMouseY || 0
      };
    }
  
    getBehaviorAnalysis() {
      const timeOnPage = Date.now() - this.startTime;
      const hasNaturalInteractions = this.interactions.length > 2;
      const hasMouseMovement = this.interactions.some(i => i.type === 'mousemove');
      
      return {
        timeOnPage,
        interactionCount: this.interactions.length,
        hasNaturalBehavior: timeOnPage > 5000 && hasNaturalInteractions && hasMouseMovement,
        interactions: this.interactions.slice(-10) // Last 10 interactions
      };
    }
  
    init() {
      document.addEventListener('mousemove', (e) => {
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        this.recordInteraction('mousemove', e.target);
      });
  
      document.addEventListener('click', (e) => {
        this.recordInteraction('click', e.target);
      });
  
      document.addEventListener('keydown', (e) => {
        this.recordInteraction('keydown', e.target);
      });
    }
  }
  
  export const antiBotProtection = new AntiBotProtection();