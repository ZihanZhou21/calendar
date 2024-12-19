// Route to initialize authentication

import { nylas, nylasConfig } from '../../libs/nylas'
import { redirect } from 'next/navigation'
export async function GET() {
  // Route to initialize authentication
  if (!nylasConfig.clientId || !nylasConfig.callbackUri) {
    throw new Error('Missing required Nylas configuration')
  }

  const authUrl = nylas.auth.urlForOAuth2({
    clientId: nylasConfig.clientId,
    redirectUri: nylasConfig.callbackUri,
  })
  return redirect(authUrl)
}
