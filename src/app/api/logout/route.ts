import { session } from '@/app/libs/session'
import { redirect } from 'next/navigation'

export async function GET() {
  await session().destroy()
  const email = await session().get('email')
  console.log('LOGGED OUT', email)
  redirect('/?logged-out=1')
}
