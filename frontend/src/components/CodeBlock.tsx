'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Code, Copy, Check } from 'lucide-react'
import { highlightCode, DOMPurify } from '@/lib/utils'

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
    <div className="relative group/code">
      <div className="absolute top-2.5 right-3 flex items-center gap-2 z-10">
        <Code size={13} className="text-muted-foreground/50" />
        <Button variant="secondary" size="icon" aria-label="Copy code" onClick={handleCopy}>
          {copied ? <Check /> : <Copy />}
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
