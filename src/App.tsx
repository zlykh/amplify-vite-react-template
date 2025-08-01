import React from 'react';
import '@aws-amplify/ui-react/styles.css';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Loader, ThemeProvider } from '@aws-amplify/ui-react';

// import awsexports from './aws-exports';

// Amplify.configure(awsexports);

function App() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [createLivenessApiData, setCreateLivenessApiData] = React.useState<{
    sessionId: string;
  } | null>(null);

  const fetchCreateLiveness =  () => {
    /*
     * This should be replaced with a real call to your own backend API
     */
    fetch('https://lkh90ji3c8.execute-api.us-east-1.amazonaws.com/dev/v1/faces/verify/session', {method: 'POST'})
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
      setCreateLivenessApiData({sessionId: data.session_id});
      setLoading(false);
      console.log(`stooooore is ${createLivenessApiData.sessionId}`)
    }) 
    // const data = ( response.json()).session_id;
    // console.log(`new sessionId is ${data}`)


  };

  React.useEffect(() => {
    fetchCreateLiveness();
  }, []);

  const handleAnalysisComplete: () => Promise<void> = async () => {
    /*
     * This should be replaced with a real call to your own backend API
     */
    const response = await fetch(`https://lkh90ji3c8.execute-api.us-east-1.amazonaws.com/dev/v1/faces/verify/session?sessionId=${createLivenessApiData.sessionId}`);
    const data = await response.json();
    console.log(`stored session ${createLivenessApiData.sessionId}`)
    console.log(data);
  };

  // Use a ref to track if we're currently handling an error
  const isHandlingError = React.useRef(false);

  const handleError = async (error) => {
    console.error('Liveness error:', error);
    console.log(`stored session ${createLivenessApiData.sessionId}`)

    // Simple infinite loop prevention
    if (isHandlingError.current) return;
    isHandlingError.current = true;
    setLoading(true);

    // Create a new session for retry - sessions are single-use
    // await fetchCreateLiveness();

    // // Reset error handling flag
    // isHandlingError.current = false;
  };

  return (

    <ThemeProvider>
            {loading ? (
        <Loader />
      ) : (
        <FaceLivenessDetector
          sessionId={createLivenessApiData.sessionId}
          region="us-east-1"
          onAnalysisComplete={handleAnalysisComplete}
          onError={handleError}
        />
      )}
    </ThemeProvider>

  );
}

// import { useEffect, useState } from "react";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";

// const client = generateClient<Schema>();

// function deleteTodo(id: string) {
//     client.models.Todo.delete({ id })
// }

// function App() {
//   const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

//   useEffect(() => {
//     client.models.Todo.observeQuery().subscribe({
//       next: (data) => setTodos([...data.items]),
//     });
//   }, []);

//   function createTodo() {
//     client.models.Todo.create({ content: window.prompt("Todo content") });
//   }

//   return (
//     <main>
//       <h1>My todos</h1>
//       <button onClick={createTodo}>+ new</button>
//       <ul>
//         {todos.map((todo) => (
//           <li 
// 		          onClick={() => deleteTodo(todo.id)}

// key={todo.id}>{todo.content}</li>
//         ))}
//       </ul>
//       <div>
//         🥳 App successfully hosted. Try creating a new todo.
//         <br />
//         <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
//           Review next step of this tutorial.
//         </a>
//       </div>
//     </main>
//   );
// }

export default App;
