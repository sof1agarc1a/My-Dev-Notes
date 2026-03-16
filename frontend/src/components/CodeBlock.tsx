'use client'

import { useState } from 'react'
import hljs from 'highlight.js'
import createDOMPurify from 'dompurify'
import { Button } from '@/components/ui/button'
import { Code, Copy, Check } from 'lucide-react'

const DOMPurify = typeof window !== 'undefined' ? createDOMPurify(window) : null

export const highlightCode = (code: string, language: string | null): string => {
  try {
    return hljs.highlight(code, { language: language ?? 'plaintext' }).value
  } catch {
    return hljs.highlightAuto(code).value
  }
}

interface CodeBlockProps {
  code: string
  codeLanguage: string | null
}

export const CodeBlock = ({ code, codeLanguage }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative mt-6 group/code">
      <div className="absolute top-2.5 right-3 flex items-center gap-2 z-10">
        <Code size={13} className="text-muted-foreground/50" />
        <Button variant="ghost" size="icon" onClick={handleCopy} className="h-9 w-9 rounded-full">
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </Button>
      </div>
      <pre className="rounded-lg overflow-x-auto text-sm leading-6 bg-code-background border border-border">
        <code
          className={`language-${codeLanguage ?? 'plaintext'} hljs`}
          dangerouslySetInnerHTML={{
            __html:
              DOMPurify?.sanitize(highlightCode(code, codeLanguage)) ??
              highlightCode(code, codeLanguage),
          }}
        />
      </pre>
    </div>
  )
}
