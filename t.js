const getThread = (client) => (args) =>{
    return lowf(args);
  }
function lowf(args) {
  console.log(Array.isArray(args));
  console.log(args);
  console.log('lowf', )
  return args;
}

const tf = getThread('client');

let r = tf(1,2,3);
console.log(r);
