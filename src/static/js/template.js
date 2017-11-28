var temp = {
    sports: `
        <div id="album-list">
            <ol>
                <li v-for="sport in sports">
                    <router-link :to="{path: '/sports/'+ sport.id }">{{ sport.name }}</router-link> 
                </li>
            </ol>
        </div>
    `,
    albumList: `
        <div id="album-list">
            <ol>
                <li v-for="album in albumList">
                    <router-link :to="{path: '/albums/'+ album.id }">{{ album.name }}</router-link> 
                </li>
            </ol>
        </div>
    `,
    album: `
        <div>
            <h2>Feel Tennis</h2>
            <ul class="list">
                <li v-for="video in albumVideoList">
                    <router-link :to="{path: '/videos/'+ video.album_id }">{{ video.headline }}</router-link>
                </li>
            </ul>
        </div>
    `
    ,
    video: `
        <div>
            <h2>{{video.headline}}</h2>
            <video v-bind:src="src" controls="controls" >
                Not support this browser, please use Chrome.
            </video>
        </div>
     `,

     upload: `
        <div>
            <h2>视频上传页面</h2>
            <el-select v-model="SO.albumId" clearable placeholder="请选择">
                <el-option
                    v-for="item in albums"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-button v-on:click="alert" >默认按钮</el-button>
        </div>
     `
     
}