(function(){
    if(!BMap)
        return;
    // 百度地图API功能
    var map = new BMap.Map("baidu-map"/* ,{minZoom:1,maxZoom:15} */);
    map.enableScrollWheelZoom();
    map.setDefaultCursor("url('bird.cur')");

    // ==控件==
    // 定位控件
    // var geolocationControl = new BMap.GeolocationControl();
    // map.addControl(geolocationControl);

    // 全景控件
    var stCtrl = new BMap.PanoramaControl(); 
    stCtrl.setOffset(new BMap.Size(20, 20));
    map.addControl(stCtrl);

    var lastQueryCity = '';

    (new BMap.LocalCity({
        renderOptions: {map: map}
    })).get(function(city){
        fetchCityPlayerDetail(city.name);
    });
    
    // ==========EVENT============
    /*var myDis = new BMapLib.DistanceTool(map);
    map.addEventListener("load",function(){
        myDis.open();  //开启鼠标测距
        //myDis.close();  //关闭鼠标测距大
    });*/
    var criticalZoom = 10;

    map.addEventListener('zoomend', function(){
        var target = arguments[0]['currentTarget'];
        var zoomStart = target.Lc,
            zoomEnd = target.Oa;
        
        if(zoomStart > criticalZoom && zoomEnd <= criticalZoom){
            fetchCityPlayer();
        }else if(zoomStart <= criticalZoom && zoomEnd > criticalZoom){//放大
            fetchCityPlayerDetail(lastQueryCity);
        }
    });
    
    //map.addEventListener("tilesloaded",function(){alert("地图加载完毕");});

    var geoc = new BMap.Geocoder();
    
    map.addEventListener("click", function(e){        
        var pt = e.point;
        // console.log(pt);

        geoc.getLocation(pt, function(rs){
            var addComp = rs.addressComponents;
            var city = addComp.city;// 中文
            if(city != lastQueryCity){
                fetchCityPlayerDetail(city);
            }
        });        
    });

    window.refreshMapPlayer = function(){
        if(map.getZoom() < criticalZoom){
            fetchCityPlayer();
        }else{
            fetchCityPlayerDetail(lastQueryCity);
        }
    }

    // 详细情况
    function fetchCityPlayerDetail(city){
        if(!city){
            return;
        }

        removeAllOverlay();

        var imgLoader = $('#img-loader');
        tools.xhr('/sameCityPlayer/' + city, function(res){
            lastQueryCity = city;
            imgLoader.empty();

            res.forEach(function(usr){
                
                var playerInfo = [
                    usr.nickname, 
                    usr.level, 
                    `${usr.win}胜${usr.lose}负${usr.tie}平`,
                ];

                if(usr.like + usr.unlike){
                    var feedback = (usr.like / (usr.like + usr.unlike)*100).toFixed(2) + '%';
                    playerInfo.push(`好评率${feedback}`)
                }

                if(usr.isBlack){
                    playerInfo.unshift('<黑名单玩家>')
                }

                var avatar = usr.avatar;
                var sex = usr.sex;
                if(!avatar){
                    avatar = ['/img/avatar/default/male.png', '/img/avatar/default/female.png'][sex-1];
                }

                var randomId = usr.level + Math.random();
                randomId = randomId.replace(/\./g, '');
                imgLoader.append('<img src='+avatar+' id='+randomId+' onload="console.log(this)"/>');
                
                $('#'+ randomId)[0].onload = function(){
                    // console.log(this.width, this.height);
                    var avatarIcon = new BMap.Icon(avatar, new BMap.Size(this.width,this.height));

                    var lastLoginCoords = usr.last_login_coords;
                    if(! lastLoginCoords)
                        return;

                    lastLoginCoords = lastLoginCoords.split(',');

                    var coords = {lng: lastLoginCoords[0], lat: lastLoginCoords[1]};
            
                    var mk = new BMap.Marker(coords, {
                        icon: avatarIcon, 
                        title: '编号：'+ usr.usr_id
                        // enableDragging//允许拖拽
                    });

                    map.addOverlay(mk);

                    usr.is_self && mk.setAnimation(BMAP_ANIMATION_BOUNCE); // 跳动 //BMAP_ANIMATION_DROP
            
                    var label = new BMap.Label(playerInfo.join('<br/>'), {
                        position : coords,
                        offset   : new BMap.Size(0, 0)
                    });
            
                    label.setStyle({
                        fontSize : "12px",
                        lineHeight : "20px",
                        fontFamily:"微软雅黑",
                        transform: "translate(-50%, -50%)",
                        borderColor: "#000"
                    });
            
                    mk.addEventListener("click", function(){
                        map.removeOverlay(label); 
                        map.addOverlay(label); 
                    });
            
                    mk.addEventListener("mouseover", function(){
                        map.removeOverlay(label); 
                        map.addOverlay(label); 
                    });
            
                    mk.addEventListener("mouseout", function(){
                        map.removeOverlay(label); 
                    });
            
                    var markerMenu = new BMap.ContextMenu();
                    
                    // 绑定菜单
                    if(!usr.is_self){
                        var matchingUsrIds = collectMatchingUsrs();
                        if(matchingUsrIds.indexOf(usr.usr_id) == -1){// 非交战
                            if(usr.status == 1 ){// 接受交战
                                var menu = new BMap.MenuItem('交战',function(e,ee,marker){
                                    if(usr.isBlack){
                                        Vue.prototype.$confirm('该玩家在您的黑名单', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',// 取消黑名单todo
                                            type: 'warning'
                                        }).then(function(){
                                            window.foundMatch(usr.usr_id);
                                        });
                                    }else{
                                        window.foundMatch(usr.usr_id);
                                    }
                                }.bind(mk));
                                markerMenu.addItem(menu);
                            }
                        }
                    }
                    
                    mk.addContextMenu(markerMenu);
                };
            });
        });
    }

    // 概况
    function fetchCityPlayer(){
        removeAllOverlay();
        tools.xhr('/cityPlayer', function(res){
            res.forEach(function(){
                city = arguments[0].city;
                amount = arguments[0].player_amount;

                //coords
                geoc.getPoint(city, function(point){
                    console.log(point)
                    // var mk = new BMap.Marker(point);
                    // map.addOverlay(mk);

                    var label = new BMap.Label("总人数：" + amount, {
                        position : point,
                        offset   : new BMap.Size(0, 0)
                    });

                    label.setStyle({
                        color : "#333",
                        fontSize : "14px",
                        padding: "10px",
                        fontFamily:"微软雅黑",
                        transform: "translate(-50%, -50%)",
                    });

                    label.addEventListener("click", function(){
                        map.centerAndZoom(city);
                    });

                    map.addOverlay(label);
                });
            });
        })
    }

    function removeAllOverlay(){
        var overlays = map.getOverlays();
        for (var i = 0; i < overlays.length; i++){
            map.removeOverlay(overlays[i]);
        }
    }

    function collectMatchingUsrs(){
        var matches = window.matches;
        // console.log(matches)
        var usrs = [];
    
        matches.forEach(function(match){
            if(match.offensive){
                usrs.push(match.defense);
            }else if(match.defensive){
                usrs.push(match.offense);
            }
        });
    
        return usrs;
    }

})();



/*function getCurPos(fn){
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            console.log(r);
            fn(r.point);
        } else {
            alert('failed'+this.getStatus());
        }
    },{enableHighAccuracy: true})
}*/


// function getCurPos(fn){
//     // 获取坐标
//     var CURPOS = window.CURPOS;
//     if(CURPOS){
//         fn && fn();
//     }else{
//         setTimeout(function(){
//             getCurPos(fn);
//         }, 2000);
//     }
// }


/*getCurPos( function(){
    var pos = {lng: CURPOS.longitude, lat: CURPOS.latitude};
    var point = new BMap.Point(CURPOS.longitude, CURPOS.latitude);
    map.centerAndZoom(point,12);
    map.panTo(pos);// 跳转

    fetchCityPlayerDetail();
    lastQueryCity = CURPOS.city;
});*/