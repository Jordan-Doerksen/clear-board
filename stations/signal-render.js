/* signal-render.js — VERBATIM copy of the verified SVG signal renderer.
 *
 * Source: C:\projects\CN Conductor Trainer\modules\Signal Reading.html (inline <script>).
 * drawSignal() and its helper lampFill() are copied EXACTLY, byte-for-byte, from the
 * source — NOT reimplemented or cleaned up. They consume the same spec shape the source
 * uses, unchanged. Only the ES-module `export` keywords have been added.
 *
 * spec shape (top→bottom lamp head codes): {
 *   heads:   ["G"|"R"|"Y"|"L"|"D", ...]   // each may carry an 'f' suffix to flash THAT lamp
 *   type:    "mast" | "dwarf"
 *   plaque:  "DV" | "R" | "L"   (optional; there is NO "A" absolute plate in Canada)
 *   stagger: true               (optional; staggers heads left/right)
 *   flash:   true               (optional; flashes all lit lamps)
 * }
 */

// ===== begin verbatim copy from Signal Reading.html =====
export function lampFill(c){return ({G:"#27d65a",R:"#ff453a",Y:"#ffd60a",L:"#dfe9ff",D:"#16202c"})[c]||"#16202c";}
export function drawSignal(spec){
  var heads=spec.heads||["R"], dwarf=spec.type==="dwarf", plq=spec.plaque||null, stag=!!spec.stagger, flash=!!spec.flash;
  var R=12,gap=7,pitch=2*R+gap,n=heads.length,S=stag?9:0;
  var W=80+2*S,top=14,headsH=n*pitch-gap, poleLen=dwarf?20:62, poleBottom=top+headsH+poleLen, H=poleBottom+(plq?34:16),cx=W/2;
  var p=[];
  p.push('<svg viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" xmlns="http://www.w3.org/2000/svg">');
  p.push('<rect x="'+(cx-3)+'" y="'+(top+headsH-2)+'" width="6" height="'+poleLen+'" fill="#46586e"/>');
  p.push('<rect x="'+(cx-15)+'" y="'+(poleBottom-3)+'" width="30" height="6" rx="2" fill="#46586e"/>');
  for(var i=0;i<n;i++){
    var raw=heads[i], hf=(typeof raw==='string'&&raw.charAt(raw.length-1)==='f'), c=hf?raw.slice(0,-1):raw;
    var hx=cx+(stag?((i%2===0)?-S:S):0), cy=top+i*pitch+R, fill=lampFill(c), lit=c!=="D", fl=(hf||flash)&&lit;
    p.push('<circle cx="'+hx+'" cy="'+cy+'" r="'+(R+3)+'" fill="#0a0f16" stroke="#2c3340" stroke-width="1.5"/>');
    p.push('<circle cx="'+hx+'" cy="'+cy+'" r="'+R+'" fill="'+fill+'" stroke="#000" stroke-width="1.2">'+(fl?'<animate attributeName="opacity" values="1;0.12;1" dur="1s" repeatCount="indefinite"/>':'')+'</circle>');
    if(lit)p.push('<circle cx="'+(hx-3.5)+'" cy="'+(cy-3.5)+'" r="3.2" fill="#ffffff" opacity="0.5"/>');
  }
  if(plq){
    var py=poleBottom+4;
    p.push('<rect x="'+(cx-13)+'" y="'+py+'" width="26" height="22" rx="3" fill="#eef" stroke="#7a8aa0"/>');
    p.push('<text x="'+cx+'" y="'+(py+16)+'" text-anchor="middle" font-family="monospace" font-weight="800" font-size="14" fill="#111">'+plq+'</text>');
  }
  p.push('</svg>');
  return p.join('');
}
// ===== end verbatim copy =====
