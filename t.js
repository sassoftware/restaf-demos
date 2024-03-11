function test (...args){
  console.log(args);
  btest(args);
}
function btest(args){
  console.log(args);

}
test(1, {a:1}) ; 