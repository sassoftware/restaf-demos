let x = {a:1, b:2, c:{x:1, y:2}};
let s1 = JSON.stringify(x, null, 4);
console.log(s1);
let s1a = s1.split('\n');
console.log(s1a);