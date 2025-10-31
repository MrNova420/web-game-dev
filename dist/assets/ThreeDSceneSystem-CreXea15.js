import{b6 as ft,V as j,b7 as Me,b8 as Te,b9 as $e,Q as Je,j as T,ba as dt,bb as mt,a3 as ht,a as pt,a4 as gt,Y as vt,au as et,aG as W,bc as ue,aC as ye,aD as Se,bd as oe,aY as bt,k as Pe,av as xt,b as wt,q as tt,be as Mt,bf as Tt,bg as yt,A as st,bh as St,bi as it,bj as at,bk as Pt,bl as Ct,bm as Et,bn as Dt,al as Rt,am as At,bo as jt,R as ot,aF as zt,aS as Lt,a2 as kt,aZ as Ot,aA as _t,m as Nt,aB as Ut,ax as Ft,p as It,az as Bt,b5 as Ht,o as Vt,n as Zt}from"./three-DTQjiZ7L.js";const rt={type:"change"},Xe={type:"start"},nt={type:"end"},He=new dt,lt=new mt,Yt=Math.cos(70*ht.DEG2RAD);class Kt extends ft{constructor(t,i){super(),this.object=t,this.domElement=i,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new j,this.cursor=new j,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Me.ROTATE,MIDDLE:Me.DOLLY,RIGHT:Me.PAN},this.touches={ONE:Te.ROTATE,TWO:Te.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return r.phi},this.getAzimuthalAngle=function(){return r.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(s){s.addEventListener("keydown",q),this._domElementKeyEvents=s},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",q),this._domElementKeyEvents=null},this.saveState=function(){e.target0.copy(e.target),e.position0.copy(e.object.position),e.zoom0=e.object.zoom},this.reset=function(){e.target.copy(e.target0),e.object.position.copy(e.position0),e.object.zoom=e.zoom0,e.object.updateProjectionMatrix(),e.dispatchEvent(rt),e.update(),o=a.NONE},this.update=(function(){const s=new j,l=new Je().setFromUnitVectors(t.up,new j(0,1,0)),c=l.clone().invert(),f=new j,R=new Je,N=new j,F=2*Math.PI;return function(ut=null){const qe=e.object.position;s.copy(qe).sub(e.target),s.applyQuaternion(l),r.setFromVector3(s),e.autoRotate&&o===a.NONE&&g(S(ut)),e.enableDamping?(r.theta+=u.theta*e.dampingFactor,r.phi+=u.phi*e.dampingFactor):(r.theta+=u.theta,r.phi+=u.phi);let $=e.minAzimuthAngle,J=e.maxAzimuthAngle;isFinite($)&&isFinite(J)&&($<-Math.PI?$+=F:$>Math.PI&&($-=F),J<-Math.PI?J+=F:J>Math.PI&&(J-=F),$<=J?r.theta=Math.max($,Math.min(J,r.theta)):r.theta=r.theta>($+J)/2?Math.max($,r.theta):Math.min(J,r.theta)),r.phi=Math.max(e.minPolarAngle,Math.min(e.maxPolarAngle,r.phi)),r.makeSafe(),e.enableDamping===!0?e.target.addScaledVector(w,e.dampingFactor):e.target.add(w),e.target.sub(e.cursor),e.target.clampLength(e.minTargetRadius,e.maxTargetRadius),e.target.add(e.cursor),e.zoomToCursor&&z||e.object.isOrthographicCamera?r.radius=I(r.radius):r.radius=I(r.radius*h),s.setFromSpherical(r),s.applyQuaternion(c),qe.copy(e.target).add(s),e.object.lookAt(e.target),e.enableDamping===!0?(u.theta*=1-e.dampingFactor,u.phi*=1-e.dampingFactor,w.multiplyScalar(1-e.dampingFactor)):(u.set(0,0,0),w.set(0,0,0));let Qe=!1;if(e.zoomToCursor&&z){let Ne=null;if(e.object.isPerspectiveCamera){const Ue=s.length();Ne=I(Ue*h);const Be=Ue-Ne;e.object.position.addScaledVector(C,Be),e.object.updateMatrixWorld()}else if(e.object.isOrthographicCamera){const Ue=new j(y.x,y.y,0);Ue.unproject(e.object),e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/h)),e.object.updateProjectionMatrix(),Qe=!0;const Be=new j(y.x,y.y,0);Be.unproject(e.object),e.object.position.sub(Be).add(Ue),e.object.updateMatrixWorld(),Ne=s.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),e.zoomToCursor=!1;Ne!==null&&(this.screenSpacePanning?e.target.set(0,0,-1).transformDirection(e.object.matrix).multiplyScalar(Ne).add(e.object.position):(He.origin.copy(e.object.position),He.direction.set(0,0,-1).transformDirection(e.object.matrix),Math.abs(e.object.up.dot(He.direction))<Yt?t.lookAt(e.target):(lt.setFromNormalAndCoplanarPoint(e.object.up,e.target),He.intersectPlane(lt,e.target))))}else e.object.isOrthographicCamera&&(e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/h)),e.object.updateProjectionMatrix(),Qe=!0);return h=1,z=!1,Qe||f.distanceToSquared(e.object.position)>n||8*(1-R.dot(e.object.quaternion))>n||N.distanceToSquared(e.target)>0?(e.dispatchEvent(rt),f.copy(e.object.position),R.copy(e.object.quaternion),N.copy(e.target),!0):!1}})(),this.dispose=function(){e.domElement.removeEventListener("contextmenu",ie),e.domElement.removeEventListener("pointerdown",be),e.domElement.removeEventListener("pointercancel",G),e.domElement.removeEventListener("wheel",xe),e.domElement.removeEventListener("pointermove",le),e.domElement.removeEventListener("pointerup",G),e._domElementKeyEvents!==null&&(e._domElementKeyEvents.removeEventListener("keydown",q),e._domElementKeyEvents=null)};const e=this,a={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let o=a.NONE;const n=1e-6,r=new $e,u=new $e;let h=1;const w=new j,m=new T,E=new T,p=new T,P=new T,D=new T,L=new T,k=new T,M=new T,v=new T,C=new j,y=new T;let z=!1;const d=[],O={};let b=!1;function S(s){return s!==null?2*Math.PI/60*e.autoRotateSpeed*s:2*Math.PI/60/60*e.autoRotateSpeed}function x(s){const l=Math.abs(s*.01);return Math.pow(.95,e.zoomSpeed*l)}function g(s){u.theta-=s}function _(s){u.phi-=s}const ee=(function(){const s=new j;return function(c,f){s.setFromMatrixColumn(f,0),s.multiplyScalar(-c),w.add(s)}})(),te=(function(){const s=new j;return function(c,f){e.screenSpacePanning===!0?s.setFromMatrixColumn(f,1):(s.setFromMatrixColumn(f,0),s.crossVectors(e.object.up,s)),s.multiplyScalar(c),w.add(s)}})(),U=(function(){const s=new j;return function(c,f){const R=e.domElement;if(e.object.isPerspectiveCamera){const N=e.object.position;s.copy(N).sub(e.target);let F=s.length();F*=Math.tan(e.object.fov/2*Math.PI/180),ee(2*c*F/R.clientHeight,e.object.matrix),te(2*f*F/R.clientHeight,e.object.matrix)}else e.object.isOrthographicCamera?(ee(c*(e.object.right-e.object.left)/e.object.zoom/R.clientWidth,e.object.matrix),te(f*(e.object.top-e.object.bottom)/e.object.zoom/R.clientHeight,e.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),e.enablePan=!1)}})();function Q(s){e.object.isPerspectiveCamera||e.object.isOrthographicCamera?h/=s:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function se(s){e.object.isPerspectiveCamera||e.object.isOrthographicCamera?h*=s:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function A(s,l){if(!e.zoomToCursor)return;z=!0;const c=e.domElement.getBoundingClientRect(),f=s-c.left,R=l-c.top,N=c.width,F=c.height;y.x=f/N*2-1,y.y=-(R/F)*2+1,C.set(y.x,y.y,1).unproject(e.object).sub(e.object.position).normalize()}function I(s){return Math.max(e.minDistance,Math.min(e.maxDistance,s))}function Z(s){m.set(s.clientX,s.clientY)}function X(s){A(s.clientX,s.clientX),k.set(s.clientX,s.clientY)}function ne(s){P.set(s.clientX,s.clientY)}function fe(s){E.set(s.clientX,s.clientY),p.subVectors(E,m).multiplyScalar(e.rotateSpeed);const l=e.domElement;g(2*Math.PI*p.x/l.clientHeight),_(2*Math.PI*p.y/l.clientHeight),m.copy(E),e.update()}function de(s){M.set(s.clientX,s.clientY),v.subVectors(M,k),v.y>0?Q(x(v.y)):v.y<0&&se(x(v.y)),k.copy(M),e.update()}function me(s){D.set(s.clientX,s.clientY),L.subVectors(D,P).multiplyScalar(e.panSpeed),U(L.x,L.y),P.copy(D),e.update()}function Y(s){A(s.clientX,s.clientY),s.deltaY<0?se(x(s.deltaY)):s.deltaY>0&&Q(x(s.deltaY)),e.update()}function K(s){let l=!1;switch(s.code){case e.keys.UP:s.ctrlKey||s.metaKey||s.shiftKey?_(2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):U(0,e.keyPanSpeed),l=!0;break;case e.keys.BOTTOM:s.ctrlKey||s.metaKey||s.shiftKey?_(-2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):U(0,-e.keyPanSpeed),l=!0;break;case e.keys.LEFT:s.ctrlKey||s.metaKey||s.shiftKey?g(2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):U(e.keyPanSpeed,0),l=!0;break;case e.keys.RIGHT:s.ctrlKey||s.metaKey||s.shiftKey?g(-2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):U(-e.keyPanSpeed,0),l=!0;break}l&&(s.preventDefault(),e.update())}function B(s){if(d.length===1)m.set(s.pageX,s.pageY);else{const l=ae(s),c=.5*(s.pageX+l.x),f=.5*(s.pageY+l.y);m.set(c,f)}}function H(s){if(d.length===1)P.set(s.pageX,s.pageY);else{const l=ae(s),c=.5*(s.pageX+l.x),f=.5*(s.pageY+l.y);P.set(c,f)}}function De(s){const l=ae(s),c=s.pageX-l.x,f=s.pageY-l.y,R=Math.sqrt(c*c+f*f);k.set(0,R)}function Re(s){e.enableZoom&&De(s),e.enablePan&&H(s)}function Ae(s){e.enableZoom&&De(s),e.enableRotate&&B(s)}function pe(s){if(d.length==1)E.set(s.pageX,s.pageY);else{const c=ae(s),f=.5*(s.pageX+c.x),R=.5*(s.pageY+c.y);E.set(f,R)}p.subVectors(E,m).multiplyScalar(e.rotateSpeed);const l=e.domElement;g(2*Math.PI*p.x/l.clientHeight),_(2*Math.PI*p.y/l.clientHeight),m.copy(E)}function ge(s){if(d.length===1)D.set(s.pageX,s.pageY);else{const l=ae(s),c=.5*(s.pageX+l.x),f=.5*(s.pageY+l.y);D.set(c,f)}L.subVectors(D,P).multiplyScalar(e.panSpeed),U(L.x,L.y),P.copy(D)}function ve(s){const l=ae(s),c=s.pageX-l.x,f=s.pageY-l.y,R=Math.sqrt(c*c+f*f);M.set(0,R),v.set(0,Math.pow(M.y/k.y,e.zoomSpeed)),Q(v.y),k.copy(M);const N=(s.pageX+l.x)*.5,F=(s.pageY+l.y)*.5;A(N,F)}function je(s){e.enableZoom&&ve(s),e.enablePan&&ge(s)}function ze(s){e.enableZoom&&ve(s),e.enableRotate&&pe(s)}function be(s){e.enabled!==!1&&(d.length===0&&(e.domElement.setPointerCapture(s.pointerId),e.domElement.addEventListener("pointermove",le),e.domElement.addEventListener("pointerup",G)),Ke(s),s.pointerType==="touch"?ce(s):Le(s))}function le(s){e.enabled!==!1&&(s.pointerType==="touch"?he(s):ke(s))}function G(s){We(s),d.length===0&&(e.domElement.releasePointerCapture(s.pointerId),e.domElement.removeEventListener("pointermove",le),e.domElement.removeEventListener("pointerup",G)),e.dispatchEvent(nt),o=a.NONE}function Le(s){let l;switch(s.button){case 0:l=e.mouseButtons.LEFT;break;case 1:l=e.mouseButtons.MIDDLE;break;case 2:l=e.mouseButtons.RIGHT;break;default:l=-1}switch(l){case Me.DOLLY:if(e.enableZoom===!1)return;X(s),o=a.DOLLY;break;case Me.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(e.enablePan===!1)return;ne(s),o=a.PAN}else{if(e.enableRotate===!1)return;Z(s),o=a.ROTATE}break;case Me.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(e.enableRotate===!1)return;Z(s),o=a.ROTATE}else{if(e.enablePan===!1)return;ne(s),o=a.PAN}break;default:o=a.NONE}o!==a.NONE&&e.dispatchEvent(Xe)}function ke(s){switch(o){case a.ROTATE:if(e.enableRotate===!1)return;fe(s);break;case a.DOLLY:if(e.enableZoom===!1)return;de(s);break;case a.PAN:if(e.enablePan===!1)return;me(s);break}}function xe(s){e.enabled===!1||e.enableZoom===!1||o!==a.NONE||(s.preventDefault(),e.dispatchEvent(Xe),Y(Oe(s)),e.dispatchEvent(nt))}function Oe(s){const l=s.deltaMode,c={clientX:s.clientX,clientY:s.clientY,deltaY:s.deltaY};switch(l){case 1:c.deltaY*=16;break;case 2:c.deltaY*=100;break}return s.ctrlKey&&!b&&(c.deltaY*=10),c}function _e(s){s.key==="Control"&&(b=!0,document.addEventListener("keyup",we,{passive:!0,capture:!0}))}function we(s){s.key==="Control"&&(b=!1,document.removeEventListener("keyup",we,{passive:!0,capture:!0}))}function q(s){e.enabled===!1||e.enablePan===!1||K(s)}function ce(s){switch(Ie(s),d.length){case 1:switch(e.touches.ONE){case Te.ROTATE:if(e.enableRotate===!1)return;B(s),o=a.TOUCH_ROTATE;break;case Te.PAN:if(e.enablePan===!1)return;H(s),o=a.TOUCH_PAN;break;default:o=a.NONE}break;case 2:switch(e.touches.TWO){case Te.DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;Re(s),o=a.TOUCH_DOLLY_PAN;break;case Te.DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;Ae(s),o=a.TOUCH_DOLLY_ROTATE;break;default:o=a.NONE}break;default:o=a.NONE}o!==a.NONE&&e.dispatchEvent(Xe)}function he(s){switch(Ie(s),o){case a.TOUCH_ROTATE:if(e.enableRotate===!1)return;pe(s),e.update();break;case a.TOUCH_PAN:if(e.enablePan===!1)return;ge(s),e.update();break;case a.TOUCH_DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;je(s),e.update();break;case a.TOUCH_DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;ze(s),e.update();break;default:o=a.NONE}}function ie(s){e.enabled!==!1&&s.preventDefault()}function Ke(s){d.push(s.pointerId)}function We(s){delete O[s.pointerId];for(let l=0;l<d.length;l++)if(d[l]==s.pointerId){d.splice(l,1);return}}function Ie(s){let l=O[s.pointerId];l===void 0&&(l=new T,O[s.pointerId]=l),l.set(s.pageX,s.pageY)}function ae(s){const l=s.pointerId===d[0]?d[1]:d[0];return O[l]}e.domElement.addEventListener("contextmenu",ie),e.domElement.addEventListener("pointerdown",be),e.domElement.addEventListener("pointercancel",G),e.domElement.addEventListener("wheel",xe,{passive:!1}),document.addEventListener("keydown",_e,{passive:!0,capture:!0}),this.update()}}const Fe={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Ee{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Wt=new gt(-1,1,1,-1,0,1);class Qt extends vt{constructor(){super(),this.setAttribute("position",new et([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new et([0,2,0,0,2,0],2))}}const Xt=new Qt;class Ge{constructor(t){this._mesh=new pt(Xt,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Wt)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Gt extends Ee{constructor(t,i){super(),this.textureID=i!==void 0?i:"tDiffuse",t instanceof W?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=ue.clone(t.uniforms),this.material=new W({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new Ge(this.material)}render(t,i,e){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=e.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(i),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class ct extends Ee{constructor(t,i){super(),this.scene=t,this.camera=i,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,i,e){const a=t.getContext(),o=t.state;o.buffers.color.setMask(!1),o.buffers.depth.setMask(!1),o.buffers.color.setLocked(!0),o.buffers.depth.setLocked(!0);let n,r;this.inverse?(n=0,r=1):(n=1,r=0),o.buffers.stencil.setTest(!0),o.buffers.stencil.setOp(a.REPLACE,a.REPLACE,a.REPLACE),o.buffers.stencil.setFunc(a.ALWAYS,n,4294967295),o.buffers.stencil.setClear(r),o.buffers.stencil.setLocked(!0),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),o.buffers.color.setLocked(!1),o.buffers.depth.setLocked(!1),o.buffers.color.setMask(!0),o.buffers.depth.setMask(!0),o.buffers.stencil.setLocked(!1),o.buffers.stencil.setFunc(a.EQUAL,1,4294967295),o.buffers.stencil.setOp(a.KEEP,a.KEEP,a.KEEP),o.buffers.stencil.setLocked(!0)}}class qt extends Ee{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class $t{constructor(t,i){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),i===void 0){const e=t.getSize(new T);this._width=e.width,this._height=e.height,i=new ye(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Se}),i.texture.name="EffectComposer.rt1"}else this._width=i.width,this._height=i.height;this.renderTarget1=i,this.renderTarget2=i.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Gt(Fe),this.copyPass.material.blending=oe,this.clock=new bt}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,i){this.passes.splice(i,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const i=this.passes.indexOf(t);i!==-1&&this.passes.splice(i,1)}isLastEnabledPass(t){for(let i=t+1;i<this.passes.length;i++)if(this.passes[i].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const i=this.renderer.getRenderTarget();let e=!1;for(let a=0,o=this.passes.length;a<o;a++){const n=this.passes[a];if(n.enabled!==!1){if(n.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(a),n.render(this.renderer,this.writeBuffer,this.readBuffer,t,e),n.needsSwap){if(e){const r=this.renderer.getContext(),u=this.renderer.state.buffers.stencil;u.setFunc(r.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),u.setFunc(r.EQUAL,1,4294967295)}this.swapBuffers()}ct!==void 0&&(n instanceof ct?e=!0:n instanceof qt&&(e=!1))}}this.renderer.setRenderTarget(i)}reset(t){if(t===void 0){const i=this.renderer.getSize(new T);this._pixelRatio=this.renderer.getPixelRatio(),this._width=i.width,this._height=i.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,i){this._width=t,this._height=i;const e=this._width*this._pixelRatio,a=this._height*this._pixelRatio;this.renderTarget1.setSize(e,a),this.renderTarget2.setSize(e,a);for(let o=0;o<this.passes.length;o++)this.passes[o].setSize(e,a)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Jt extends Ee{constructor(t,i,e=null,a=null,o=null){super(),this.scene=t,this.camera=i,this.overrideMaterial=e,this.clearColor=a,this.clearAlpha=o,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Pe}render(t,i,e){const a=t.autoClear;t.autoClear=!1;let o,n;this.overrideMaterial!==null&&(n=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor)),this.clearAlpha!==null&&(o=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:e),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(o),this.overrideMaterial!==null&&(this.scene.overrideMaterial=n),t.autoClear=a}}const es={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Pe(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Ce extends Ee{constructor(t,i,e,a){super(),this.strength=i!==void 0?i:1,this.radius=e,this.threshold=a,this.resolution=t!==void 0?new T(t.x,t.y):new T(256,256),this.clearColor=new Pe(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let o=Math.round(this.resolution.x/2),n=Math.round(this.resolution.y/2);this.renderTargetBright=new ye(o,n,{type:Se}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let m=0;m<this.nMips;m++){const E=new ye(o,n,{type:Se});E.texture.name="UnrealBloomPass.h"+m,E.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(E);const p=new ye(o,n,{type:Se});p.texture.name="UnrealBloomPass.v"+m,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),o=Math.round(o/2),n=Math.round(n/2)}const r=es;this.highPassUniforms=ue.clone(r.uniforms),this.highPassUniforms.luminosityThreshold.value=a,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new W({uniforms:this.highPassUniforms,vertexShader:r.vertexShader,fragmentShader:r.fragmentShader}),this.separableBlurMaterials=[];const u=[3,5,7,9,11];o=Math.round(this.resolution.x/2),n=Math.round(this.resolution.y/2);for(let m=0;m<this.nMips;m++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(u[m])),this.separableBlurMaterials[m].uniforms.invSize.value=new T(1/o,1/n),o=Math.round(o/2),n=Math.round(n/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=i,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new j(1,1,1),new j(1,1,1),new j(1,1,1),new j(1,1,1),new j(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const w=Fe;this.copyUniforms=ue.clone(w.uniforms),this.blendMaterial=new W({uniforms:this.copyUniforms,vertexShader:w.vertexShader,fragmentShader:w.fragmentShader,blending:xt,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Pe,this.oldClearAlpha=1,this.basic=new wt,this.fsQuad=new Ge(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,i){let e=Math.round(t/2),a=Math.round(i/2);this.renderTargetBright.setSize(e,a);for(let o=0;o<this.nMips;o++)this.renderTargetsHorizontal[o].setSize(e,a),this.renderTargetsVertical[o].setSize(e,a),this.separableBlurMaterials[o].uniforms.invSize.value=new T(1/e,1/a),e=Math.round(e/2),a=Math.round(a/2)}render(t,i,e,a,o){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const n=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),o&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=e.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=e.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let r=this.renderTargetBright;for(let u=0;u<this.nMips;u++)this.fsQuad.material=this.separableBlurMaterials[u],this.separableBlurMaterials[u].uniforms.colorTexture.value=r.texture,this.separableBlurMaterials[u].uniforms.direction.value=Ce.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[u]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[u].uniforms.colorTexture.value=this.renderTargetsHorizontal[u].texture,this.separableBlurMaterials[u].uniforms.direction.value=Ce.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[u]),t.clear(),this.fsQuad.render(t),r=this.renderTargetsVertical[u];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,o&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=n}getSeperableBlurMaterial(t){const i=[];for(let e=0;e<t;e++)i.push(.39894*Math.exp(-.5*e*e/(t*t))/t);return new W({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new T(.5,.5)},direction:{value:new T(.5,.5)},gaussianCoefficients:{value:i}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new W({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Ce.BlurDirectionX=new T(1,0);Ce.BlurDirectionY=new T(0,1);class ts{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let i=0;i<256;i++)this.p[i]=Math.floor(t.random()*256);this.perm=[];for(let i=0;i<512;i++)this.perm[i]=this.p[i&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}dot(t,i,e){return t[0]*i+t[1]*e}dot3(t,i,e,a){return t[0]*i+t[1]*e+t[2]*a}dot4(t,i,e,a,o){return t[0]*i+t[1]*e+t[2]*a+t[3]*o}noise(t,i){let e,a,o;const n=.5*(Math.sqrt(3)-1),r=(t+i)*n,u=Math.floor(t+r),h=Math.floor(i+r),w=(3-Math.sqrt(3))/6,m=(u+h)*w,E=u-m,p=h-m,P=t-E,D=i-p;let L,k;P>D?(L=1,k=0):(L=0,k=1);const M=P-L+w,v=D-k+w,C=P-1+2*w,y=D-1+2*w,z=u&255,d=h&255,O=this.perm[z+this.perm[d]]%12,b=this.perm[z+L+this.perm[d+k]]%12,S=this.perm[z+1+this.perm[d+1]]%12;let x=.5-P*P-D*D;x<0?e=0:(x*=x,e=x*x*this.dot(this.grad3[O],P,D));let g=.5-M*M-v*v;g<0?a=0:(g*=g,a=g*g*this.dot(this.grad3[b],M,v));let _=.5-C*C-y*y;return _<0?o=0:(_*=_,o=_*_*this.dot(this.grad3[S],C,y)),70*(e+a+o)}noise3d(t,i,e){let a,o,n,r;const h=(t+i+e)*.3333333333333333,w=Math.floor(t+h),m=Math.floor(i+h),E=Math.floor(e+h),p=1/6,P=(w+m+E)*p,D=w-P,L=m-P,k=E-P,M=t-D,v=i-L,C=e-k;let y,z,d,O,b,S;M>=v?v>=C?(y=1,z=0,d=0,O=1,b=1,S=0):M>=C?(y=1,z=0,d=0,O=1,b=0,S=1):(y=0,z=0,d=1,O=1,b=0,S=1):v<C?(y=0,z=0,d=1,O=0,b=1,S=1):M<C?(y=0,z=1,d=0,O=0,b=1,S=1):(y=0,z=1,d=0,O=1,b=1,S=0);const x=M-y+p,g=v-z+p,_=C-d+p,ee=M-O+2*p,te=v-b+2*p,U=C-S+2*p,Q=M-1+3*p,se=v-1+3*p,A=C-1+3*p,I=w&255,Z=m&255,X=E&255,ne=this.perm[I+this.perm[Z+this.perm[X]]]%12,fe=this.perm[I+y+this.perm[Z+z+this.perm[X+d]]]%12,de=this.perm[I+O+this.perm[Z+b+this.perm[X+S]]]%12,me=this.perm[I+1+this.perm[Z+1+this.perm[X+1]]]%12;let Y=.6-M*M-v*v-C*C;Y<0?a=0:(Y*=Y,a=Y*Y*this.dot3(this.grad3[ne],M,v,C));let K=.6-x*x-g*g-_*_;K<0?o=0:(K*=K,o=K*K*this.dot3(this.grad3[fe],x,g,_));let B=.6-ee*ee-te*te-U*U;B<0?n=0:(B*=B,n=B*B*this.dot3(this.grad3[de],ee,te,U));let H=.6-Q*Q-se*se-A*A;return H<0?r=0:(H*=H,r=H*H*this.dot3(this.grad3[me],Q,se,A)),32*(a+o+n+r)}noise4d(t,i,e,a){const o=this.grad4,n=this.simplex,r=this.perm,u=(Math.sqrt(5)-1)/4,h=(5-Math.sqrt(5))/20;let w,m,E,p,P;const D=(t+i+e+a)*u,L=Math.floor(t+D),k=Math.floor(i+D),M=Math.floor(e+D),v=Math.floor(a+D),C=(L+k+M+v)*h,y=L-C,z=k-C,d=M-C,O=v-C,b=t-y,S=i-z,x=e-d,g=a-O,_=b>S?32:0,ee=b>x?16:0,te=S>x?8:0,U=b>g?4:0,Q=S>g?2:0,se=x>g?1:0,A=_+ee+te+U+Q+se,I=n[A][0]>=3?1:0,Z=n[A][1]>=3?1:0,X=n[A][2]>=3?1:0,ne=n[A][3]>=3?1:0,fe=n[A][0]>=2?1:0,de=n[A][1]>=2?1:0,me=n[A][2]>=2?1:0,Y=n[A][3]>=2?1:0,K=n[A][0]>=1?1:0,B=n[A][1]>=1?1:0,H=n[A][2]>=1?1:0,De=n[A][3]>=1?1:0,Re=b-I+h,Ae=S-Z+h,pe=x-X+h,ge=g-ne+h,ve=b-fe+2*h,je=S-de+2*h,ze=x-me+2*h,be=g-Y+2*h,le=b-K+3*h,G=S-B+3*h,Le=x-H+3*h,ke=g-De+3*h,xe=b-1+4*h,Oe=S-1+4*h,_e=x-1+4*h,we=g-1+4*h,q=L&255,ce=k&255,he=M&255,ie=v&255,Ke=r[q+r[ce+r[he+r[ie]]]]%32,We=r[q+I+r[ce+Z+r[he+X+r[ie+ne]]]]%32,Ie=r[q+fe+r[ce+de+r[he+me+r[ie+Y]]]]%32,ae=r[q+K+r[ce+B+r[he+H+r[ie+De]]]]%32,s=r[q+1+r[ce+1+r[he+1+r[ie+1]]]]%32;let l=.6-b*b-S*S-x*x-g*g;l<0?w=0:(l*=l,w=l*l*this.dot4(o[Ke],b,S,x,g));let c=.6-Re*Re-Ae*Ae-pe*pe-ge*ge;c<0?m=0:(c*=c,m=c*c*this.dot4(o[We],Re,Ae,pe,ge));let f=.6-ve*ve-je*je-ze*ze-be*be;f<0?E=0:(f*=f,E=f*f*this.dot4(o[Ie],ve,je,ze,be));let R=.6-le*le-G*G-Le*Le-ke*ke;R<0?p=0:(R*=R,p=R*R*this.dot4(o[ae],le,G,Le,ke));let N=.6-xe*xe-Oe*Oe-_e*_e-we*we;return N<0?P=0:(N*=N,P=N*N*this.dot4(o[s],xe,Oe,_e,we)),27*(w+m+E+p+P)}}const Ve={defines:{PERSPECTIVE_CAMERA:1,KERNEL_SIZE:32},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},kernel:{value:null},cameraNear:{value:null},cameraFar:{value:null},resolution:{value:new T},cameraProjectionMatrix:{value:new tt},cameraInverseProjectionMatrix:{value:new tt},kernelRadius:{value:8},minDistance:{value:.005},maxDistance:{value:.05}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;

		uniform vec3 kernel[ KERNEL_SIZE ];

		uniform vec2 resolution;

		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraInverseProjectionMatrix;

		uniform float kernelRadius;
		uniform float minDistance; // avoid artifacts caused by neighbour fragments with minimal depth difference
		uniform float maxDistance; // avoid the influence of fragments which are too far away

		varying vec2 vUv;

		#include <packing>

		float getDepth( const in vec2 screenPosition ) {

			return texture2D( tDepth, screenPosition ).x;

		}

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		float getViewZ( const in float depth ) {

			#if PERSPECTIVE_CAMERA == 1

				return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );

			#else

				return orthographicDepthToViewZ( depth, cameraNear, cameraFar );

			#endif

		}

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth, const in float viewZ ) {

			float clipW = cameraProjectionMatrix[2][3] * viewZ + cameraProjectionMatrix[3][3];

			vec4 clipPosition = vec4( ( vec3( screenPosition, depth ) - 0.5 ) * 2.0, 1.0 );

			clipPosition *= clipW; // unprojection.

			return ( cameraInverseProjectionMatrix * clipPosition ).xyz;

		}

		vec3 getViewNormal( const in vec2 screenPosition ) {

			return unpackRGBToNormal( texture2D( tNormal, screenPosition ).xyz );

		}

		void main() {

			float depth = getDepth( vUv );

			if ( depth == 1.0 ) {

				gl_FragColor = vec4( 1.0 ); // don't influence background
				
			} else {

				float viewZ = getViewZ( depth );

				vec3 viewPosition = getViewPosition( vUv, depth, viewZ );
				vec3 viewNormal = getViewNormal( vUv );

				vec2 noiseScale = vec2( resolution.x / 4.0, resolution.y / 4.0 );
				vec3 random = vec3( texture2D( tNoise, vUv * noiseScale ).r );

				// compute matrix used to reorient a kernel vector

				vec3 tangent = normalize( random - viewNormal * dot( random, viewNormal ) );
				vec3 bitangent = cross( viewNormal, tangent );
				mat3 kernelMatrix = mat3( tangent, bitangent, viewNormal );

				float occlusion = 0.0;

				for ( int i = 0; i < KERNEL_SIZE; i ++ ) {

					vec3 sampleVector = kernelMatrix * kernel[ i ]; // reorient sample vector in view space
					vec3 samplePoint = viewPosition + ( sampleVector * kernelRadius ); // calculate sample point

					vec4 samplePointNDC = cameraProjectionMatrix * vec4( samplePoint, 1.0 ); // project point and calculate NDC
					samplePointNDC /= samplePointNDC.w;

					vec2 samplePointUv = samplePointNDC.xy * 0.5 + 0.5; // compute uv coordinates

					float realDepth = getLinearDepth( samplePointUv ); // get linear depth from depth texture
					float sampleDepth = viewZToOrthographicDepth( samplePoint.z, cameraNear, cameraFar ); // compute linear depth of the sample view Z value
					float delta = sampleDepth - realDepth;

					if ( delta > minDistance && delta < maxDistance ) { // if fragment is before sample point, increase occlusion

						occlusion += 1.0;

					}

				}

				occlusion = clamp( occlusion / float( KERNEL_SIZE ), 0.0, 1.0 );

				gl_FragColor = vec4( vec3( 1.0 - occlusion ), 1.0 );

			}

		}`},Ze={defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDepth;

		uniform float cameraNear;
		uniform float cameraFar;

		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		void main() {

			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},Ye={uniforms:{tDiffuse:{value:null},resolution:{value:new T}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDiffuse;

		uniform vec2 resolution;

		varying vec2 vUv;

		void main() {

			vec2 texelSize = ( 1.0 / resolution );
			float result = 0.0;

			for ( int i = - 2; i <= 2; i ++ ) {

				for ( int j = - 2; j <= 2; j ++ ) {

					vec2 offset = ( vec2( float( i ), float( j ) ) ) * texelSize;
					result += texture2D( tDiffuse, vUv + offset ).r;

				}

			}

			gl_FragColor = vec4( vec3( result / ( 5.0 * 5.0 ) ), 1.0 );

		}`};class re extends Ee{constructor(t,i,e,a,o=32){super(),this.width=e!==void 0?e:512,this.height=a!==void 0?a:512,this.clear=!0,this.camera=i,this.scene=t,this.kernelRadius=8,this.kernel=[],this.noiseTexture=null,this.output=0,this.minDistance=.005,this.maxDistance=.1,this._visibilityCache=new Map,this.generateSampleKernel(o),this.generateRandomKernelRotations();const n=new Mt;n.format=Tt,n.type=yt,this.normalRenderTarget=new ye(this.width,this.height,{minFilter:st,magFilter:st,type:Se,depthTexture:n}),this.ssaoRenderTarget=new ye(this.width,this.height,{type:Se}),this.blurRenderTarget=this.ssaoRenderTarget.clone(),this.ssaoMaterial=new W({defines:Object.assign({},Ve.defines),uniforms:ue.clone(Ve.uniforms),vertexShader:Ve.vertexShader,fragmentShader:Ve.fragmentShader,blending:oe}),this.ssaoMaterial.defines.KERNEL_SIZE=o,this.ssaoMaterial.uniforms.tNormal.value=this.normalRenderTarget.texture,this.ssaoMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.ssaoMaterial.uniforms.tNoise.value=this.noiseTexture,this.ssaoMaterial.uniforms.kernel.value=this.kernel,this.ssaoMaterial.uniforms.cameraNear.value=this.camera.near,this.ssaoMaterial.uniforms.cameraFar.value=this.camera.far,this.ssaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.normalMaterial=new St,this.normalMaterial.blending=oe,this.blurMaterial=new W({defines:Object.assign({},Ye.defines),uniforms:ue.clone(Ye.uniforms),vertexShader:Ye.vertexShader,fragmentShader:Ye.fragmentShader}),this.blurMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.blurMaterial.uniforms.resolution.value.set(this.width,this.height),this.depthRenderMaterial=new W({defines:Object.assign({},Ze.defines),uniforms:ue.clone(Ze.uniforms),vertexShader:Ze.vertexShader,fragmentShader:Ze.fragmentShader,blending:oe}),this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new W({uniforms:ue.clone(Fe.uniforms),vertexShader:Fe.vertexShader,fragmentShader:Fe.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:Ct,blendDst:at,blendEquation:it,blendSrcAlpha:Pt,blendDstAlpha:at,blendEquationAlpha:it}),this.fsQuad=new Ge(null),this.originalClearColor=new Pe}dispose(){this.normalRenderTarget.dispose(),this.ssaoRenderTarget.dispose(),this.blurRenderTarget.dispose(),this.normalMaterial.dispose(),this.blurMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this.fsQuad.dispose()}render(t,i,e){switch(t.capabilities.isWebGL2===!1&&(this.noiseTexture.format=Et),this.overrideVisibility(),this.renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this.restoreVisibility(),this.ssaoMaterial.uniforms.kernelRadius.value=this.kernelRadius,this.ssaoMaterial.uniforms.minDistance.value=this.minDistance,this.ssaoMaterial.uniforms.maxDistance.value=this.maxDistance,this.renderPass(t,this.ssaoMaterial,this.ssaoRenderTarget),this.renderPass(t,this.blurMaterial,this.blurRenderTarget),this.output){case re.OUTPUT.SSAO:this.copyMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.copyMaterial.blending=oe,this.renderPass(t,this.copyMaterial,this.renderToScreen?null:i);break;case re.OUTPUT.Blur:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=oe,this.renderPass(t,this.copyMaterial,this.renderToScreen?null:i);break;case re.OUTPUT.Depth:this.renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:i);break;case re.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=oe,this.renderPass(t,this.copyMaterial,this.renderToScreen?null:i);break;case re.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=e.texture,this.copyMaterial.blending=oe,this.renderPass(t,this.copyMaterial,this.renderToScreen?null:i),this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=Dt,this.renderPass(t,this.copyMaterial,this.renderToScreen?null:i);break;default:console.warn("THREE.SSAOPass: Unknown output type.")}}renderPass(t,i,e,a,o){t.getClearColor(this.originalClearColor);const n=t.getClearAlpha(),r=t.autoClear;t.setRenderTarget(e),t.autoClear=!1,a!=null&&(t.setClearColor(a),t.setClearAlpha(o||0),t.clear()),this.fsQuad.material=i,this.fsQuad.render(t),t.autoClear=r,t.setClearColor(this.originalClearColor),t.setClearAlpha(n)}renderOverride(t,i,e,a,o){t.getClearColor(this.originalClearColor);const n=t.getClearAlpha(),r=t.autoClear;t.setRenderTarget(e),t.autoClear=!1,a=i.clearColor||a,o=i.clearAlpha||o,a!=null&&(t.setClearColor(a),t.setClearAlpha(o||0),t.clear()),this.scene.overrideMaterial=i,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=r,t.setClearColor(this.originalClearColor),t.setClearAlpha(n)}setSize(t,i){this.width=t,this.height=i,this.ssaoRenderTarget.setSize(t,i),this.normalRenderTarget.setSize(t,i),this.blurRenderTarget.setSize(t,i),this.ssaoMaterial.uniforms.resolution.value.set(t,i),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.blurMaterial.uniforms.resolution.value.set(t,i)}generateSampleKernel(t){const i=this.kernel;for(let e=0;e<t;e++){const a=new j;a.x=Math.random()*2-1,a.y=Math.random()*2-1,a.z=Math.random(),a.normalize();let o=e/t;o=ht.lerp(.1,1,o*o),a.multiplyScalar(o),i.push(a)}}generateRandomKernelRotations(){const e=new ts,a=16,o=new Float32Array(a);for(let n=0;n<a;n++){const r=Math.random()*2-1,u=Math.random()*2-1,h=0;o[n]=e.noise3d(r,u,h)}this.noiseTexture=new Rt(o,4,4,At,jt),this.noiseTexture.wrapS=ot,this.noiseTexture.wrapT=ot,this.noiseTexture.needsUpdate=!0}overrideVisibility(){const t=this.scene,i=this._visibilityCache;t.traverse(function(e){i.set(e,e.visible),(e.isPoints||e.isLine)&&(e.visible=!1)})}restoreVisibility(){const t=this.scene,i=this._visibilityCache;t.traverse(function(e){const a=i.get(e);e.visible=a}),i.clear()}}re.OUTPUT={Default:0,SSAO:1,Blur:2,Depth:3,Normal:4};class as{constructor(t){this.canvas=t,this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.composer=null,this.lights={ambient:null,directional:null,point:[],spot:[]},this.objects=new Map,this.characters=new Map,this.environment=new Map,this.settings={shadowsEnabled:!0,bloomEnabled:!0,ssaoEnabled:!0,antialias:!0,pixelRatio:Math.min(window.devicePixelRatio,2),fog:{enabled:!0,color:8900331,near:50,far:300}},this.stats={fps:0,drawCalls:0,triangles:0,frameTime:0},this.initialize()}initialize(){this.scene=new zt,this.scene.background=new Pe(8900331),this.settings.fog.enabled&&(this.scene.fog=new Lt(this.settings.fog.color,this.settings.fog.near,this.settings.fog.far)),this.camera=new kt(75,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.set(0,5,10),this.renderer=new Ot({canvas:this.canvas,antialias:this.settings.antialias,alpha:!1}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(this.settings.pixelRatio),this.renderer.shadowMap.enabled=this.settings.shadowsEnabled,this.renderer.shadowMap.type=_t,this.renderer.outputColorSpace=Nt,this.renderer.toneMapping=Ut,this.renderer.toneMappingExposure=1,this.controls=new Kt(this.camera,this.canvas),this.controls.enableDamping=!0,this.controls.dampingFactor=.05,this.controls.maxPolarAngle=Math.PI/2-.1,this.controls.minDistance=5,this.controls.maxDistance=50,this.setupPostProcessing(),this.setupLighting(),window.addEventListener("resize",()=>this.onWindowResize()),logger.info("ThreeDSceneSystem initialized - Advanced 3D rendering active")}setupPostProcessing(){this.composer=new $t(this.renderer);const t=new Jt(this.scene,this.camera);if(this.composer.addPass(t),this.settings.bloomEnabled){const i=new Ce(new T(window.innerWidth,window.innerHeight),.5,.4,.85);this.composer.addPass(i)}if(this.settings.ssaoEnabled){const i=new re(this.scene,this.camera,window.innerWidth,window.innerHeight);i.kernelRadius=16,i.minDistance=.005,i.maxDistance=.1,this.composer.addPass(i)}}setupLighting(){this.lights.ambient=new Ft(16777215,.4),this.scene.add(this.lights.ambient),this.lights.directional=new It(16777215,.8),this.lights.directional.position.set(50,100,50),this.lights.directional.castShadow=!0,this.lights.directional.shadow.mapSize.width=2048,this.lights.directional.shadow.mapSize.height=2048,this.lights.directional.shadow.camera.near=.5,this.lights.directional.shadow.camera.far=500,this.lights.directional.shadow.camera.left=-100,this.lights.directional.shadow.camera.right=100,this.lights.directional.shadow.camera.top=100,this.lights.directional.shadow.camera.bottom=-100,this.scene.add(this.lights.directional);const t=new Bt(8900331,5526612,.3);this.scene.add(t)}async loadSkybox(t){const i=new Ht,e=".jpg",a=`/assets/textures/skyboxes/${t}/`,o=[a+"px"+e,a+"nx"+e,a+"py"+e,a+"ny"+e,a+"pz"+e,a+"nz"+e];try{const n=await i.loadAsync(o);return this.scene.background=n,this.scene.environment=n,n}catch{return logger.warn(`Skybox ${t} not found, using color background`),null}}addCharacter(t,i,e={x:0,y:0,z:0}){return i.position.set(e.x,e.y,e.z),i.castShadow=!0,i.receiveShadow=!0,i.traverse(a=>{a.isMesh&&(a.castShadow=!0,a.receiveShadow=!0)}),this.scene.add(i),this.characters.set(t,i),i}addEnvironment(t,i,e={x:0,y:0,z:0}){return i.position.set(e.x,e.y,e.z),i.receiveShadow=!0,i.traverse(a=>{a.isMesh&&(a.receiveShadow=!0)}),this.scene.add(i),this.environment.set(t,i),i}addPointLight(t,i=16777215,e=1,a=10){const o=new Vt(i,e,a);return o.position.set(t.x,t.y,t.z),o.castShadow=!0,this.scene.add(o),this.lights.point.push(o),o}addSpotLight(t,i,e=16777215,a=1){const o=new Zt(e,a);return o.position.set(t.x,t.y,t.z),o.target.position.set(i.x,i.y,i.z),o.castShadow=!0,o.angle=Math.PI/6,o.penumbra=.3,this.scene.add(o),this.scene.add(o.target),this.lights.spot.push(o),o}followTarget(t,i={x:0,y:5,z:10}){const e=t.position||t;this.controls.target.set(e.x,e.y,e.z);const a=new j(e.x+i.x,e.y+i.y,e.z+i.z);this.camera.position.lerp(a,.1)}updateDayNightLighting(t){const i=t%24;if(i>=6&&i<=18){const e=(i-6)/12,a=Math.PI*e;this.lights.directional.position.x=Math.cos(a)*50,this.lights.directional.position.y=Math.abs(Math.sin(a))*100,this.lights.directional.intensity=.5+Math.sin(a)*.5,i<8?this.lights.directional.color.setHex(16764057):i>16?this.lights.directional.color.setHex(16750950):this.lights.directional.color.setHex(16777215)}else this.lights.directional.intensity=.1,this.lights.directional.color.setHex(6724044);this.lights.ambient.intensity=i>=6&&i<=18?.4:.2}removeObject(t){if(this.objects.has(t)){const i=this.objects.get(t);this.scene.remove(i),this.objects.delete(t)}else if(this.characters.has(t)){const i=this.characters.get(t);this.scene.remove(i),this.characters.delete(t)}else if(this.environment.has(t)){const i=this.environment.get(t);this.scene.remove(i),this.environment.delete(t)}}update(t){this.controls.update(),this.stats.drawCalls=this.renderer.info.render.calls,this.stats.triangles=this.renderer.info.render.triangles,this.stats.frameTime=t,this.stats.fps=Math.round(1/t)}render(){this.composer?this.composer.render():this.renderer.render(this.scene,this.camera)}onWindowResize(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight),this.composer&&this.composer.setSize(window.innerWidth,window.innerHeight)}togglePostProcessing(t){t&&!this.composer&&this.setupPostProcessing()}getStats(){return{...this.stats,objects:this.objects.size+this.characters.size+this.environment.size,characters:this.characters.size,environment:this.environment.size,lights:this.lights.point.length+this.lights.spot.length+2}}dispose(){this.renderer.dispose(),this.controls.dispose(),this.composer&&this.composer.dispose(),this.scene.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(i=>i.dispose()):t.material.dispose())})}}export{as as ThreeDSceneSystem};
