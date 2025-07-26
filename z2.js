let message = 'x=b,y=c,z=10,w=  ,t=10';

let cols = [];
let values = [];
let r1 = message.split(',').reduce((acc, pair) => {
    let [key, value] = pair.split('=');
    cols.push(key);
    values.push(value);
    console.log(value === undefined, ' value is undefined');
    console.log(typeof value);
    console.log('Key:', key, 'Value:', value);
    if (value.length === 0) {
        value = '  '; // Replace empty value with two spaces
    }
    acc[key] = value;
    return acc;
}, {});
let csv = cols.join(',') + '\n' + values.join(',');
console.log('Received message as JS Object ', r1);
console.log('Received message as CSV: ', csv);
