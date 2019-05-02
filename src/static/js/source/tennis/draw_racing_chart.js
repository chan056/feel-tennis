function drawrRacingChart(tournamentDrawData){
    var bracket1 = $('#bracket-1').width(320 * tournamentDrawData.length),
        bracket2 = $('#bracket-2').width(320 * tournamentDrawData.length);

    var bracket1HTML = '',
        bracket2HTML = '';

    // 每一轮
    tournamentDrawData.forEach(function(data, round){
        // var bracketData1 = data.children[0];// round 列 上半部分
        // var bracketData2 = data.children[1];// round 列 下半部分
        var roundTopHalf = [],
            roundBottomHalf = [];
        
        var parts = data.children.length;
        
        for(let i=0; i < parts; i++){
            if(i < parts/2){
                roundTopHalf = roundTopHalf.concat(data.children[i].children)
            }else{
                roundBottomHalf = roundBottomHalf.concat(data.children[i].children)
            }
        }

        if(data.attributes.round != "Finals"){
            bracket1HTML += constructRound(roundTopHalf);
            bracket2HTML += constructRound(roundBottomHalf);
        }else{
            bracket1HTML += constructRound(roundTopHalf, true);
        }
    })

    bracket1.append(bracket1HTML);
    bracket2.append(bracket2HTML);
}

function constructRound(bracketData, isFinal){
    var s = `<div class="round${isFinal? ' final': ''}">`;

    if(bracketData.length){
        bracketData.forEach(function(players){

            s += constructMatch(players.attributes);

        })
    }
    

    s += '</div>';

    return s;

    function constructMatch(attributes){
        var matchStr = '<div class="match">';

        matchStr += `<div class="player">
            <i class="fl flag flags-${attributes.firstPlayerCountry}"></i>
            <em class="name need-translate standalone">${attributes.firstPlayer}</em>
            <em class="seed">${attributes.firstPlayerSeed}</em>
        </div>`;

        matchStr += `<div class="player">
            <i class="fl flag flags-${attributes.secondlayerCountry}"></i>
            <em class="name need-translate standalone">${attributes.secondPlayer}</em>
            <em class="seed">${attributes.secondPlayerSeed}</em>
        </div>`;

        matchStr += '</div>';

        return matchStr;
    }
}

function clearupDraw(){
    $('.bracket').each(function(i, bracket){
        var rounds = $(bracket).find('.round').not('.final');
        $('.round.final').height(rounds.eq(0).height());

        rounds.forEach(function(r, i){
            if(i){
                r = $(r).height(rounds.eq(0).height());
                var prevRound = r.prev('.round');
                var prevRoundOffset = prevRound.offset().top;

                r.find('.match').each(function(j, match){
                    var offset1 = prevRound.find('.match').eq(2*j).offset();
                    var offset2 = prevRound.find('.match').eq(2*j + 1).offset();

                    // var offsetTop = (offset2 + offset1 - 2 * prevRoundOffset)/2 - 45;
                    if(offset1 && offset2){
                        var offsetTop = (offset2.top + offset2.height - offset1.top) / 2 + (offset1.top - prevRoundOffset) - 45 -16;
                        r.find('.match').eq(j).css('top', offsetTop);
                    }

                    
                });
            }
        })
    })
}