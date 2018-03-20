// 百度地图API功能
var map = new BMap.Map("baidu-map"/* ,{minZoom:1,maxZoom:15} */);
getCurPos( function(){
    var pos = {lng: CURPOS.longitude, lat: CURPOS.latitude};
    var point = new BMap.Point(CURPOS.longitude, CURPOS.latitude);
    map.centerAndZoom(point,12);
    map.panTo(pos);// 跳转

    lastQueryCity = CURPOS.city;
    fetchSameCityPlayer();
});

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

var geoc = new BMap.Geocoder();
var lastQueryCity = '';
map.addEventListener("click", function(e){        
    var pt = e.point;
    console.log(pt);

    geoc.getLocation(pt, function(rs){
        var addComp = rs.addressComponents;
        var city = addComp.city;
        if(city != lastQueryCity){
            fetchSameCityPlayer(city);

            lastQueryCity = city;
        }
    });        
});

function afterLocation(){
    
}

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

function getCurPos(fn){
    // 获取坐标
    var CURPOS = window.CURPOS;
    if(CURPOS){
        fn && fn();
    }else{
        setTimeout(function(){
            getCurPos(fn);
        }, 2000);
    }
}

function fetchSameCityPlayer(city){
    city = city || CURPOS.city;

    tools.xhr('/sameCityPlayer/' + city, function(res){
        res.forEach(function(usr){
            var star = [usr.nickname, usr.level, `${usr.win}胜${usr.lose}负`];
            var avatar = usr.avatar || '/img/star/safin.jpg';

            var randomId = usr.level + Math.random();
            randomId = randomId.replace(/\./g, '');
            $('#img-loader').append('<img src='+avatar+' id='+randomId+' onload="console.log(this)"/>');
            
            $('#'+ randomId)[0].onload = function(){
                console.log(this.width, this.height);
                var avatarIcon = new BMap.Icon(avatar, new BMap.Size(this.width,this.height));

                var lastLoginCoords = usr.last_login_coords;
                if(! lastLoginCoords)
                    return;

                lastLoginCoords = lastLoginCoords.split(',');

                var coords = {lng: lastLoginCoords[0], lat: lastLoginCoords[1]};
        
                var mk = new BMap.Marker(coords, {icon: avatarIcon});
                map.addOverlay(mk);
                // mk.setAnimation(BMAP_ANIMATION_BOUNCE); // 跳动
        
                var label = new BMap.Label(star.join('<br/>'), {
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
        
                // marker创建右键菜单
                var markerMenu = new BMap.ContextMenu();
                markerMenu.addItem(new BMap.MenuItem('交战',function(e,ee,marker){
                    map.removeOverlay(marker);
                }.bind(mk)));
        
                mk.addContextMenu(markerMenu);
            };
        });
    });
}


/*map.addEventListener('zoomend', function(){
    console.log(arguments)
})*/

// ==EVENT==
/*var myDis = new BMapLib.DistanceTool(map);
map.addEventListener("load",function(){
    myDis.open();  //开启鼠标测距
    //myDis.close();  //关闭鼠标测距大
});*/