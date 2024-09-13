import { session } from '@/app/libs/session'
import { redirect } from 'next/navigation'

export async function GET() {
  await session().destroy()
  redirect('/?logged-out=1')
}
