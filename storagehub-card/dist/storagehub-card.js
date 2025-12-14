function t(t,e,s,r){var i,o=arguments.length,n=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,s):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,r);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(o<3?i(n):o>3?i(e,s,n):i(e,s))||n);return o>3&&n&&Object.defineProperty(e,s,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),i=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=i.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&i.set(e,t))}return t}toString(){return this.cssText}};const n=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,r))(e)})(t):t,{is:a,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:l,getOwnPropertySymbols:d,getPrototypeOf:u}=Object,p=globalThis,g=p.trustedTypes,_=g?g.emptyScript:"",m=p.reactiveElementPolyfillSupport,f=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},$=(t,e)=>!a(t,e),v={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);void 0!==r&&c(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:i}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:r,set(e){const o=r?.call(this);i?.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...l(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,r)=>{if(s)t.adoptedStyleSheets=r.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of r){const r=document.createElement("style"),i=e.litNonce;void 0!==i&&r.setAttribute("nonce",i),r.textContent=s.cssText,t.appendChild(r)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(void 0!==r&&!0===s.reflect){const i=(void 0!==s.converter?.toAttribute?s.converter:b).toAttribute(e,s.type);this._$Em=t,null==i?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(t,e){const s=this.constructor,r=s._$Eh.get(t);if(void 0!==r&&this._$Em!==r){const t=s.getPropertyOptions(r),i="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=r;const o=i.fromAttribute(e,t.type);this[r]=o??this._$Ej?.get(r)??o,this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){const r=this.constructor,i=this[t];if(s??=r.getPropertyOptions(t),!((s.hasChanged??$)(i,e)||s.useDefault&&s.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:i},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==i||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===r&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,r=this[e];!0!==t||this._$AL.has(e)||void 0===r||this.C(e,void 0,s,r)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[f("elementProperties")]=new Map,y[f("finalized")]=new Map,m?.({ReactiveElement:y}),(p.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,A=x.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,w="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+E,C=`<${k}>`,P=document,R=()=>P.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,H="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,N=/>/g,z=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,I=/"/g,D=/^(?:script|style|textarea|title)$/i,L=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),B=Symbol.for("lit-noChange"),Q=Symbol.for("lit-nothing"),q=new WeakMap,V=P.createTreeWalker(P,129);function W(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const K=(t,e)=>{const s=t.length-1,r=[];let i,o=2===e?"<svg>":3===e?"<math>":"",n=U;for(let e=0;e<s;e++){const s=t[e];let a,c,h=-1,l=0;for(;l<s.length&&(n.lastIndex=l,c=n.exec(s),null!==c);)l=n.lastIndex,n===U?"!--"===c[1]?n=M:void 0!==c[1]?n=N:void 0!==c[2]?(D.test(c[2])&&(i=RegExp("</"+c[2],"g")),n=z):void 0!==c[3]&&(n=z):n===z?">"===c[0]?(n=i??U,h=-1):void 0===c[1]?h=-2:(h=n.lastIndex-c[2].length,a=c[1],n=void 0===c[3]?z:'"'===c[3]?I:j):n===I||n===j?n=z:n===M||n===N?n=U:(n=z,i=void 0);const d=n===z&&t[e+1].startsWith("/>")?" ":"";o+=n===U?s+C:h>=0?(r.push(a),s.slice(0,h)+w+s.slice(h)+E+d):s+E+(-2===h?e:d)}return[W(t,o+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),r]};class J{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let i=0,o=0;const n=t.length-1,a=this.parts,[c,h]=K(t,e);if(this.el=J.createElement(c,s),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=V.nextNode())&&a.length<n;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(w)){const e=h[o++],s=r.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:i,name:n[2],strings:s,ctor:"."===n[1]?Y:"?"===n[1]?tt:"@"===n[1]?et:X}),r.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:i}),r.removeAttribute(t));if(D.test(r.tagName)){const t=r.textContent.split(E),e=t.length-1;if(e>0){r.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)r.append(t[s],R()),V.nextNode(),a.push({type:2,index:++i});r.append(t[e],R())}}}else if(8===r.nodeType)if(r.data===k)a.push({type:2,index:i});else{let t=-1;for(;-1!==(t=r.data.indexOf(E,t+1));)a.push({type:7,index:i}),t+=E.length-1}i++}}static createElement(t,e){const s=P.createElement("template");return s.innerHTML=t,s}}function Z(t,e,s=t,r){if(e===B)return e;let i=void 0!==r?s._$Co?.[r]:s._$Cl;const o=T(e)?void 0:e._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),void 0===o?i=void 0:(i=new o(t),i._$AT(t,s,r)),void 0!==r?(s._$Co??=[])[r]=i:s._$Cl=i),void 0!==i&&(e=Z(t,i._$AS(t,e.values),i,r)),e}class F{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??P).importNode(e,!0);V.currentNode=r;let i=V.nextNode(),o=0,n=0,a=s[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new G(i,i.nextSibling,this,t):1===a.type?e=new a.ctor(i,a.name,a.strings,this,t):6===a.type&&(e=new st(i,this,t)),this._$AV.push(e),a=s[++n]}o!==a?.index&&(i=V.nextNode(),o++)}return V.currentNode=P,r}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class G{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=Q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),T(t)?t===Q||null==t||""===t?(this._$AH!==Q&&this._$AR(),this._$AH=Q):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Q&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,r="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=J.createElement(W(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{const t=new F(r,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new J(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const i of t)r===e.length?e.push(s=new G(this.O(R()),this.O(R()),this,this.options)):s=e[r],s._$AI(i),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,i){this.type=1,this._$AH=Q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=i,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=Q}_$AI(t,e=this,s,r){const i=this.strings;let o=!1;if(void 0===i)t=Z(this,t,e,0),o=!T(t)||t!==this._$AH&&t!==B,o&&(this._$AH=t);else{const r=t;let n,a;for(t=i[0],n=0;n<i.length-1;n++)a=Z(this,r[s+n],e,n),a===B&&(a=this._$AH[n]),o||=!T(a)||a!==this._$AH[n],a===Q?t=Q:t!==Q&&(t+=(a??"")+i[n+1]),this._$AH[n]=a}o&&!r&&this.j(t)}j(t){t===Q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Y extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Q?void 0:t}}class tt extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Q)}}class et extends X{constructor(t,e,s,r,i){super(t,e,s,r,i),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??Q)===B)return;const s=this._$AH,r=t===Q&&s!==Q||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==Q&&(s===Q||r);r&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const rt=x.litHtmlPolyfillSupport;rt?.(J,G),(x.litHtmlVersions??=[]).push("3.3.1");const it=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ot extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const r=s?.renderBefore??e;let i=r._$litPart$;if(void 0===i){const t=s?.renderBefore??null;r._$litPart$=i=new G(e.insertBefore(R(),t),t,void 0,s??{})}return i._$AI(t),i})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}ot._$litElement$=!0,ot.finalized=!0,it.litElementHydrateSupport?.({LitElement:ot});const nt=it.litElementPolyfillSupport;nt?.({LitElement:ot}),(it.litElementVersions??=[]).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const at={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:$},ct=(t=at,e,s)=>{const{kind:r,metadata:i}=s;let o=globalThis.litPropertyMetadata.get(i);if(void 0===o&&globalThis.litPropertyMetadata.set(i,o=new Map),"setter"===r&&((t=Object.create(t)).wrapped=!0),o.set(s.name,t),"accessor"===r){const{name:r}=s;return{set(s){const i=e.get.call(this);e.set.call(this,s),this.requestUpdate(r,i,t)},init(e){return void 0!==e&&this.C(r,void 0,t,e),e}}}if("setter"===r){const{name:r}=s;return function(s){const i=this[r];e.call(this,s),this.requestUpdate(r,i,t)}}throw Error("Unsupported decorator location: "+r)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ht(t){return(e,s)=>"object"==typeof s?ct(t,e,s):((t,e,s)=>{const r=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),r?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function lt(t){return ht({...t,state:!0,attribute:!1})}const dt=((t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[r+1],t[0]);return new o(s,t,r)})`
  :host {
    --storagehub-primary: var(--primary-color, #03a9f4);
    --storagehub-warning: var(--warning-color, #ff9800);
    --storagehub-error: var(--error-color, #f44336);
    --storagehub-success: var(--success-color, #4caf50);
    --storagehub-text-primary: var(--primary-text-color, #212121);
    --storagehub-text-secondary: var(--secondary-text-color, #727272);
    --storagehub-divider: var(--divider-color, rgba(0, 0, 0, 0.12));
    --storagehub-surface: var(--card-background-color, #fff);
    --storagehub-surface-variant: var(--secondary-background-color, #fafafa);
  }

  ha-card {
    overflow: hidden;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 16px 0;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .title {
    font-size: 1.2em;
    font-weight: 500;
    color: var(--storagehub-text-primary);
  }

  .status-icon {
    --mdc-icon-size: 20px;
  }

  .status-icon.offline {
    color: var(--storagehub-error);
  }

  .status-icon.online {
    color: var(--storagehub-success);
  }

  .card-content {
    padding: 16px;
  }

  /* Search input */
  .search-container {
    position: relative;
  }

  .search-input-wrapper {
    display: flex;
    align-items: center;
    background: var(--storagehub-surface-variant);
    border-radius: 28px;
    padding: 8px 16px;
    gap: 12px;
    border: 2px solid transparent;
    transition: border-color 0.2s, background-color 0.2s;
  }

  .search-input-wrapper:focus-within {
    border-color: var(--storagehub-primary);
    background: var(--storagehub-surface);
  }

  .search-input-wrapper ha-icon {
    color: var(--storagehub-text-secondary);
    --mdc-icon-size: 24px;
    flex-shrink: 0;
  }

  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 16px;
    color: var(--storagehub-text-primary);
    outline: none;
    min-width: 0;
  }

  .search-input::placeholder {
    color: var(--storagehub-text-secondary);
  }

  .search-spinner {
    --mdc-circular-progress-bar-color: var(--storagehub-primary);
  }

  .clear-button {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: var(--storagehub-text-secondary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .clear-button:hover {
    background: var(--storagehub-divider);
  }

  .clear-button ha-icon {
    --mdc-icon-size: 18px;
  }

  /* Search results */
  .search-results {
    margin-top: 12px;
    border: 1px solid var(--storagehub-divider);
    border-radius: 12px;
    overflow: hidden;
    max-height: 350px;
    overflow-y: auto;
  }

  .result-item {
    display: flex;
    align-items: center;
    padding: 12px;
    gap: 12px;
    cursor: pointer;
    border-bottom: 1px solid var(--storagehub-divider);
    transition: background-color 0.15s;
  }

  .result-item:last-child {
    border-bottom: none;
  }

  .result-item:hover {
    background: var(--storagehub-surface-variant);
  }

  .item-image {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .item-image-placeholder {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: var(--storagehub-surface-variant);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .item-image-placeholder ha-icon {
    color: var(--storagehub-text-secondary);
    --mdc-icon-size: 24px;
  }

  .item-details {
    flex: 1;
    min-width: 0;
  }

  .item-name {
    font-weight: 500;
    color: var(--storagehub-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-location {
    font-size: 0.85em;
    color: var(--storagehub-text-secondary);
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    flex-wrap: wrap;
  }

  .item-location ha-icon {
    --mdc-icon-size: 14px;
  }

  .location-separator {
    opacity: 0.5;
  }

  .item-condition {
    font-size: 0.7em;
    padding: 2px 8px;
    border-radius: 12px;
    text-transform: uppercase;
    font-weight: 600;
    margin-top: 4px;
    display: inline-block;
  }

  .condition-fair {
    background: var(--storagehub-warning);
    color: white;
  }

  .condition-damaged,
  .condition-needs_repair {
    background: var(--storagehub-error);
    color: white;
  }

  /* No results / Error states */
  .no-results,
  .error-message {
    padding: 24px;
    text-align: center;
    color: var(--storagehub-text-secondary);
  }

  .error-message {
    color: var(--storagehub-error);
  }

  .search-hint {
    font-size: 0.9em;
    color: var(--storagehub-text-secondary);
    text-align: center;
    padding: 8px;
    margin-top: 8px;
  }

  /* Stats section */
  .stats-section {
    display: flex;
    justify-content: space-around;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--storagehub-divider);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.15s;
  }

  .stat-item:hover {
    background: var(--storagehub-surface-variant);
  }

  .stat-item ha-icon {
    --mdc-icon-size: 24px;
    color: var(--storagehub-text-secondary);
  }

  .stat-item.warning ha-icon {
    color: var(--storagehub-warning);
  }

  .stat-value {
    font-size: 1.5em;
    font-weight: 600;
    color: var(--storagehub-text-primary);
  }

  .stat-item.warning .stat-value {
    color: var(--storagehub-warning);
  }

  .stat-label {
    font-size: 0.8em;
    color: var(--storagehub-text-secondary);
  }

  /* External link */
  .storagehub-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
    padding: 10px;
    color: var(--storagehub-primary);
    text-decoration: none;
    border-radius: 8px;
    font-size: 0.9em;
    transition: background-color 0.15s;
  }

  .storagehub-link:hover {
    background: var(--storagehub-surface-variant);
  }

  .storagehub-link ha-icon {
    --mdc-icon-size: 18px;
  }

  /* Scrollbar styling */
  .search-results::-webkit-scrollbar {
    width: 8px;
  }

  .search-results::-webkit-scrollbar-track {
    background: transparent;
  }

  .search-results::-webkit-scrollbar-thumb {
    background: var(--storagehub-divider);
    border-radius: 4px;
  }

  .search-results::-webkit-scrollbar-thumb:hover {
    background: var(--storagehub-text-secondary);
  }
`;console.info("%c STORAGEHUB-CARD %c 1.0.0 ","color: white; background: #03a9f4; font-weight: bold;","color: #03a9f4; background: white; font-weight: bold;");let ut=class extends ot{constructor(){super(...arguments),this._searchQuery="",this._searchResults=[],this._isSearching=!1,this._searchError=null,this._hasSearched=!1}setConfig(t){if(!t)throw new Error("Invalid configuration");this._config={title:"StorageHub",show_stats:!0,show_reminders:!0,max_results:10,debounce_ms:300,...t}}getCardSize(){return 3}static getStubConfig(){return{type:"custom:storagehub-card",title:"StorageHub",show_stats:!0,show_reminders:!0}}render(){if(!this.hass||!this._config)return L``;const t=this.hass.states["sensor.storagehub_total_items"],e=this.hass.states["sensor.storagehub_overdue_reminders"],s=this.hass.states["binary_sensor.storagehub_connected"],r="on"===s?.state,i=t?.state??"—",o=parseInt(e?.state??"0",10);return L`
      <ha-card>
        <div class="card-header">
          <div class="header-left">
            <span class="title">${this._config.title}</span>
          </div>
          ${s?L`
                <ha-icon
                  class="status-icon ${r?"online":"offline"}"
                  icon="${r?"mdi:cloud-check":"mdi:cloud-off-outline"}"
                  title="${r?"Connected":"Disconnected"}"
                ></ha-icon>
              `:Q}
        </div>

        <div class="card-content">
          <!-- Search Input -->
          ${this._renderSearchInput()}

          <!-- Search Results -->
          ${this._hasSearched?this._renderSearchResults():Q}

          <!-- Stats Section (hidden when showing results) -->
          ${!this._hasSearched&&this._config.show_stats?this._renderStats(i,o):Q}

          <!-- Link to StorageHub -->
          ${this._config.storagehub_url?L`
                <a
                  href="${this._config.storagehub_url}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="storagehub-link"
                >
                  <ha-icon icon="mdi:open-in-new"></ha-icon>
                  Open StorageHub
                </a>
              `:Q}
        </div>
      </ha-card>
    `}_renderSearchInput(){return L`
      <div class="search-container">
        <div class="search-input-wrapper">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="text"
            class="search-input"
            placeholder="Search inventory..."
            .value=${this._searchQuery}
            @input=${this._handleSearchInput}
            @keydown=${this._handleKeyDown}
          />
          ${this._isSearching?L`
                <ha-circular-progress
                  class="search-spinner"
                  indeterminate
                  size="small"
                ></ha-circular-progress>
              `:Q}
          ${this._searchQuery&&!this._isSearching?L`
                <button
                  class="clear-button"
                  @click=${this._clearSearch}
                  title="Clear search"
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              `:Q}
        </div>
        ${this._hasSearched?Q:L`<div class="search-hint">
              Type at least 2 characters to search
            </div>`}
      </div>
    `}_renderSearchResults(){return this._searchError?L`
        <div class="error-message">
          <ha-icon icon="mdi:alert-circle"></ha-icon>
          ${this._searchError}
        </div>
      `:0!==this._searchResults.length||this._isSearching?L`
      <div class="search-results">
        ${this._searchResults.map(t=>this._renderResultItem(t))}
      </div>
    `:L`
        <div class="no-results">
          <ha-icon icon="mdi:magnify-close"></ha-icon>
          <div>No items found for "${this._searchQuery}"</div>
        </div>
      `}_renderResultItem(t){const e=t.primary_image_url?this._config.storagehub_url?`${this._config.storagehub_url}${t.primary_image_url}`:t.primary_image_url:null;return L`
      <div class="result-item" @click=${()=>this._handleResultClick(t)}>
        ${e?L`<img class="item-image" src="${e}" alt="" />`:L`
              <div class="item-image-placeholder">
                <ha-icon icon="mdi:package-variant-closed"></ha-icon>
              </div>
            `}
        <div class="item-details">
          <div class="item-name">${t.name}</div>
          <div class="item-location">
            <ha-icon icon="mdi:archive"></ha-icon>
            ${t.container_name}
            <span class="location-separator">•</span>
            <ha-icon icon="mdi:map-marker"></ha-icon>
            ${t.location_name}
          </div>
          ${"good"!==t.condition?L`
                <span class="item-condition condition-${t.condition}">
                  ${t.condition.replace("_"," ")}
                </span>
              `:Q}
        </div>
      </div>
    `}_renderStats(t,e){return L`
      <div class="stats-section">
        <div
          class="stat-item"
          @click=${()=>this._openStorageHub("/items")}
          title="View all items"
        >
          <ha-icon icon="mdi:package-variant"></ha-icon>
          <span class="stat-value">${t}</span>
          <span class="stat-label">Items</span>
        </div>
        ${this._config.show_reminders?L`
              <div
                class="stat-item ${e>0?"warning":""}"
                @click=${()=>this._openStorageHub("/reminders")}
                title="View reminders"
              >
                <ha-icon
                  icon="${e>0?"mdi:bell-alert":"mdi:bell-outline"}"
                ></ha-icon>
                <span class="stat-value">${e}</span>
                <span class="stat-label">Overdue</span>
              </div>
            `:Q}
      </div>
    `}_handleSearchInput(t){const e=t.target;this._searchQuery=e.value,this._searchError=null,this._debounceTimer&&clearTimeout(this._debounceTimer),this._searchQuery.length>=2?this._debounceTimer=setTimeout(()=>{this._performSearch()},this._config.debounce_ms):(this._searchResults=[],this._hasSearched=!1)}_handleKeyDown(t){"Escape"===t.key?this._clearSearch():"Enter"===t.key&&this._searchQuery.length>=2&&(this._debounceTimer&&clearTimeout(this._debounceTimer),this._performSearch())}_clearSearch(){this._searchQuery="",this._searchResults=[],this._searchError=null,this._hasSearched=!1,this._debounceTimer&&clearTimeout(this._debounceTimer)}async _performSearch(){if(this._searchQuery&&!(this._searchQuery.length<2)){this._isSearching=!0,this._searchError=null,this._hasSearched=!0;try{const t=await this.hass.callService("storagehub","search",{query:this._searchQuery,limit:this._config.max_results},void 0,!0);this._searchResults=t?.items??[]}catch(t){console.error("StorageHub search error:",t),this._searchError="Search failed. Check connection.",this._searchResults=[]}finally{this._isSearching=!1}}}_handleResultClick(t){this._config.storagehub_url&&window.open(`${this._config.storagehub_url}/items/${t.id}`,"_blank","noopener,noreferrer")}_openStorageHub(t){this._config.storagehub_url&&window.open(`${this._config.storagehub_url}${t}`,"_blank","noopener,noreferrer")}};ut.styles=dt,t([ht({attribute:!1})],ut.prototype,"hass",void 0),t([lt()],ut.prototype,"_config",void 0),t([lt()],ut.prototype,"_searchQuery",void 0),t([lt()],ut.prototype,"_searchResults",void 0),t([lt()],ut.prototype,"_isSearching",void 0),t([lt()],ut.prototype,"_searchError",void 0),t([lt()],ut.prototype,"_hasSearched",void 0),ut=t([(t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("storagehub-card")],ut),window.customCards=window.customCards||[],window.customCards.push({type:"storagehub-card",name:"StorageHub Card",description:"Search your StorageHub inventory",preview:!0});export{ut as StorageHubCard};
