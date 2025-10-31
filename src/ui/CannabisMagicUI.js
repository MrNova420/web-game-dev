/**
 * Cannabis Magic UI - Herb cultivation and smoke abilities
 */
export class CannabisMagicUI {
    constructor(cannabisSystem) {
        this.cannabisSystem = cannabisSystem;
        this.container = null;
        this.initialize();
    }
    
    initialize() {
        this.container = document.createElement('div');
        this.container.id = 'cannabis-ui';
        this.container.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.9);padding:20px;border-radius:15px;border:3px solid #9400D3;min-width:400px;max-height:600px;overflow-y:auto;z-index:2000;font-family:Arial,sans-serif;display:none;';
        
        const title = document.createElement('div');
        title.textContent = '✨ CANNABIS MAGIC ✨';
        title.style.cssText = 'color:#9400D3;font-size:20px;font-weight:bold;margin-bottom:20px;text-align:center;text-shadow:0 0 10px #9400D3;';
        this.container.appendChild(title);
        
        this.createHerbList();
        this.createCultivationSection();
        this.createAbilitiesSection();
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = 'width:100%;padding:10px;margin-top:20px;background:#9400D3;color:white;border:none;border-radius:5px;cursor:pointer;font-weight:bold;';
        closeBtn.addEventListener('click', () => this.toggle());
        this.container.appendChild(closeBtn);
        
        document.body.appendChild(this.container);
    }
    
    createHerbList() {
        const section = document.createElement('div');
        section.innerHTML = '<div style="color:#9400D3;font-weight:bold;margin-bottom:10px;">🌿 Available Herbs:</div>';
        
        const herbs = this.cannabisSystem.getHerbTypes();
        const container = document.createElement('div');
        container.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;';
        
        herbs.forEach(herb => {
            const card = document.createElement('div');
            card.style.cssText = 'background:#2a2a2a;padding:10px;border-radius:8px;border:2px solid #9400D3;cursor:pointer;transition:all 0.2s;';
            card.innerHTML = `
                <div style="color:#9400D3;font-weight:bold;font-size:13px;">${herb.name}</div>
                <div style="color:#aaa;font-size:10px;margin-top:3px;">Power: ${herb.magicPower}</div>
            `;
            card.addEventListener('mouseenter', () => {
                card.style.background = '#3a3a3a';
                card.style.transform = 'scale(1.05)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.background = '#2a2a2a';
                card.style.transform = 'scale(1)';
            });
            container.appendChild(card);
        });
        
        section.appendChild(container);
        this.container.appendChild(section);
    }
    
    createCultivationSection() {
        this.cultivationContainer = document.createElement('div');
        this.cultivationContainer.innerHTML = '<div style="color:#9400D3;font-weight:bold;margin-bottom:10px;">🌱 Cultivation Plots:</div>';
        this.container.appendChild(this.cultivationContainer);
    }
    
    createAbilitiesSection() {
        const section = document.createElement('div');
        section.innerHTML = '<div style="color:#9400D3;font-weight:bold;margin:20px 0 10px;">💨 Smoke Abilities:</div>';
        
        const abilities = [
            { name: 'Smoke Cloud', desc: 'Create obscuring smoke', key: 'Q' },
            { name: 'Psy Wave', desc: 'Psychedelic damage wave', key: 'E' },
            { name: 'Herb Heal', desc: 'Healing herb aura', key: 'R' }
        ];
        
        abilities.forEach(ability => {
            const item = document.createElement('div');
            item.style.cssText = 'background:#2a2a2a;padding:10px;margin-bottom:8px;border-radius:5px;display:flex;justify-content:space-between;align-items:center;';
            item.innerHTML = `
                <div>
                    <div style="color:white;font-weight:bold;font-size:13px;">${ability.name}</div>
                    <div style="color:#aaa;font-size:11px;margin-top:2px;">${ability.desc}</div>
                </div>
                <div style="background:#9400D3;padding:5px 10px;border-radius:5px;color:white;font-weight:bold;font-size:12px;">${ability.key}</div>
            `;
            section.appendChild(item);
        });
        
        this.container.appendChild(section);
    }
    
    update() {
        const growing = this.cannabisSystem.getGrowingHerbs();
        let html = '<div style="color:#9400D3;font-weight:bold;margin-bottom:10px;">🌱 Cultivation Plots:</div>';
        
        growing.forEach((plot, idx) => {
            if (plot.herb) {
                const progress = (plot.progress * 100).toFixed(0);
                html += `<div style="background:#2a2a2a;padding:10px;margin-bottom:8px;border-radius:5px;">
                    <div style="color:#9400D3;font-weight:bold;">${plot.herb.name} (Plot ${idx+1})</div>
                    <div style="background:#1a1a1a;height:8px;border-radius:4px;overflow:hidden;margin-top:5px;">
                        <div style="background:#9400D3;height:100%;width:${progress}%;"></div>
                    </div>
                    <div style="color:#9400D3;font-size:11px;margin-top:3px;">${progress}% - Stage ${plot.growthStage}/5</div>
                </div>`;
            }
        });
        
        this.cultivationContainer.innerHTML = html;
    }
    
    toggle() {
        this.container.style.display = this.container.style.display === 'none' ? 'block' : 'none';
        if (this.container.style.display === 'block') this.update();
    }
}
