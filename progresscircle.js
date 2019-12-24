const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		
		<style>

			#progresscircle {
				display: inline-block;
				width: 100px;
				height: 100px;
			}
			.fa {
				position: relative;
				padding: 0px;
				margin: 0px;
				left: 16px;
				top: -72px;
			}
			#cgroup {
				position: relative;
				padding: 0px;
				margin: 0px;
				top: 0px;
				left: 0px;
			}
			
			.badge1 {
			   content:attr(data-badge);
			   position:relative;
			   padding: 2px;
			   display: inline-block;
			   top:-40px;
			   left:-14px;
			   font-size:.7em;
			   background:green;
			   color:white;
			   width:18px;height:18px;
			   text-align:center;
			   line-height:18px;
			   border-style: solid;
			   border-width: 2px;
			   border-radius:50%;
			   box-shadow:0 0 1px #333;
			}
			
			.tooltipmodal {
			  /*visibility: hidden;*/
			  --alert-color: #ff6f69;
			  width: 1px;
			  height: 1px;
			  background-color: black;
			  border-style: solid;
			  border-width: 2px;
			  color: #fff;
			  text-align: center;
			  /*overflow: hidden; */
			  padding: 5px 0;
			  border-radius: 15px;	
			  /* Position the tooltip text - see examples below! */
			  position: relative;
			  left: -50%;
			  top: -40%;
			  z-index: 1;
			}
			
			.tooltipmodal::after {
			  content: " ";
			  position: absolute;
			  bottom: 100%;  /* At the top of the tooltip */
			  left: 50%;
			  margin-left: -5px;
			  border-width: 5px;
			  border-style: solid;
			  border-color: transparent transparent var(--alert-color);  transparent;
			}


		</style>
		
		
		<div style="text-align: center;"> 
			<div id="progresscircle" > 
				<svg id="cgroup" width="100" height="100">
					<circle cx="50" cy="50" r="50" stroke="black" stroke-width="1" fill="white"/>
					<circle id="innercircle" cx="50" cy="50" r="40" stroke="black" stroke-width="1" fill="yellow" /> 
					<path d="M 50 95 A 45 45 90 0 1 50 95"  style="stroke:green; stroke-width: 10; fill: none" /> 
				</svg> 
				<i id="icon1" class="fa fa-apple" style="font-size:36px"></i>
				<div class="badge1" data-total="10" data-current="9">10</div>
				<div class="tooltipmodal" id="myP" style="visibility: hidden">				
					<h2>Title</h2>
					<div id="modalx">
					
					</div>
				</div> 
			</div>
		</div> 
