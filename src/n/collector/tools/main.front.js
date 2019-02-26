module.exports = {
    // 根据gender排序
    resortAthleteByGender: function (athletes, gender){
        var males = [], females = [];

        athletes.forEach(function(athlete){
            if(athlete.gender == 1){
                males.push(athlete)
            }else if(athlete.gender == 2){
                females.push(athlete)
            }
        })

        if(gender == 1){
            athletes = males.concat(females)
        }else if(gender == 2){
            athletes = females.concat(males)
        }

        return athletes;
    }
}