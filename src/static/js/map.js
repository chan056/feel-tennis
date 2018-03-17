// 百度地图API功能
var map = new BMap.Map("map"/* ,{minZoom:1,maxZoom:15} */);
getCurPos(afterLocation);

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
/*map.addEventListener('zoomend', function(){
    console.log(arguments)
})*/

// ==EVENT==
/*var myDis = new BMapLib.DistanceTool(map);
map.addEventListener("load",function(){
    myDis.open();  //开启鼠标测距
    //myDis.close();  //关闭鼠标测距大
});*/

var geoc = new BMap.Geocoder();
var lastQueryCity = '';
map.addEventListener("click", function(e){        
    var pt = e.point;
    geoc.getLocation(pt, function(rs){
        var addComp = rs.addressComponents;
        var city = addComp.city;
        if(city != lastQueryCity){

        }
        tools.xhr('/sameCityPlayer/' + city, function(res){
            console.log(res);
            // 绘制除了自己之外的其他marker
        });
        lastQueryCity = city;
    });        
});
var x = (new BMap.LocalCity()).get();
console.log(x)

function afterLocation(pos){
    // map.panTo(pos);// 跳转
    var point = new BMap.Point(pos.lng, pos.lat);
    map.centerAndZoom(point,12);
    
    // 图标
    var myIcon = new BMap.Icon("/img/star/safin.jpg", new BMap.Size(50,68));

    // 图片marker
    var mk = new BMap.Marker(pos, {icon: myIcon});
    map.addOverlay(mk/*, {
        displayOnMinLevel: 10,
        displayOnMaxLevel: 14
    }*/);
    // mk.setAnimation(BMAP_ANIMATION_BOUNCE); // 跳动
    // marker创建右键菜单
    var markerMenu=new BMap.ContextMenu();
    markerMenu.addItem(new BMap.MenuItem('交战',function(e,ee,marker){
        map.removeOverlay(marker);
    }.bind(mk)));

    mk.addContextMenu(markerMenu);

    // marker详细信息
    let starInfo = ['萨芬', '3.0', '6胜2负'];

    var label = new BMap.Label(starInfo.join('<br/>'), {
        position : pos,    // 指定文本标注所在的地理位置
        offset   : new BMap.Size(0, 0)    //设置文本偏移量
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
    // $.getJSON('//freegeoip.net/json/?callback=?', function(data) {
        var CURPOS = window.CURPOS;
        if(CURPOS){
            var coord = {lng: CURPOS.longitude, lat: CURPOS.latitude};
            fn && fn(coord);
        }else{
            setTimeout(function(){
                getCurPos(fn);
            }, 2000);
        }
    // });
}