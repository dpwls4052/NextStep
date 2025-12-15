'use client'
import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type SonnerTheme = 'light' | 'dark' | 'system'

const Toaster = ({ ...props }) => {
  const { theme = 'system' } = useTheme()

  const sonnerTheme: SonnerTheme =
    theme === 'light' || theme === 'dark' || theme === 'system'
      ? theme
      : 'system'

  return (
    <Sonner
      theme={sonnerTheme}
      position="top-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:shadow-lg',
          success: '!bg-green-600 !text-white !font-medium',
          warning: '!bg-orange-600 !text-white !font-medium',
          error: '!bg-red-600 !text-white !font-medium',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
