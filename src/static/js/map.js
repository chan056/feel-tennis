// 百度地图API功能

var map = new BMap.Map("allmap",{minZoom:4,maxZoom:15});
map.enableScrollWheelZoom();
var point = new BMap.Point(120.21937542,30.25924446);
map.centerAndZoom(point,12);// level 12

var geolocation = new BMap.Geolocation();
geolocation.getCurrentPosition(function(r){
    if(this.getStatus() == BMAP_STATUS_SUCCESS){
        map.panTo(r.point);// 跳转

        // 图标
        var myIcon = new BMap.Icon("/img/star/safin.jpg", new BMap.Size(50,68));

        // 图片marker
        var mk = new BMap.Marker(r.point, {icon: myIcon});
        map.addOverlay(mk, {
            displayOnMinLevel: 10,
            displayOnMaxLevel: 14
        });

        // marker详细信息
        let starInfo = ['萨芬', '3.0', '6胜2负'];

        var label = new BMap.Label(starInfo.join('<br/>'), {
            position : r.point,    // 指定文本标注所在的地理位置
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

        // 控件
        // 定位控件
        var geolocationControl = new BMap.GeolocationControl();
        map.addControl(geolocationControl);

        // 全景控件
        var stCtrl = new BMap.PanoramaControl(); 
        stCtrl.setOffset(new BMap.Size(20, 20));
        map.addControl(stCtrl);

        //创建右键菜单
        var markerMenu=new BMap.ContextMenu();
        markerMenu.addItem(new BMap.MenuItem('交战',function(e,ee,marker){
            map.removeOverlay(marker);
        }.bind(mk)));

        mk.addContextMenu(markerMenu);
    } else {
        alert('failed'+this.getStatus());
    }
},{enableHighAccuracy: true})