`;


class Progresscircle extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
	this.svg = this._shadowRoot.querySelector('svg');
	this.innercircle = this._shadowRoot.querySelector('#innercircle');
	this.progress = this._shadowRoot.querySelector('path');
	this.icon1 = this._shadowRoot.querySelector('i#icon1');
	this.badge = this._shadowRoot.querySelector('div.badge1');
	this.tooltip = this._shadowRoot.querySelector('.tooltipmodal');
	this.toolheader = this._shadowRoot.querySelector('h2');
	this.toolbody = this._shadowRoot.querySelector('div#modalx');
	this.pc = this._shadowRoot.querySelector('#progresscircle');
	this.toolbody.innerHTML = this.innerHTML;
	//this.icon1.setAttribute('class', this.icontype); 
    //this.getpath();
  }
  connectedCallback() {
	  this.pc.addEventListener('click', this.showtest);
  }
  
  disconnectedCallback() {
      this.pc.removeEventListener("click", this.showtest);
  }
  
  comeon(){
	alert(this.badge);
  }
  
  showtest = (evt) => {
	var x = this.tooltip.style.visibility;
	if(x=='hidden'){
		this.tooltip.style.visibility = "visible";
		this.tooltip.style.width = "200px";
		this.tooltip.style.height = "200px";
		this.tooltip.style.transform = "rotate(360deg)";
		this.tooltip.style.overflow = "initial";
		this.tooltip.style.transition = "width 1s, height 1s, visibility 1s, transform 1s";
	}
	else{
		this.tooltip.style.width = "1px";
		this.tooltip.style.height = "1px";
		this.tooltip.style.transform = "rotate(0deg)";
		this.tooltip.style.overflow = "hidden"; 
		this.tooltip.style.visibility = "hidden"; 
		this.tooltip.style.transition = "width 1s, height 1s, visibility 1s, transform 1s";
	}
  };
  
  getpath(){
		
		const cos = Math.cos;
		const sin = Math.sin;
		const pi = Math.PI;

		const f_matrix_times = (( [[a,b], [c,d]], [x,y]) => [ a * x + b * y, c * x + d * y]);
		const f_rotate_matrix = ((x) => [[cos(x),-sin(x)], [sin(x), cos(x)]]);
		const f_vec_add = (([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2]);

		let f_svg_ellipse_arc = (([cx,cy],[rx,ry], [t1, delta], w1 ) => {
				/* [
				returns a SVG path element that represent a ellipse.
				cx,cy → center of ellipse
				rx,ry → major minor radius
				t1 → start angle, in radian.
				Δ → angle to sweep, in radian. positive.
				φ → rotation on the whole, in radian
				url: SVG Circle Arc http://xahlee.info/js/svg_circle_arc.html
				Version 2019-06-19
				 ] */
			delta = delta % (2*pi);
			const rotMatrix = f_rotate_matrix (w1);
			const [sX, sY] = ( f_vec_add ( f_matrix_times ( rotMatrix, [rx * cos(t1), ry * sin(t1)] ), [cx,cy] ) );
			const [eX, eY] = ( f_vec_add ( f_matrix_times ( rotMatrix, [rx * cos(t1+delta), ry * sin(t1+delta)] ), [cx,cy] ) );
			const fA = ( (  delta > pi ) ? 1 : 0 );
			const fS = ( (  delta > 0 ) ? 1 : 0 );
			//path_2wk2r.setAttribute("d", "M " + sX + " " + sY + " A " + [ rx , ry , φ / (2*π) *360, fA, fS, eX, eY ].join(" "));
			var path1 = "M " + sX + " " + sY + " A " + rx + " " + ry + " " + String(w1 / (2*pi) *360) + " " + fA + " " + fS + " " + eX + " " + eY
			return path1
		});
			
		//var total = document.getElementsByClassName("badge1")[0].getAttribute("data-total");
		//var current = document.getElementsByClassName("badge1")[0].getAttribute("data-current");			
		var d = (360/this.total) * this.current;
		var r = (d * 3.142)/180;
		let path = f_svg_ellipse_arc([50,50],[45,45], [0, r], 1.5708 );
		//var x = document.getElementById("cgroup");
		//x.querySelector("path").setAttribute("d", path);
		this.progress.setAttribute("d", path);
  }
  
  get total() {
    return this.getAttribute('total');
  }
  
  get current() {
    return this.getAttribute('current');
  }
  
  get bgcolor() {
    return this.getAttribute('bgcolor');
  }
  
  get progresscolor() {
    return this.getAttribute('progresscolor');
  }
  
  get modaltitel() {
    return this.getAttribute('modaltitle');
  }
  
  set modaltitle(newValue) {
    this.setAttribute('modaltitle', newValue);
  }
  
  get icontype(){
	return this.getAttribute('icontype');  
  }
  
  get badgetext(){
	return this.getAttribute('badgetext');  
  }
  
  set icontype(data){
	//alert(data);
	this.setAttribute('icontype', data);  
  }
  
  get modalbody(){
	return this.innerHTML;  
  }
  
  static get observedAttributes() {
    return ['total', 'current', "bgcolor", "progresscolor", "modaltitle", "icontype", "badgetext"];
  }
  
  attributeChangedCallback(name, oldVal, newVal) {
    if(name == 'total'){
		this.badge.setAttribute("total", newVal);
		this.getpath();
	}
	else if(name == 'current'){
	    this.badge.setAttribute("current", newVal);
		this.getpath();
	}
	else if(name == 'bgcolor'){
	    this.innercircle.setAttribute("fill", newVal);
		this.tooltip.style.background = newVal;
		this.tooltip.style.setProperty('--alert-color', newVal);
	}
	else if(name == 'progresscolor'){
	    this.progress.style.stroke = newVal;
		this.badge.style.background = newVal;
	}
	else if(name == 'modaltitle'){
		this.toolheader.innerText = newVal;
	}
	else if(name == 'icontype'){
	    this.icon1.setAttribute("class", newVal);;
	}
	else if(name == 'badgetext'){
	    this.badge.innerHTML = newVal; 
	}
	else{
		this.toolbody.innerHTML = newVal;
	}
  }

}

window.customElements.define('progress-circle', Progresscircle);
// <progress-circle total="10" current="3" bgcolor="yellow" progresscolor="green" modaltitle="Title" icon="fa fa-apple">Modal body</progress-circle>