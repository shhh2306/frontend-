import { useState } from 'react';
import './App.css';

function App() {
  const [activeFolder, setActiveFolder] = useState('Inbox');
  const [showCompose, setShowCompose] = useState(false);

  const [form, setForm] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  // Replace this with your EC2 Public IPv4 address
  const API_URL = 'http://YOUR_EC2_PUBLIC_IP:5000';

  const folders = [
    'Inbox',
    'Starred',
    'Sent',
    'Drafts',
    'Spam',
    'Trash'
  ];

  const handleSend = async (e) => {
    e.preventDefault();
    setStatus('Sending email...');

    try {
      const response = await fetch(`${API_URL}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (data.success) {
        setStatus('Email sent successfully!');
        setForm({
          to: '',
          cc: '',
          bcc: '',
          subject: '',
          message: ''
        });
        setTimeout(() => {
          setShowCompose(false);
          setStatus('');
        }, 1500);
      } else {
        setStatus(data.message || 'Email sending failed');
      }

    } catch (error) {
      setStatus('Unable to connect to backend server.');
    }
  };

  return (
    <div className="app">

      <header className="header">
        <h2>✉ MailSpace</h2>

        <input
          type="text"
          placeholder="Search your emails..."
          className="search"
        />

        <div className="profile">U</div>
      </header>

      <div className="layout">

        <aside className="sidebar">

          <button
            className="compose-btn"
            onClick={() => setShowCompose(true)}
          >
            + Compose
          </button>

          <div className="folders">
            {folders.map((folder) => (
              <button
                key={folder}
                className={
                  activeFolder === folder ? 'active' : ''
                }
                onClick={() => setActiveFolder(folder)}
              >
                {folder}
              </button>
            ))}
          </div>

        </aside>

        <main className="main">

          <h2>{activeFolder}</h2>

          <div className="empty-state">
            <div className="mail-icon">✉</div>
            <h3>No emails here yet</h3>
            <p>Your {activeFolder.toLowerCase()} will appear here.</p>

            {activeFolder === 'Inbox' && (
              <p>Compose a new email to get started.</p>
            )}
          </div>

        </main>

      </div>

      {showCompose && (

        <div className="compose-window">

          <div className="compose-header">
            <h3>New Message</h3>

            <button onClick={() => setShowCompose(false)}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSend}>

            <input
              type="email"
              placeholder="To"
              value={form.to}
              onChange={(e) =>
                setForm({ ...form, to: e.target.value })
              }
              required
            />

            <input
              type="text"
              placeholder="CC"
              value={form.cc}
              onChange={(e) =>
                setForm({ ...form, cc: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="BCC"
              value={form.bcc}
              onChange={(e) =>
                setForm({ ...form, bcc: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
              required
            />

            <textarea
              placeholder="Write your message..."
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              required
            />

            {status && <p className="status">{status}</p>}

            <button type="submit" className="send-btn">
              Send Email
            </button>

          </form>

        </div>

      )}

    </div>
  );
}

export default App;