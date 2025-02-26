import Nylas from 'nylas'

if (!process.env.NYLAS_API_KEY) {
  throw new Error('NYLAS_API_KEY environment variable is required')
}

export const nylasConfig = {
  clientId: process.env.NYLAS_CLIENT_ID,
  // callbackUri: 'https://calendar-zh.vercel.app/api/oauth/exchange',
  callbackUri:
    process.env.NODE_ENV === 'production'
      ? 'https://calendar-zh.vercel.app/api/oauth/exchange'
      : 'http://localhost:3000/api/oauth/exchange',
  apiKey: process.env.NYLAS_API_KEY,
  apiUri: process.env.NYLAS_API_URI,
}

export const nylas = new Nylas({
  apiKey: nylasConfig.apiKey,
  apiUri: nylasConfig.apiUri, // "https://api.us.nylas.com" or "https://api.eu.nylas.com"
})
