
const routerConfig = {
    '/shortcut': 'shortcut',
    '/tennis/rankings/:type': 'tennis/ranking',
    '/tennis/player/:playerId/stat': 'tennis/player_stat',
    '/tennis/player/:playerId/bio': 'tennis/player_bio',
    '/tennis/player/:playerId/gear': 'tennis/player_gear',
    '/tennis/player/:p1/vs/:p2': 'tennis/player_h2h',
}

module.exports = routerConfig;