import { nylas, nylasConfig } from '@/app/libs/nylas'
import { NextApiRequest } from 'next'
import { session } from '@/app/libs/session'
import { redirect } from 'next/navigation'

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
  await session().set('grantId', grantId)
  await session().set('email', email)
  console.log('code', code)
  // console.log('exchanecode', response)
  redirect('/')
}
