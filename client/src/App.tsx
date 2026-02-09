import { useEffect, useMemo, useState } from 'react'

const parseFacts = (text: string) => {
  const regex = /<year>(.*?)<\/year>\s*<fact>(.*?)<\/fact>/gs
  const matches = [...text.matchAll(regex)]

  return matches.map((match) => {
    const year = match[1]
    const fact = match[2]
    return {
      id: `${year}-${fact.slice(0, 20).replace(/\s+/g, '')}`,
      year,
      fact,
    }
  })
}

const serverURL = import.meta.env.VITE_SERVER_URL

function App() {
  const [rawText, setRawText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<unknown | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    async function streamFacts() {
      try {
        setIsLoading(true)
        const response = await fetch(`${serverURL}/facts/stream`, { signal })

        if (!response.ok) {
          throw new Error('Failed to fetch facts')
        }

        const body = response.body

        if (!body) {
          return
        }

        const decoder = new TextDecoder()

        for await (const chunk of body) {
          const text = decoder.decode(chunk, { stream: true })
          setRawText((prev) => prev + text)
        }
      } catch (e) {
        if (!signal.aborted) {
          setError(e)
          console.error(
            'Error while fetching: ',
            e instanceof Error ? e.message : 'Unknown error',
          )
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    streamFacts()

    return () => {
      controller.abort()
    }
  }, [])

  const facts = useMemo(() => {
    return parseFacts(rawText)
  }, [rawText])

  return (
    <main>
      <h1>Today In History</h1>
      <p style={{ textDecoration: 'underline' }}>
        <em>
          {new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
          })}
        </em>
      </p>

      <section>
        <h2>Years</h2>
        {isLoading && (
          <p>
            <em>Finding Facts...</em>
          </p>
        )}

        {Boolean(error) && (
          <p>
            {error instanceof Error
              ? error.message
              : 'An unexpected error occurred'}
          </p>
        )}

        <ul aria-busy={isLoading} style={{ listStyle: 'none', padding: 0 }}>
          {facts.map((item) => (
            <li key={item.id}>
              <details>
                <summary role="button">{item.year}</summary>
                <p>{item.fact}</p>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
