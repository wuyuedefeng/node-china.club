var config = {
    // debug 为 true 时，用于本地调试
    debug: true,

    // 程序运行的端口
    port: 3000,

    session: {
        name: 'session', //客户端cookie中显示字段名称
        keys: ['node-china.club']
    },

    // mongodb 配置
    db: 'mongodb://127.0.0.1/node_club_dev',

    // redis 配置，默认是本地
    redis: {
        host: '127.0.0.1',
        port: 6379
    },

    // 邮箱配置
    mail_opts: {
        host: 'smtp.126.com',
        port: 25,
        auth: {
            user: 'club@126.com',
            pass: 'club'
        }
    }
};

module.exports = config;