/**
 * Survival UI - Display hunger, thirst, stamina with controls
 */
export class SurvivalUI {
    constructor(survivalSystem) {
        this.survivalSystem = survivalSystem;
        this.container = null;
        this.bars = {};
        this.initialize();
    }
    
    initialize() {
        this.container = document.createElement('div');
        this.container.id = 'survival-ui';
        this.container.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.8);padding:15px;border-radius:10px;border:2px solid #ffd700;min-width:250px;z-index:1000;font-family:Arial,sans-serif;';
        
        const title = document.createElement('div');
        title.textContent = 'SURVIVAL';
        title.style.cssText = 'color:#ffd700;font-size:16px;font-weight:bold;margin-bottom:10px;text-align:center;';
        this.container.appendChild(title);
        
        this.createStatBar('health', 'Health', '#ff0000');
        this.createStatBar('hunger', 'Hunger', '#ff8800');
        this.createStatBar('thirst', 'Thirst', '#00aaff');
        this.createStatBar('stamina', 'Stamina', '#00ff00');
        
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = 'margin-top:15px;display:flex;gap:5px;';
        
        const eatBtn = this.createButton('🍖 Eat', () => {
            this.survivalSystem.eat({ hungerValue: 30 });
        });
        const drinkBtn = this.createButton('💧 Drink', () => {
            this.survivalSystem.drink({ thirstValue: 40 });
        });
        const restBtn = this.createButton('💤 Rest', () => {
            this.survivalSystem.rest();
        });
        
        btnContainer.appendChild(eatBtn);
        btnContainer.appendChild(drinkBtn);
        btnContainer.appendChild(restBtn);
        this.container.appendChild(btnContainer);
        
        document.body.appendChild(this.container);
    }
    
    createStatBar(id, label, color) {
        const bar = document.createElement('div');
        bar.style.cssText = 'margin-bottom:8px;';
        
        const lbl = document.createElement('div');
        lbl.textContent = label;
        lbl.style.cssText = `color:${color};font-size:12px;font-weight:bold;margin-bottom:3px;`;
        
        const bg = document.createElement('div');
        bg.style.cssText = 'background:rgba(255,255,255,0.2);height:20px;border-radius:10px;overflow:hidden;position:relative;';
        
        const fill = document.createElement('div');
        fill.style.cssText = `background:${color};height:100%;width:100%;transition:width 0.3s;`;
        
        const text = document.createElement('div');
        text.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:bold;text-shadow:1px 1px 2px black;';
        
        bg.appendChild(fill);
        bg.appendChild(text);
        bar.appendChild(lbl);
        bar.appendChild(bg);
        this.container.appendChild(bar);
        
        this.bars[id] = { fill, text };
    }
    
    createButton(txt, onClick) {
        const btn = document.createElement('button');
        btn.textContent = txt;
        btn.style.cssText = 'flex:1;padding:8px;background:#4a4a4a;color:white;border:1px solid #666;border-radius:5px;cursor:pointer;font-size:11px;';
        btn.addEventListener('click', onClick);
        return btn;
    }
    
    update() {
        const stats = this.survivalSystem.getStats();
        this.updateBar('health', stats.health, stats.maxHealth);
        this.updateBar('hunger', stats.hunger, stats.maxHunger);
        this.updateBar('thirst', stats.thirst, stats.maxThirst);
        this.updateBar('stamina', stats.stamina, stats.maxStamina);
    }
    
    updateBar(id, current, max) {
        const bar = this.bars[id];
        if (!bar) return;
        const percent = (current / max) * 100;
        bar.fill.style.width = percent + '%';
        bar.text.textContent = `${Math.round(current)}/${max}`;
    }
}
