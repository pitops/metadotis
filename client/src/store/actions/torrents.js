// add torrent
function addTorrent(hash) {
  return {
    type: 'ADD_TORRENT',
    hash
  };
}

function getTorrentList(torrents) {
  return {
    type: 'GET_TORRENT_LIST',
    torrents
  };
}
