class o{constructor(){this.tutorialSteps=[],this.completedSteps=new Set,this.currentStep=null,this.playerType=null,this.tutorialAssets={npc:"/assets/models/npcs/tutorial_guide.glb",animations:{idle:"/assets/animations/npc_idle.fbx",talk:"/assets/animations/npc_talk.fbx",point:"/assets/animations/npc_point.fbx"},ui:{tooltip:"/assets/ui/tooltip_panel.png",arrow:"/assets/ui/arrow_pointer.png"},icons:{move:"/assets/icons/movement.png",attack:"/assets/icons/sword.png",inventory:"/assets/icons/bag.png"}}}initialize(){logger.info("[PlayerOnboarding] Initializing onboarding system..."),this.detectPlayerType(),this.setupOnboardingFlow(),this.loadProgress(),logger.info("[PlayerOnboarding] System initialized for",this.playerType,"player")}detectPlayerType(){const e=this.loadSaveData();if(!e)this.playerType="new";else{const t=e.lastPlayTime||0;(Date.now()-t)/(1e3*60*60*24)>30?this.playerType="returning":e.level>=60?this.playerType="veteran":this.playerType="continuing"}}setupOnboardingFlow(){this.playerType==="new"?this.setupNewPlayerTutorial():this.playerType==="returning"?this.setupReturningPlayerGuide():this.setupContinuingPlayerReminders()}setupNewPlayerTutorial(){this.tutorialSteps=[{id:"welcome",title:"Welcome to Dynasty of Emberveil!",description:"Let me show you around.",type:"dialogue",duration:5e3,skippable:!0},{id:"movement",title:"Movement Controls",description:"Use WASD or Arrow Keys to move around.",type:"interactive",target:"move_10_units",skippable:!1},{id:"camera",title:"Camera Control",description:"Move your mouse to look around. Use mouse wheel to zoom.",type:"interactive",target:"rotate_camera",skippable:!1},{id:"combat_basics",title:"Combat Basics",description:"Left-click to attack. Try defeating this training dummy.",type:"combat",target:"defeat_training_dummy",skippable:!1},{id:"skills",title:"Using Skills",description:"Press 1-5 to use skills. Try using your first skill!",type:"interactive",target:"use_skill",skippable:!1},{id:"inventory",title:"Inventory System",description:"Press I to open your inventory. Items you collect appear here.",type:"ui",target:"open_inventory",skippable:!0},{id:"quests",title:"Quests",description:"Press J to see your quests. Complete quests to earn rewards!",type:"ui",target:"open_quest_log",skippable:!0},{id:"map",title:"Map & Navigation",description:"Press M for the world map. Use waypoints to fast travel.",type:"ui",target:"open_map",skippable:!0},{id:"social",title:"Social Features",description:"Press O for social panel. Join guilds, make friends, and team up!",type:"ui",target:"open_social",skippable:!0},{id:"complete",title:"Tutorial Complete!",description:"You're ready to explore! The world of Emberveil awaits you.",type:"dialogue",duration:5e3,skippable:!0,reward:{gold:100,items:["starter_potion_x5","beginner_weapon"],xp:500}}]}setupReturningPlayerGuide(){this.tutorialSteps=[{id:"welcome_back",title:"Welcome Back!",description:"Here's what's new since you've been away:",type:"summary",content:this.generateWhatsNew()},{id:"changes_overview",title:"Recent Changes",description:"New content, balance changes, and events.",type:"list",content:this.generateChangeList()},{id:"comeback_rewards",title:"Comeback Rewards",description:"Here are some rewards for returning!",type:"reward",reward:{gold:500,items:["welcome_back_chest"],xp:1e3}},{id:"quick_recap",title:"Quick Recap",description:"You were last: "+this.getLastActivity(),type:"info"}]}setupContinuingPlayerReminders(){this.tutorialSteps=[{id:"daily_reminder",title:"Daily Quests Available",description:"Don't forget your daily quests for bonus rewards!",type:"reminder",duration:3e3,skippable:!0}]}startOnboarding(){this.tutorialSteps.length!==0&&(this.currentStep=this.tutorialSteps[0],this.showStep(this.currentStep))}showStep(e){logger.info("[PlayerOnboarding] Showing step:",e.title);const t=this.createTutorialUI(e);switch(document.body.appendChild(t),e.type){case"dialogue":this.handleDialogueStep(e);break;case"interactive":this.handleInteractiveStep(e);break;case"combat":this.handleCombatStep(e);break;case"ui":this.handleUIStep(e);break;case"summary":this.handleSummaryStep(e);break;default:this.handleGenericStep(e)}}createTutorialUI(e){const t=document.createElement("div");return t.id="tutorial-ui",t.style.cssText=`
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            max-width: 500px;
            z-index: 9999;
            border: 2px solid #FFD700;
        `,t.innerHTML=`
            <h3 style="margin: 0 0 10px 0; color: #FFD700;">${e.title}</h3>
            <p style="margin: 0 0 15px 0;">${e.description}</p>
            ${e.skippable?'<button id="skip-tutorial" style="padding: 8px 15px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">Skip</button>':""}
        `,e.skippable&&setTimeout(()=>{const i=document.getElementById("skip-tutorial");i&&i.addEventListener("click",()=>this.skipStep())},0),t}handleDialogueStep(e){e.duration&&setTimeout(()=>{this.completeStep(e.id)},e.duration)}handleInteractiveStep(e){this.waitForAction(e.target,()=>{this.completeStep(e.id)})}handleCombatStep(e){this.completeStep(e.id)}handleUIStep(e){this.waitForUIOpen(e.target,()=>{this.completeStep(e.id)})}handleSummaryStep(e){setTimeout(()=>{this.completeStep(e.id)},5e3)}handleGenericStep(e){this.completeStep(e.id)}completeStep(e){this.completedSteps.add(e),this.saveProgress();const t=document.getElementById("tutorial-ui");t&&t.remove();const i=this.tutorialSteps.find(a=>a.id===e);i?.reward&&this.giveRewards(i.reward);const r=this.tutorialSteps.findIndex(a=>a.id===e);r<this.tutorialSteps.length-1?(this.currentStep=this.tutorialSteps[r+1],setTimeout(()=>this.showStep(this.currentStep),1e3)):this.finishOnboarding()}skipStep(){this.currentStep&&this.completeStep(this.currentStep.id)}finishOnboarding(){logger.info("[PlayerOnboarding] Onboarding complete!"),this.saveProgress();const e=document.createElement("div");e.style.cssText=`
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            z-index: 10000;
            border: 3px solid #FFD700;
        `,e.innerHTML=`
            <h2 style="color: #FFD700; margin-bottom: 15px;">Onboarding Complete!</h2>
            <p>You're all set to explore Dynasty of Emberveil!</p>
            <button onclick="this.parentElement.remove()" style="
                padding: 10px 30px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 20px;
                font-size: 16px;
            ">Start Adventure</button>
        `,document.body.appendChild(e)}waitForAction(e,t){setTimeout(t,3e3)}waitForUIOpen(e,t){setTimeout(t,2e3)}giveRewards(e){logger.info("[PlayerOnboarding] Giving rewards:",e)}generateWhatsNew(){return["• New biome: Eternal Gardens","• 5 new legendary items added","• Guild wars now active","• New seasonal event: Winter Festival"]}generateChangeList(){return["• Balance: Warrior skills buffed by 10%","• New: Pet battle system","• Fixed: Various bug fixes","• Event: Double XP weekend coming soon"]}getLastActivity(){return this.loadSaveData()?.lastLocation||"Emberforge Plains"}loadSaveData(){try{const e=localStorage.getItem("dynasty_save");return e?JSON.parse(e):null}catch(e){return logger.error("[PlayerOnboarding] Failed to load save data:",e),null}}saveProgress(){try{const e={completedSteps:Array.from(this.completedSteps),playerType:this.playerType,lastUpdate:Date.now()};localStorage.setItem("dynasty_onboarding",JSON.stringify(e))}catch(e){logger.error("[PlayerOnboarding] Failed to save progress:",e)}}loadProgress(){try{const e=localStorage.getItem("dynasty_onboarding");if(e){const t=JSON.parse(e);this.completedSteps=new Set(t.completedSteps||[])}}catch(e){logger.error("[PlayerOnboarding] Failed to load progress:",e)}}}export{o as default};
