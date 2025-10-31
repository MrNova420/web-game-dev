class g{constructor(){this.isMobile=this.detectMobile(),this.isTablet=this.detectTablet(),this.screenSize=this.getScreenSize(),this.orientation=this.getOrientation(),this.touchControls={enabled:this.isMobile||this.isTablet,joystick:null,actionButtons:[],sensitivity:1},this.uiScaling={base:1,current:1,min:.7,max:1.5},this.init()}detectMobile(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}detectTablet(){return/iPad|Android/i.test(navigator.userAgent)&&window.innerWidth>=768}getScreenSize(){const t=window.innerWidth;return t<576?"xs":t<768?"sm":t<992?"md":t<1200?"lg":"xl"}getOrientation(){return window.innerWidth>window.innerHeight?"landscape":"portrait"}init(){window.addEventListener("resize",()=>this.handleResize()),window.addEventListener("orientationchange",()=>this.handleOrientationChange()),this.applyUIScaling(),this.touchControls.enabled&&this.setupTouchControls(),this.setupAccessibility()}handleResize(){this.screenSize=this.getScreenSize(),this.orientation=this.getOrientation(),this.applyUIScaling(),this.touchControls.enabled&&this.adjustTouchControlsLayout()}handleOrientationChange(){setTimeout(()=>{this.orientation=this.getOrientation(),this.applyUIScaling(),this.touchControls.enabled&&this.adjustTouchControlsLayout()},200)}applyUIScaling(){let t=1;switch(this.screenSize){case"xs":t=.75;break;case"sm":t=.85;break;case"md":t=.95;break;case"lg":t=1;break;case"xl":t=1.1;break}this.isMobile&&this.orientation==="portrait"&&(t*=.9),this.uiScaling.current=Math.max(this.uiScaling.min,Math.min(this.uiScaling.max,t)),document.documentElement.style.setProperty("--ui-scale",this.uiScaling.current)}setupTouchControls(){this.createVirtualJoystick(),this.createActionButtons(),this.setupGestures()}createVirtualJoystick(){const t=document.createElement("div");t.id="virtual-joystick",t.style.cssText=`
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 120px;
            height: 120px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            z-index: 1000;
            touch-action: none;
        `;const i=document.createElement("div");i.id="joystick-stick",i.style.cssText=`
            position: absolute;
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
        `,t.appendChild(i),document.body.appendChild(t);let e=!1,s={x:0,y:0};t.addEventListener("touchstart",o=>{o.preventDefault(),e=!0;const n=t.getBoundingClientRect();s.x=n.left+n.width/2,s.y=n.top+n.height/2}),document.addEventListener("touchmove",o=>{if(!e)return;const n=o.touches[0],c=n.clientX-s.x,a=n.clientY-s.y,r=Math.sqrt(c*c+a*a),l=35;let u=c,p=a;r>l&&(u=c/r*l,p=a/r*l),i.style.transform=`translate(calc(-50% + ${u}px), calc(-50% + ${p}px))`;const d=Math.atan2(a,c),h=Math.min(r/l,1);this.touchControls.joystick={angle:d,strength:h,x:Math.cos(d)*h,y:Math.sin(d)*h}}),document.addEventListener("touchend",()=>{e&&(e=!1,i.style.transform="translate(-50%, -50%)",this.touchControls.joystick=null)})}createActionButtons(){const t=[{id:"btn-attack",label:"ATK",action:"attack",color:"rgba(255, 100, 100, 0.8)"},{id:"btn-special",label:"SP",action:"special",color:"rgba(100, 100, 255, 0.8)"},{id:"btn-dodge",label:"DODGE",action:"dodge",color:"rgba(100, 255, 100, 0.8)"},{id:"btn-interact",label:"USE",action:"interact",color:"rgba(255, 255, 100, 0.8)"}],i=document.createElement("div");i.id="action-buttons",i.style.cssText=`
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 1000;
        `,t.forEach((e,s)=>{const o=document.createElement("button");o.id=e.id,o.textContent=e.label,o.style.cssText=`
                width: 70px;
                height: 70px;
                border-radius: 50%;
                border: 2px solid white;
                background: ${e.color};
                color: white;
                font-weight: bold;
                font-size: 12px;
                touch-action: none;
                cursor: pointer;
            `,o.addEventListener("touchstart",n=>{n.preventDefault(),o.style.transform="scale(0.9)",this.triggerAction(e.action)}),o.addEventListener("touchend",n=>{n.preventDefault(),o.style.transform="scale(1)"}),i.appendChild(o),this.touchControls.actionButtons.push({element:o,action:e.action})}),document.body.appendChild(i)}adjustTouchControlsLayout(){const t=document.getElementById("virtual-joystick"),i=document.getElementById("action-buttons");!t||!i||(this.orientation==="landscape"?(t.style.left="20px",t.style.bottom="20px",i.style.right="20px",i.style.bottom="20px"):(t.style.left="20px",t.style.bottom="100px",i.style.right="20px",i.style.bottom="100px"))}setupGestures(){let t=0;document.addEventListener("touchstart",e=>{e.touches.length===2&&(t=Date.now(),(e.touches[0].clientX+e.touches[1].clientX)/2,(e.touches[0].clientY+e.touches[1].clientY)/2)}),document.addEventListener("touchend",e=>{Date.now()-t<300&&e.changedTouches.length===1&&this.triggerAction("lock-target")});let i=1;document.addEventListener("touchmove",e=>{if(e.touches.length===2){const o=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)/200;Math.abs(o-i)>.1&&(this.triggerAction("zoom",{scale:o}),i=o)}})}setupAccessibility(){const t=document.createElement("a");t.href="#main-content",t.textContent="Skip to main content",t.style.cssText=`
            position: absolute;
            left: -9999px;
            z-index: 9999;
            padding: 1em;
            background: black;
            color: white;
        `,t.addEventListener("focus",()=>{t.style.left="0"}),t.addEventListener("blur",()=>{t.style.left="-9999px"}),document.body.insertBefore(t,document.body.firstChild),this.addARIALabels(),this.setupKeyboardNavigation(),this.addFocusIndicators()}addARIALabels(){document.querySelectorAll("button, a, input").forEach(t=>{!t.getAttribute("aria-label")&&t.textContent&&t.setAttribute("aria-label",t.textContent.trim())})}setupKeyboardNavigation(){document.addEventListener("keydown",t=>{t.key==="Tab"&&document.body.classList.add("keyboard-navigation")}),document.addEventListener("mousedown",()=>{document.body.classList.remove("keyboard-navigation")})}addFocusIndicators(){const t=document.createElement("style");t.textContent=`
            .keyboard-navigation *:focus {
                outline: 3px solid #4A90E2 !important;
                outline-offset: 2px;
            }
        `,document.head.appendChild(t)}triggerAction(t,i={}){const e=new CustomEvent("gameAction",{detail:{action:t,data:i}});window.dispatchEvent(e)}getMovementInput(){return this.touchControls.joystick?{x:this.touchControls.joystick.x,y:this.touchControls.joystick.y,strength:this.touchControls.joystick.strength}:null}setTouchSensitivity(t){this.touchControls.sensitivity=Math.max(.5,Math.min(2,t))}setUIScale(t){this.uiScaling.current=Math.max(this.uiScaling.min,Math.min(this.uiScaling.max,t)),document.documentElement.style.setProperty("--ui-scale",this.uiScaling.current)}toggleTouchControls(t){this.touchControls.enabled=t;const i=document.getElementById("virtual-joystick"),e=document.getElementById("action-buttons");i&&(i.style.display=t?"block":"none"),e&&(e.style.display=t?"flex":"none")}showControlsHelp(){const t=document.createElement("div");t.id="controls-help",t.style.cssText=`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            padding: 20px;
            box-sizing: border-box;
        `;const i=`
            <div style="max-width: 600px; text-align: center;">
                <h2>Controls Guide</h2>
                
                ${this.isMobile?`
                    <h3>Touch Controls</h3>
                    <p>🎮 Left Joystick: Move character</p>
                    <p>🔴 ATK Button: Attack enemies</p>
                    <p>🔵 SP Button: Use special ability</p>
                    <p>🟢 DODGE Button: Dodge/roll</p>
                    <p>🟡 USE Button: Interact with objects</p>
                    <p>👆 Double Tap: Lock onto target</p>
                    <p>🤏 Pinch: Zoom camera</p>
                `:`
                    <h3>Keyboard Controls</h3>
                    <p>WASD / Arrow Keys: Move</p>
                    <p>Left Click: Attack</p>
                    <p>Right Click: Special ability</p>
                    <p>Space: Dodge/roll</p>
                    <p>E: Interact</p>
                    <p>I: Inventory</p>
                    <p>M: Map</p>
                    <p>ESC: Menu</p>
                `}
                
                <button id="close-help" style="
                    margin-top: 20px;
                    padding: 10px 30px;
                    font-size: 16px;
                    background: #4A90E2;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">Got it!</button>
            </div>
        `;t.innerHTML=i,document.body.appendChild(t),document.getElementById("close-help").addEventListener("click",()=>{document.body.removeChild(t)})}exportSettings(){return{touchSensitivity:this.touchControls.sensitivity,uiScale:this.uiScaling.current,touchControlsEnabled:this.touchControls.enabled}}importSettings(t){t.touchSensitivity&&this.setTouchSensitivity(t.touchSensitivity),t.uiScale&&this.setUIScale(t.uiScale),t.touchControlsEnabled!==void 0&&this.toggleTouchControls(t.touchControlsEnabled)}}export{g as ResponsiveUISystem};
