var temp = {
    // header: `
    //     <div>I'm header!!!</div>
    // `,

    // footer: `
    //     <div>I'm footer!!!</div>
    // `,
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
                    <router-link :to="{path: '/albums/'+ album.album_id }">{{ album.album_name }}</router-link> 
                </li>
            </ol>
        </div>
    `,
    album: `
        <div>
            <h2>Feel Tennis</h2>
            <ul class="list">
                <li v-for="video in albumVideoList">
                    <router-link :to="{path: '/videos/'+ video.album_video_id }">{{ video.headline }}</router-link>
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
     `
}