import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './index.css'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export default function App() {
  const [articles, setArticles] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    axios.get(`${API}/articles`).then(res => setArticles(res.data.data || res.data)).catch(console.error)
  }, [])

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Articles</h2>
        <ul>
          {articles.map(a => (
            <li key={a.id} onClick={() => setSelected(a)}>
              <strong>{a.title}</strong>
              <div className="meta">{new Date(a.published_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </aside>
      <main className="content">
        {selected ? (
          <article>
            <h1>{selected.title}</h1>
            <section>
              <h3>Original</h3>
              <div className="body">{selected.content_original}</div>
            </section>
            <section>
              <h3>Updated</h3>
              <div className="body" dangerouslySetInnerHTML={{ __html: selected.content_updated || '<i>No updated version</i>' }} />
            </section>
          </article>
        ) : (
          <div className="placeholder">Select an article to view</div>
        )}
      </main>
    </div>
  )
}
