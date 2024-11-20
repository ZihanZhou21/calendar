import { nylas, nylasConfig } from '@/app/libs/nylas'
import { NextApiRequest } from 'next'
import { sessionOptions } from '@/app/libs/session'
import { redirect } from 'next/navigation'
import { getIronSession } from 'iron-session'

import { cookies } from 'next/headers'
type SessionData = {
  grantId?: string
  email?: string
}
export async function GET(req: NextApiRequest) {
  console.log('Received callback from Nylas')
  // const code = req.query.code
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  if (!code) {
    // res.status(400).send('No authorization code returned from Nylas')
    return Response.json('no authrorization code return form Nylas', {
      status: 400,
    })
  }

  const codeExchangePayload = {
    clientSecret: nylasConfig.apiKey,
    clientId: nylasConfig.clientId,
    redirectUri: nylasConfig.callbackUri,
    code,
  }
  const response = await nylas.auth.exchangeCodeForToken(codeExchangePayload)
  const { grantId, email } = response
  // process.env.NYLAS_GRANT_ID = grantId
  // await session().set('grantId', grantId)
  // await session().set('email', email)
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  )
  session.email = email
  session.grantId = grantId
  await session.save()
  // console.log('session', session)
  // console.log('exchanecode', response)
  redirect('/')
}
