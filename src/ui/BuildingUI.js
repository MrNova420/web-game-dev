/**
 * Building UI - Construct structures and manage base
 */
export class BuildingUI {
    constructor(buildingSystem) {
        this.buildingSystem = buildingSystem;
        this.container = null;
        this.initialize();
    }
    
    initialize() {
        this.container = document.createElement('div');
        this.container.id = 'building-ui';
        this.container.style.cssText = 'position:fixed;bottom:10px;right:10px;background:rgba(0,0,0,0.8);padding:15px;border-radius:10px;border:2px solid #ff8800;min-width:300px;max-height:500px;overflow-y:auto;z-index:1000;font-family:Arial,sans-serif;display:none;';
        
        const title = document.createElement('div');
        title.textContent = '🏗️ BUILDING';
        title.style.cssText = 'color:#ff8800;font-size:18px;font-weight:bold;margin-bottom:15px;text-align:center;';
        this.container.appendChild(title);
        
        this.createBuildingList();
        this.createConstructionQueue();
        
        document.body.appendChild(this.container);
    }
    
    createBuildingList() {
        const section = document.createElement('div');
        section.innerHTML = '<div style="color:#ff8800;font-weight:bold;margin-bottom:10px;">Available Buildings:</div>';
        
        const buildings = this.buildingSystem.getBuildingTypes();
        const container = document.createElement('div');
        
        buildings.forEach(bldg => {
            const item = document.createElement('div');
            item.style.cssText = 'background:#2a2a2a;padding:10px;margin-bottom:8px;border-radius:5px;cursor:pointer;transition:background 0.2s;';
            
            item.innerHTML = `
                <div style="color:#ff8800;font-weight:bold;font-size:14px;">${bldg.name}</div>
                <div style="color:#aaa;font-size:11px;margin-top:3px;">${bldg.description}</div>
                <div style="color:#00ff00;font-size:11px;margin-top:5px;">Build Time: ${(bldg.buildTime/1000/60).toFixed(1)} min</div>
            `;
            
            item.addEventListener('mouseenter', () => item.style.background = '#3a3a3a');
            item.addEventListener('mouseleave', () => item.style.background = '#2a2a2a');
            item.addEventListener('click', () => {
                this.buildingSystem.startConstruction(bldg.key);
                this.showNotification(`Started building ${bldg.name}!`);
                this.update();
            });
            
            container.appendChild(item);
        });
        
        section.appendChild(container);
        this.container.appendChild(section);
    }
    
    createConstructionQueue() {
        this.queueContainer = document.createElement('div');
        this.queueContainer.innerHTML = '<div style="color:#ff8800;font-weight:bold;margin:15px 0 10px;">Construction Queue:</div>';
        this.container.appendChild(this.queueContainer);
    }
    
    update() {
        const constructing = this.buildingSystem.getConstructingBuildings();
        let html = '<div style="color:#ff8800;font-weight:bold;margin:15px 0 10px;">Construction Queue:</div>';
        
        if (constructing.length === 0) {
            html += '<div style="color:#666;font-size:12px;text-align:center;padding:10px;">No buildings under construction</div>';
        } else {
            constructing.forEach((build, idx) => {
                const progress = (build.progress * 100).toFixed(0);
                html += `<div style="background:#2a2a2a;padding:10px;margin-bottom:8px;border-radius:5px;">
                    <div style="color:white;font-size:13px;font-weight:bold;">${build.building.name}</div>
                    <div style="background:#1a1a1a;height:10px;border-radius:5px;overflow:hidden;margin-top:8px;">
                        <div style="background:#ff8800;height:100%;width:${progress}%;"></div>
                    </div>
                    <div style="color:#ff8800;font-size:11px;margin-top:5px;">${progress}% Complete</div>
                </div>`;
            });
        }
        
        this.queueContainer.innerHTML = html;
    }
    
    showNotification(msg) {
        const notif = document.createElement('div');
        notif.textContent = msg;
        notif.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.9);color:#ff8800;padding:20px 40px;border-radius:10px;border:2px solid #ff8800;font-size:16px;font-weight:bold;z-index:10000;';
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2000);
    }
    
    toggle() {
        this.container.style.display = this.container.style.display === 'none' ? 'block' : 'none';
        if (this.container.style.display === 'block') this.update();
    }
}
