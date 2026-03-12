import { Category } from '@prisma/client'

export function classifyCommit(message: string): Category | null {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.startsWith('feat:') || lowerMessage.startsWith('feature:')) {
    return Category.FEATURE
  }
  if (lowerMessage.startsWith('fix:')) {
    return Category.FIX
  }
  if (lowerMessage.startsWith('perf:') || lowerMessage.startsWith('performance:')) {
    return Category.PERFORMANCE
  }
  if (lowerMessage.startsWith('docs:') || lowerMessage.startsWith('doc:')) {
    return Category.DOCS
  }
  if (lowerMessage.startsWith('refactor:')) {
    return Category.REFACTOR
  }
  if (lowerMessage.startsWith('chore:')) {
    return Category.CHORE
  }
  
  return null
}
