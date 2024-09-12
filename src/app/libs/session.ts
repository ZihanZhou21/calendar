import nextAppSession from 'next-app-session'

type NySessionData = {
  grantId?: string
  email?: string
}

export const session = nextAppSession<NySessionData>({
  name: 'calendix_session',
  secret: process.env.SECRET,
})
