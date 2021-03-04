import Axios from './index'

export function getPlaylist(uid) {
    return Axios({
        url: `/user/playlist?uid=${uid}&limit=5`,
        method: 'get'
    })
}

export function getPlaylistDetail(id) {
    return Axios({
        url: `/playlist/detail?id=${id}`,
        method: 'get'
    })
}