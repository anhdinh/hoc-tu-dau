import { Link } from 'react-router-dom'

const dummyMessages = [
  { id: 1, title: 'Welcome to the system', author: 'Admin' },
  { id: 2, title: 'Meeting reminder', author: 'Alice' },
  { id: 3, title: 'Report Q2', author: 'Bob' },
]

export default function MessagesList() {
  return (
    <div>
      <h2>Messages</h2>
      <ul>
        {dummyMessages.map((msg) => (
          <li key={msg.id} style={{ marginBottom: 8 }}>
            <strong>{msg.title}</strong> — {msg.author}
            <Link to="/messages/edit" style={{ marginLeft: 12, fontSize: 13 }}>
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
