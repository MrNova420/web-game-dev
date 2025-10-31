class a{constructor(e){this.game=e,this.deviceType="unknown",this.controlScheme="auto",this.isTouchDevice=!1,this.screenSize={width:0,height:0},this.orientation="landscape",this.controls={pc:{enabled:!1,keys:{},mouse:{x:0,y:0,buttons:{}}},mobile:{enabled:!1,touches:[],joystick:{active:!1,x:0,y:0}},gamepad:{enabled:!1,connected:!1,index:-1}},this.init()}init(){console.log("🎮 Initializing Device Detection & Control System..."),this.detectDevice(),this.detectScreenSize(),this.detectOrientation(),this.selectControlScheme(),this.setupEventListeners(),this.createControlUI(),this.loadPreferences(),console.log(`✅ Device detected: ${this.deviceType}`),console.log(`✅ Control scheme: ${this.controlScheme}`),console.log(`✅ Screen: ${this.screenSize.width}x${this.screenSize.height}`)}detectDevice(){const e=navigator.userAgent.toLowerCase(),t=/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(e),o=/ipad|android(?!.*mobile)/i.test(e)||navigator.maxTouchPoints>1&&/macintosh/i.test(e);return this.isTouchDevice="ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0,o?this.deviceType="tablet":t?this.deviceType="mobile":this.deviceType="desktop",this.isTouchDevice&&this.deviceType==="desktop"&&(this.deviceType="desktop-touch"),this.deviceType}detectScreenSize(){return this.screenSize={width:window.innerWidth,height:window.innerHeight,ratio:window.innerWidth/window.innerHeight,dpr:window.devicePixelRatio||1},this.screenSize}detectOrientation(){return window.innerWidth>window.innerHeight?this.orientation="landscape":this.orientation="portrait",this.orientation}selectControlScheme(){this.controlScheme==="auto"&&(this.deviceType==="mobile"||this.deviceType==="tablet"?this.setControlScheme("mobile"):(this.deviceType==="desktop"||this.deviceType==="desktop-touch")&&this.setControlScheme("pc")),this.checkGamepad()}setControlScheme(e){switch(console.log(`🎮 Setting control scheme: ${e}`),this.controls.pc.enabled=!1,this.controls.mobile.enabled=!1,this.controls.gamepad.enabled=!1,this.controlScheme=e,e){case"pc":this.controls.pc.enabled=!0,this.enablePCControls();break;case"mobile":this.controls.mobile.enabled=!0,this.enableMobileControls();break;case"gamepad":this.controls.gamepad.enabled=!0,this.enableGamepadControls();break}this.updateControlUI(),this.savePreferences(),this.game&&this.game.onControlSchemeChanged&&this.game.onControlSchemeChanged(e)}enablePCControls(){console.log("⌨️  PC controls enabled (Keyboard + Mouse)"),this.showControlHints("pc"),this.hideMobileControls()}enableMobileControls(){console.log("📱 Mobile controls enabled (Touch)"),this.showControlHints("mobile"),this.showMobileControls()}enableGamepadControls(){console.log("🎮 Gamepad controls enabled"),this.showControlHints("gamepad")}setupEventListeners(){window.addEventListener("resize",()=>{this.detectScreenSize(),this.detectOrientation(),this.updateControlUI()}),window.addEventListener("orientationchange",()=>{setTimeout(()=>{this.detectOrientation(),this.updateControlUI()},100)}),window.addEventListener("gamepadconnected",e=>{console.log("🎮 Gamepad connected:",e.gamepad.id),this.controls.gamepad.connected=!0,this.controls.gamepad.index=e.gamepad.index,this.showGamepadNotification()}),window.addEventListener("gamepaddisconnected",e=>{console.log("🎮 Gamepad disconnected"),this.controls.gamepad.connected=!1,this.controlScheme==="gamepad"&&(this.setControlScheme("auto"),this.selectControlScheme())}),this.controls.pc.enabled&&(document.addEventListener("keydown",e=>this.handleKeyDown(e)),document.addEventListener("keyup",e=>this.handleKeyUp(e)),document.addEventListener("mousemove",e=>this.handleMouseMove(e)),document.addEventListener("mousedown",e=>this.handleMouseDown(e)),document.addEventListener("mouseup",e=>this.handleMouseUp(e))),(this.controls.mobile.enabled||this.isTouchDevice)&&(document.addEventListener("touchstart",e=>this.handleTouchStart(e),{passive:!1}),document.addEventListener("touchmove",e=>this.handleTouchMove(e),{passive:!1}),document.addEventListener("touchend",e=>this.handleTouchEnd(e),{passive:!1}))}checkGamepad(){const e=navigator.getGamepads?navigator.getGamepads():[];for(let t=0;t<e.length;t++)if(e[t])return this.controls.gamepad.connected=!0,this.controls.gamepad.index=t,console.log("🎮 Gamepad detected:",e[t].id),!0;return!1}createControlUI(){const e=document.createElement("div");e.id="control-panel",e.style.cssText=`
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(15, 15, 30, 0.95);
      border: 2px solid rgba(139, 0, 255, 0.5);
      border-radius: 12px;
      padding: 15px;
      z-index: 9999;
      min-width: 200px;
      box-shadow: 0 8px 32px rgba(139, 0, 255, 0.3);
      backdrop-filter: blur(10px);
    `,e.innerHTML=`
      <div style="color: #a78bfa; font-weight: bold; margin-bottom: 10px; font-size: 14px;">
        🎮 Controls
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button id="control-auto" class="control-btn" style="
          background: rgba(139, 0, 255, 0.2);
          border: 1px solid rgba(139, 0, 255, 0.5);
          color: #fff;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.3s;
        ">
          🤖 Auto Detect
        </button>
        <button id="control-pc" class="control-btn" style="
          background: rgba(139, 0, 255, 0.2);
          border: 1px solid rgba(139, 0, 255, 0.5);
          color: #fff;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.3s;
        ">
          ⌨️  PC (Keyboard + Mouse)
        </button>
        <button id="control-mobile" class="control-btn" style="
          background: rgba(139, 0, 255, 0.2);
          border: 1px solid rgba(139, 0, 255, 0.5);
          color: #fff;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.3s;
        ">
          📱 Mobile (Touch)
        </button>
        <button id="control-gamepad" class="control-btn" style="
          background: rgba(139, 0, 255, 0.2);
          border: 1px solid rgba(139, 0, 255, 0.5);
          color: #fff;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.3s;
          ${this.controls.gamepad.connected?"":"opacity: 0.5;"}
        ">
          🎮 Gamepad
        </button>
      </div>
      <div id="device-info" style="
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid rgba(139, 0, 255, 0.3);
        font-size: 11px;
        color: #a78bfa;
      ">
        Device: ${this.deviceType}<br>
        Screen: ${this.screenSize.width}x${this.screenSize.height}<br>
        Orientation: ${this.orientation}
      </div>
    `,document.body.appendChild(e),document.getElementById("control-auto").addEventListener("click",()=>{this.controlScheme="auto",this.selectControlScheme()}),document.getElementById("control-pc").addEventListener("click",()=>{this.setControlScheme("pc")}),document.getElementById("control-mobile").addEventListener("click",()=>{this.setControlScheme("mobile")}),document.getElementById("control-gamepad").addEventListener("click",()=>{this.controls.gamepad.connected?this.setControlScheme("gamepad"):alert("No gamepad detected. Please connect a gamepad first.")}),document.querySelectorAll(".control-btn").forEach(o=>{o.addEventListener("mouseenter",()=>{o.style.background="rgba(139, 0, 255, 0.4)",o.style.transform="scale(1.05)"}),o.addEventListener("mouseleave",()=>{o.style.background="rgba(139, 0, 255, 0.2)",o.style.transform="scale(1)"})}),this.updateControlUI()}updateControlUI(){Object.entries({"control-auto":"auto","control-pc":"pc","control-mobile":"mobile","control-gamepad":"gamepad"}).forEach(([o,n])=>{const i=document.getElementById(o);i&&(n==="auto"&&this.controlScheme==="auto"||n!=="auto"&&this.controlScheme===n?(i.style.background="rgba(139, 0, 255, 0.6)",i.style.borderColor="rgba(139, 0, 255, 1)",i.style.boxShadow="0 0 20px rgba(139, 0, 255, 0.5)"):(i.style.background="rgba(139, 0, 255, 0.2)",i.style.borderColor="rgba(139, 0, 255, 0.5)",i.style.boxShadow="none"))});const t=document.getElementById("device-info");t&&(t.innerHTML=`
        Device: ${this.deviceType}<br>
        Screen: ${this.screenSize.width}x${this.screenSize.height}<br>
        Orientation: ${this.orientation}<br>
        Active: ${this.controlScheme}
      `)}showControlHints(e){let t=document.getElementById("control-hints");t||(t=document.createElement("div"),t.id="control-hints",t.style.cssText=`
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(15, 15, 30, 0.9);
        border: 2px solid rgba(139, 0, 255, 0.5);
        border-radius: 12px;
        padding: 15px;
        z-index: 9998;
        max-width: 300px;
        backdrop-filter: blur(10px);
      `,document.body.appendChild(t));let o="";switch(e){case"pc":o=`
          <div style="color: #a78bfa; font-weight: bold; margin-bottom: 10px;">⌨️  PC Controls</div>
          <div style="color: #fff; font-size: 12px; line-height: 1.8;">
            WASD - Move<br>
            Mouse - Look/Aim<br>
            Left Click - Attack<br>
            Right Click - Special<br>
            Q, E, R, F - Abilities<br>
            I - Inventory<br>
            M - Map<br>
            ESC - Menu<br>
            Enter - Chat
          </div>
        `;break;case"mobile":o=`
          <div style="color: #a78bfa; font-weight: bold; margin-bottom: 10px;">📱 Touch Controls</div>
          <div style="color: #fff; font-size: 12px; line-height: 1.8;">
            Left Joystick - Move<br>
            Right Tap - Look/Aim<br>
            Attack Button - Attack<br>
            Ability Buttons - Use abilities<br>
            Menu Icon - Open menu<br>
            Tap UI Icons - Access features
          </div>
        `;break;case"gamepad":o=`
          <div style="color: #a78bfa; font-weight: bold; margin-bottom: 10px;">🎮 Gamepad Controls</div>
          <div style="color: #fff; font-size: 12px; line-height: 1.8;">
            Left Stick - Move<br>
            Right Stick - Look/Aim<br>
            A/X - Attack<br>
            B/O - Jump/Dodge<br>
            X/□ - Special<br>
            Y/△ - Interact<br>
            LB/L1, RB/R1 - Abilities<br>
            Start - Menu
          </div>
        `;break}t.innerHTML=o,t.style.display="block"}showMobileControls(){console.log("📱 Showing mobile touch controls")}hideMobileControls(){console.log("📱 Hiding mobile touch controls")}showGamepadNotification(){const e=document.createElement("div");e.style.cssText=`
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(15, 15, 30, 0.95);
      border: 2px solid rgba(139, 0, 255, 0.8);
      border-radius: 12px;
      padding: 30px;
      z-index: 10000;
      text-align: center;
      box-shadow: 0 8px 32px rgba(139, 0, 255, 0.5);
    `,e.innerHTML=`
      <div style="font-size: 48px; margin-bottom: 15px;">🎮</div>
      <div style="color: #a78bfa; font-size: 20px; font-weight: bold; margin-bottom: 10px;">
        Gamepad Connected!
      </div>
      <div style="color: #fff; font-size: 14px;">
        Switch to gamepad controls in the control panel
      </div>
    `,document.body.appendChild(e),setTimeout(()=>{e.remove()},3e3)}handleKeyDown(e){this.controls.pc.keys[e.key]=!0}handleKeyUp(e){this.controls.pc.keys[e.key]=!1}handleMouseMove(e){this.controls.pc.mouse.x=e.clientX,this.controls.pc.mouse.y=e.clientY}handleMouseDown(e){this.controls.pc.mouse.buttons[e.button]=!0}handleMouseUp(e){this.controls.pc.mouse.buttons[e.button]=!1}handleTouchStart(e){this.controls.mobile.touches=Array.from(e.touches)}handleTouchMove(e){this.controls.mobile.touches=Array.from(e.touches)}handleTouchEnd(e){this.controls.mobile.touches=Array.from(e.touches)}savePreferences(){const e={controlScheme:this.controlScheme,lastDeviceType:this.deviceType};localStorage.setItem("gameControlPreferences",JSON.stringify(e))}loadPreferences(){try{const e=JSON.parse(localStorage.getItem("gameControlPreferences"));e&&e.controlScheme&&e.controlScheme!=="auto"&&this.setControlScheme(e.controlScheme)}catch{}}update(e){this.controls.gamepad.enabled&&this.controls.gamepad.connected&&this.updateGamepad()}updateGamepad(){(navigator.getGamepads?navigator.getGamepads():[])[this.controls.gamepad.index]}getActiveControl(){return this.controlScheme}isPC(){return this.controls.pc.enabled}isMobile(){return this.controls.mobile.enabled}isGamepad(){return this.controls.gamepad.enabled}}export{a as DeviceControlSystem};
