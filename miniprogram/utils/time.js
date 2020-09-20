/**
 * 
 * @param {*} start 开始时间
 * @param {*} dis 间隔天数
 */
export function getDateFromStart(start,dis){
  if(typeof start === "number") return start + dis*24*60*60*1000;
  return new Date(start).getTime() + dis*24*60*60*1000;
}
export function formatTime(value){
  const totalMinutes = Math.round(value/60);
  let mm = totalMinutes%60;
  let hh = Math.floor(totalMinutes/60);
  return `${('0'+hh).slice(-2)}:${('0'+mm).slice(-2)}`
}
export function timeFormat(value,fmt){
  let date = value;
  if(!(value instanceof Date)){
      date =  new Date(value);
  }
  const o = {
      'Y+':date.getFullYear(),
      'M+':date.getMonth()+1,
      'D+':date.getDate(),
      'h+':date.getHours(),
      'm+':date.getMinutes(),
      's+':date.getSeconds(),
      'S+':date.getMilliseconds()
  }
  for(let v in o){
      const reg = new RegExp(`(${v})`);
      if(reg.test(fmt)){
          fmt = fmt.replace(RegExp.$1,RegExp.$1.length===1 ? o[v] : ('000' + o[v]).slice(-RegExp.$1.length));
      }
  }
  return fmt;
}
export function getTime(s){
  return new Date(s).getTime();
}