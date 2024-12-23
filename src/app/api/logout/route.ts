// import { session } from '@/app/libs/session'
import { redirect } from 'next/navigation'
import { sessionOptions } from '../../libs/session'
import { getIronSession } from 'iron-session'
import { SessionData } from 'next-app-session/dist/types'
import { cookies } from 'next/headers'
export async function GET() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  )
  session.destroy()
  return redirect('/?logged-out=1')
}
