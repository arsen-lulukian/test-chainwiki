import 'highlight.js/styles/atom-one-dark.css'
import md5 from 'md5'
import React from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'

interface MarkdownRendererServerProps {
  markdown: string
  fullTokenId?: string
}

const MarkdownRendererServer = async ({
  markdown,
  fullTokenId,
}: MarkdownRendererServerProps) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(() => (tree: any) => {
      visit(tree, (node: any) => {
        if (
          node.type === 'paragraph' ||
          node.type === 'heading' ||
          node.type === 'listItem' ||
          node.type === 'table'
        ) {
          const texts: string[] = []
          visit(node, 'text', (textNode: any) => {
            if (textNode.value) texts.push(String(textNode.value))
          })
          const textContent = texts.join(' ').trim()
          if (textContent && fullTokenId) {
            const id = `${fullTokenId}-${node.type}-${md5(textContent)}`
            node.data = node.data || {}
            node.data.hProperties = {
              ...(node.data.hProperties || {}),
              id,
            }
          }
        }
      })
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeStringify) // <-- Генерируем чистый HTML

  const file = await processor.process(markdown)

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: String(file) }}
    />
  )
}

export default MarkdownRendererServer
