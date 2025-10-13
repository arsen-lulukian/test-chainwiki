import 'highlight.js/styles/atom-one-dark.css'
import md5 from 'md5'
import React from 'react'
import prod from 'react/jsx-runtime'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import rehypeReact from 'rehype-react'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
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
    .use(rehypeReact, {
      Fragment: prod.Fragment,
      jsx: prod.jsx,
      jsxs: prod.jsxs,
      components: {
        a: (props: any) => {
          const { href, children, ...rest } = props
          const isRelative = href?.startsWith('/')
          return (
            <a
              {...rest}
              {...(isRelative
                ? { href }
                : { target: '_blank', rel: 'noopener noreferrer' })}
            >
              {children}
            </a>
          )
        },
      },
    })

  const file = processor.processSync(markdown)

  return <div className='prose max-w-none'>{file.result}</div>
}

export default MarkdownRendererServer
