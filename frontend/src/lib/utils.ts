import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import hljs from 'highlight.js'
import createDOMPurify from 'dompurify'
import { BlockType } from '@/lib/api'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DOMPurify = typeof window !== 'undefined' ? createDOMPurify(window) : null

export function highlightCode(code: string, language: string | null): string {
  try {
    return hljs.highlight(code, { language: language ?? 'plaintext' }).value
  } catch {
    return hljs.highlightAuto(code).value
  }
}

export interface BlockDraft {
  blockId: string
  type: BlockType
  content: string
  codeLanguage: string
  imageUrl: string
}

export const codeLanguages = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'bash', label: 'Bash' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'java', label: 'Java' },
  { value: 'yaml', label: 'YAML' },
]

export function parseContent(value: string) {
  if (!value) {
    return null
  }
  try {
    return JSON.parse(value)
  } catch {
    return {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: value }] }],
    }
  }
}
