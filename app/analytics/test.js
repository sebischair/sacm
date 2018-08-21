function uppercase(a) {
  return a.charAt(0).toUpperCase() + a.slice(1);
}

let g = 'actions'
let short = 'a';
let a =  {
  "nr": 26,
  "activateStage": 0,
  "completeStage": 1,
  "activateHumanTask": 0,
  "activateDualTask": 3,
  "completeHumanTask": 14,
  "completeAutomatedTask": 0,
  "completeDualTaskHumanPart": 3,
  "completeDualTaskAutomatedPart": 3,
  "correctHumanTask": 1,
  "correctDualTaskHumanPart": 1,
  "createAlert": 0,
  "breakpoint": 4
}

var arr = [];
var keys = Object.keys(a);
for(var i=0; i<keys.length; i++){
  console.log({ key: g+uppercase(keys[i]), header: uppercase(keys[i]), width:5});
}

for(var i=0; i<keys.length; i++){
  console.log(g+uppercase(keys[i]) +': '+short+' ? '+short+'.'+keys[i]+" : '',");
}
