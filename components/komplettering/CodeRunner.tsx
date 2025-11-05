import { Play } from 'lucide-react'
import PulsingBall from './PulsingBall'

const blue = ['await', 'fetch', 'console', 'response', 'css']
const red = ['await', 'const', '=']
const purple = ['log', 'text']

function highlightSimple(code: string) {
  // Delar upp på mellanslag, parenteser, punkter och semikolon
  const tokens = code.split(/(\s+|[().;])/)

  return tokens.map((token, i) => {
    if (!token) return null
    // Behåll mellanslag, paranteser, punkter och semikolon utan ändring
    if (/^\s+$/.test(token) || /^[().;]$/.test(token)) {
      return token
    }
    let style: React.CSSProperties | undefined

    // Färglägg
    if (red.includes(token)) {
      style = { color: '#f87171' }
    } else if (blue.includes(token)) {
      style = { color: '#60a5fa' }
    } else if (purple.includes(token)) {
      style = { color: '#c084fc' }
    }

    if (!style) return token

    return (
      <span key={i} style={style}>
        {token}
      </span>
    )
  })
}

const CodeRunner = ({ code, onRun }: { code: string; onRun: () => void }) => {
  return (
    <div className="relative">
      <div className="absolute top-[-10px] right-[50px]">
        <PulsingBall content="4" />
      </div>
      <div className="my-6 overflow-scroll rounded-2xl border-1 border-zinc-700 p-2">
        <button
          onClick={onRun}
          className="absolute right-4 mb-8 cursor-pointer"
        >
          <div className="pr-2">
            <Play className="mr-1 inline-block h-4 w-4" />
          </div>
        </button>
        <pre className="py-4 text-sm">
          <code>{highlightSimple(code)}</code>
        </pre>
      </div>
    </div>
  )
}

export default CodeRunner
