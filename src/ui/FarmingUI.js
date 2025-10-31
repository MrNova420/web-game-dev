/**
 * Farming UI - Manage crops, planting, harvesting
 */
export class FarmingUI {
    constructor(farmingSystem) {
        this.farmingSystem = farmingSystem;
        this.container = null;
        this.initialize();
    }
    
    initialize() {
        this.container = document.createElement('div');
        this.container.id = 'farming-ui';
        this.container.style.cssText = 'position:fixed;bottom:10px;left:10px;background:rgba(0,0,0,0.8);padding:15px;border-radius:10px;border:2px solid #00ff00;min-width:350px;max-height:400px;overflow-y:auto;z-index:1000;font-family:Arial,sans-serif;display:none;';
        
        const title = document.createElement('div');
        title.textContent = '🌾 FARMING';
        title.style.cssText = 'color:#00ff00;font-size:18px;font-weight:bold;margin-bottom:15px;text-align:center;';
        this.container.appendChild(title);
        
        this.createCropSelector();
        this.createPlotGrid();
        this.createCropList();
        
        document.body.appendChild(this.container);
    }
    
    createCropSelector() {
        const section = document.createElement('div');
        section.innerHTML = '<div style="color:#00ff00;font-weight:bold;margin-bottom:5px;">Plant Crop:</div>';
        
        const crops = this.farmingSystem.getCropTypes();
        const select = document.createElement('select');
        select.style.cssText = 'width:100%;padding:8px;background:#2a2a2a;color:white;border:1px solid #00ff00;border-radius:5px;margin-bottom:10px;';
        
        crops.forEach(crop => {
            const option = document.createElement('option');
            option.value = crop.key;
            option.textContent = `${crop.name} (${(crop.growTime/1000/60).toFixed(1)}min)`;
            select.appendChild(option);
        });
        
        section.appendChild(select);
        
        const plantBtn = document.createElement('button');
        plantBtn.textContent = '🌱 Plant Selected Crop';
        plantBtn.style.cssText = 'width:100%;padding:10px;background:#00aa00;color:white;border:none;border-radius:5px;cursor:pointer;font-weight:bold;';
        plantBtn.addEventListener('click', () => {
            const cropType = select.value;
            const plotId = 0; // Would need plot selection
            this.farmingSystem.plantCrop(plotId, cropType);
            this.showNotification(`Planted ${crops.find(c=>c.key===cropType).name}!`);
            this.update();
        });
        section.appendChild(plantBtn);
        
        this.container.appendChild(section);
    }
    
    createPlotGrid() {
        const section = document.createElement('div');
        section.innerHTML = '<div style="color:#00ff00;font-weight:bold;margin:15px 0 5px;">Farm Plots:</div>';
        
        const grid = document.createElement('div');
        grid.style.cssText = 'display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-bottom:10px;';
        
        for (let i = 0; i < 20; i++) {
            const plot = document.createElement('div');
            plot.textContent = i + 1;
            plot.style.cssText = 'background:#3a3a3a;padding:15px 5px;text-align:center;border-radius:5px;cursor:pointer;color:#fff;font-size:12px;';
            plot.addEventListener('click', () => {
                alert(`Plot ${i+1} selected`);
            });
            grid.appendChild(plot);
        }
        
        section.appendChild(grid);
        this.container.appendChild(section);
    }
    
    createCropList() {
        this.cropListContainer = document.createElement('div');
        this.cropListContainer.innerHTML = '<div style="color:#00ff00;font-weight:bold;margin:10px 0 5px;">Growing Crops:</div>';
        this.container.appendChild(this.cropListContainer);
    }
    
    update() {
        const growing = this.farmingSystem.getGrowingCrops();
        let html = '<div style="color:#00ff00;font-weight:bold;margin:10px 0 5px;">Growing Crops:</div>';
        
        growing.forEach(crop => {
            const progress = (crop.progress * 100).toFixed(0);
            html += `<div style="background:#2a2a2a;padding:8px;margin-bottom:5px;border-radius:5px;">
                <div style="color:white;font-size:12px;">${crop.crop.name} (Plot ${crop.plotId+1})</div>
                <div style="background:#1a1a1a;height:8px;border-radius:4px;overflow:hidden;margin-top:5px;">
                    <div style="background:#00ff00;height:100%;width:${progress}%;"></div>
                </div>
                <div style="color:#00ff00;font-size:10px;margin-top:3px;">${progress}% - Stage ${crop.growthStage}/4</div>
            </div>`;
        });
        
        this.cropListContainer.innerHTML = html;
    }
    
    showNotification(msg) {
        const notif = document.createElement('div');
        notif.textContent = msg;
        notif.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.9);color:#00ff00;padding:20px 40px;border-radius:10px;border:2px solid #00ff00;font-size:16px;font-weight:bold;z-index:10000;';
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2000);
    }
    
    toggle() {
        this.container.style.display = this.container.style.display === 'none' ? 'block' : 'none';
        if (this.container.style.display === 'block') this.update();
    }
}
