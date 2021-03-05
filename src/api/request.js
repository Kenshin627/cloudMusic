import Axios from './index'

export function getPlaylist(uid) {
    return Axios({
        url: `/user/playlist?uid=${uid}&limit=11`,
        method: 'get'
    })
}

export function getPlaylistDetail(id) {
    return Axios({
        url: `/playlist/detail?id=${id}`,
        method: 'get'
    })
}

export function getMusicUrl(id) {
    return Axios({
        url: `/song/url?id=${id}`,
        method: 'get'
    })
}