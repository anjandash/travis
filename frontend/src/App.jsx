import { useState, useEffect } from 'react'
import './App.css'

import AudioRecorder from './components/AudioRecorder';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}posts`);
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="MainWrapper">
        <h2>Mooovex TRAVIS</h2>
        <hr />

        {/* <div className="PostsWrapper" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '50px',
          overflow: 'scroll',
        }}>
          {data.map((post) => (
            <div key={post.id} className="Post">
              <p>{post.title}</p>
            </div>
          ))}
        </div>


        <hr /> */}

        <AudioRecorder />
      </div>
    </>
  )
}

export default App
