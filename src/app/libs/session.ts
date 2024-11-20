// import nextAppSession from 'next-app-session'
// import withSession from 'next-app-session'
// type NySessionData = {
//   grantId?: string
//   email?: string
// }

// export const session = nextAppSession<NySessionData>({
//   name: 'calendix_session',
//   secret: process.env.SECRET,
// })
// lib/session.js
// lib/session.js
import { SessionOptions } from 'iron-session'

export const sessionOptions: SessionOptions = {
  cookieName: 'calendix_session',
  password: process.env.SECRET, // 至少32个字符的复杂密码
  cookieOptions: {
    secure: true, // 仅在生产环境中使用 secure
  },
}
