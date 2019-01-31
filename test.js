var spawn = require("child_process").spawn;
var process = spawn('python',["./pos_tag.py", 
  "Extract all the records with id=1 to id=3 for student table"] );

process.stdout.on('data', function(data) { 
  console.log(data.toString()); 
} ) 