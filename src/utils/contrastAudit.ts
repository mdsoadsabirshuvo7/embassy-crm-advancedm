// Simple contrast checker for runtime dev diagnostics.
// Usage: import { auditPalette } and call in dev console.
function luminance(r: number,g: number,b: number){
  const a=[r,g,b].map(v=>{v/=255;return v<=0.03928? v/12.92: Math.pow((v+0.055)/1.055,2.4);});
  return a[0]*0.2126+a[1]*0.7152+a[2]*0.0722;
}
function contrast(hex1: string, hex2: string){
  const toRGB=(h:string)=>{h=h.replace('#',''); if(h.length===3) h=[...h].map(c=>c+c).join(''); const num=parseInt(h,16); return [num>>16 &255, num>>8 &255, num&255];};
  const [r1,g1,b1]=toRGB(hex1); const [r2,g2,b2]=toRGB(hex2);
  const l1=luminance(r1,g1,b1)+0.05; const l2=luminance(r2,g2,b2)+0.05; return l1>l2? l1/l2: l2/l1;
}
export function auditPalette(pairs: Array<[string,string]>){
  return pairs.map(([fg,bg]) => ({ fg, bg, ratio: Number(contrast(fg,bg).toFixed(2)) }));
}
