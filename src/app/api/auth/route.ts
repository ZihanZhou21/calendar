// Route to initialize authentication

import { nylas, nylasConfig } from '@/app/libs/nylas'
import { redirect } from 'next/navigation'
export async function GET() {
  // Route to initialize authentication

  const authUrl = nylas.auth.urlForOAuth2({
    clientId: nylasConfig.clientId,
    redirectUri: nylasConfig.callbackUri,
  })
  return redirect(authUrl)
}
