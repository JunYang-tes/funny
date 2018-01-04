

function encode(code){
  padding=(str)=> (str.length<8 ? new Array(8-str.length).fill('0').join(''):'')+str
  return Array.from(code).map(c=>
    padding(c.charCodeAt(0).toString(2)).replace(/1/g,'\u200c').replace(/0/g,'\u200d')
  )
    .join("")
}
function decode(code){
  return code.replace(/(.{8})/g,(v)=>String.fromCharCode(parseInt(
    v.replace(/\u200c/g,'1').replace(/\u200d/g,'0'),2)))
}
function run(code){
  (new Function(decode(code)))()
}
function executable(code){
  return `eval('${encode(code)}'.replace(/(.{8})/g,(v)=>String.fromCharCode(parseInt(
    v.replace(/\u200c/g,'1').replace(/\u200d/g,'0'),2))))`
}
console.log(executable('console.log("hello")'))