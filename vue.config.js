// module.exports = {
//     devServer: {
//       proxy: {
//         '/api': {
//           target: 'http://192.168.188.92:5000',
//           changeOrigin: true, // 必须设置为true，否则无法改变请求的origin
//           pathRewrite: { '^/api': '' }, // 重写路径，去掉'/api'前缀
//           ws: true, // 如果需要支持WebSocket
//           secure: false // 如果你的目标服务器使用的是HTTP而不是HTTPS
//         },
//       },
//     },
//   };