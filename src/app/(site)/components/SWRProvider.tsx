// components/SWRProvider.tsx
'use client'

import { ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { fetcher } from '../../utils/fetcher'

interface SWRProviderProps {
  children: ReactNode
}

const SWRProvider: React.FC<SWRProviderProps> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        onError: (error: any) => {
          console.log(error)
        },
      }}>
      {children}
    </SWRConfig>
  )
}

export default SWRProvider
