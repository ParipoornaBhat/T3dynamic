'use client'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function FlashToast() {
  useEffect(() => {
    const err = document.cookie.match(/flash_error=([^;]+)/)
    const suc = document.cookie.match(/flash_success=([^;]+)/)
    const errorRaw = err?.[1]  // TypeScript knows this is a string
    const successRaw = suc?.[1]

    if (errorRaw) {
      const message = decodeURIComponent(errorRaw)
      toast.error(message, { duration: 3000 })
      document.cookie = 'flash_error=; max-age=0; path=/'
    }

    if (successRaw) {
      const message = decodeURIComponent(successRaw)
      toast.success(message, { duration: 3000 })
      document.cookie = 'flash_success=; max-age=0; path=/'
    }
  }, [])

  return null
}
