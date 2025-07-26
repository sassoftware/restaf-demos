let q = "[EM_CLASSIFICATION,EM_EVENTPROBABILITY,EM_PROBABILITY,I_diagnosis,P_diagnosisB,P_diagnosisM,_WARN_,diagnosis,radius1,texture1,perimeter1,area1,smoothness1,compactness1,concavity1,concave_points1,symmetry1,fractal_dimension1,radius2,texture2,perimeter2,area2,smoothness2,compactness2,concavity2,concave_points2,symmetry2,fractal_dimension2,radius3,texture3,perimeter3,area3,smoothness3,compactness3,concavity3,concave_points3,symmetry3,fractal_dimension3\nB,0.0006037741792530739,0.9993962258207469,B,0.9993962258207469,0.0006037741792530739,    ,B,12.72,13.78,81.78,492.1,0.09667,0.08393,0.01288,0.01924,0.1638,0.061,0.1807,0.6931,1.34,13.38,0.006064,0.0118,0.006564,0.007978,0.01374,0.001392,13.5,17.48,88.54,553.7,0.1298,0.1472,0.05233,0.06343,0.2369,0.06922]";
let m = q.replace(/[\[\]']+/g, '');

let lines = m.split('\n');
console.log('Lines:', lines);
let headers = lines[0].split(',');
let data = lines.slice(1).map(line => line.split(','));
console.log('Headers:', headers);
console.log('Data:', data);
console.log('First row:', data[0]);