// Tool-only local frames share the page's palette and fit their actual content.
const frames={visualizer:document.querySelector('#visualizer iframe'),calculator:document.querySelector('#calculator iframe')};
let selectedColor=null;
window.addEventListener('message',event=>{
  if(event.origin!==location.origin||!event.data)return;
  const {type,tool,height,color}=event.data;
  if(type==='sme-height'&&frames[tool]&&event.source===frames[tool].contentWindow&&Number.isFinite(height)&&height>0&&height<10000){frames[tool].style.height=Math.ceil(height)+'px';}
  if(type==='sme-color'&&event.source===frames.visualizer.contentWindow&&typeof color==='string'){
    selectedColor=color;
    frames.calculator.contentWindow.postMessage({type:'sme-color',color},location.origin);
    document.getElementById('calculator').scrollIntoView({behavior:'smooth'});
  }
  if(type==='sme-track'&&event.source===frames.calculator.contentWindow){window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:event.data.event,...event.data.data});}
});
frames.calculator.addEventListener('load',()=>{if(selectedColor)frames.calculator.contentWindow.postMessage({type:'sme-color',color:selectedColor},location.origin);});
