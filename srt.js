var s = [{"id":"1","startTime":420,"endTime":8950,"text":"you"},{"id":"2","startTime":8950,"endTime":12440,"text":"hi Thomas from Phil Jenny's the service"},{"id":"3","startTime":12440,"endTime":14150,"text":"the most complex stroke in tennis and"},{"id":"4","startTime":14150,"endTime":16040,"text":"that's why it's the most difficult one"},{"id":"5","startTime":16040,"endTime":18500,"text":"to master so if you want to build a"},{"id":"6","startTime":18500,"endTime":21320,"text":"proper advanced tennis serve meaning"},{"id":"7","startTime":21320,"endTime":23570,"text":"you're using a continental grip and"},{"id":"8","startTime":23570,"endTime":25730,"text":"you're able to hit the ball with topspin"},{"id":"9","startTime":25730,"endTime":28700,"text":"slice or hit it flat then you have to"},{"id":"10","startTime":28700,"endTime":31250,"text":"follow proper progressions in order to"},{"id":"11","startTime":31250,"endTime":34450,"text":"build technically correct advanced serve"},{"id":"12","startTime":34450,"endTime":37010,"text":"the following video is an overview of"},{"id":"13","startTime":37010,"endTime":39680,"text":"the fundamentals of a tennis serve and I"}];

var parser = require('subtitles-parser');
var fs = require('fs');

var ss = parser.toSrt(s);
console.log(ss)
fs.writeFileSync('zzz.srt', ss);