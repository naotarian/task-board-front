import * as React from 'react'
import { cn } from '@/lib/utils'

type TypographyProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  children: React.ReactNode
  className?: string
  muted?: boolean
}

const variants = {
  h1: 'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  p: 'leading-7 [&:not(:first-child)]:mt-4',
  span: '',
}

const mutedClass = 'text-muted-foreground'

function Typography({ as = 'p', children, className, muted = false }: TypographyProps) {
  const Component = as
  return (
    <Component className={cn(variants[as], muted && mutedClass, className)}>{children}</Component>
  )
}

export { Typography }
