import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  
import { useParams } from 'react-router-dom';

const NewTaskPage = () => {
  // Redirect to login page if no token is found in local storage
  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
  }

  const { listId } = useParams();  // Extracts listId from URL parameters
  const [nextId, setNextId] = useState(10000000);  // State to hold the next task ID
  const [numSub, setNumSub] = useState(1);  // Counter for creating unique subtask IDs

  useEffect(() => {
    const getNextTaskId = async () => {
      try {
        // Fetch the next task ID from the server
        const response = await fetch('http://127.0.0.1:5000/next-id', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setNextId(data.next_id);  // Set the next ID to the value from the server
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        console.error('Failed to fetch nextId:', error);
      }
    };

    getNextTaskId();  // Call function to fetch the next ID on component mount
  }, []);

  let tempId = 100000000;  // Temporary ID base for sub-subtasks
  // Initial state for tasks, with a main task, subtask, and sub-subtask
  const [tasks, setTasks] = useState([
    { id: nextId, title: '', subtasks: [{ id: nextId + 1, title: '', subsubtasks: [{ id: tempId, title: '' }] }] },
  ]);

  // Function to retrieve the current user ID by decoding the token
  const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);  // Decode the JWT token
      return decodedToken.sub.identity;  // Return the user ID from the token payload
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();  // Prevent default form submission
    const userId = getCurrentUserId();  // Get current user ID

    // Function to collect and order tasks into main, sub, and sub-subtasks
    function collectAndOrderTasks(tasks, userId) {
      let mainTasks = [];
      let subTasks = [];
      let subSubTasks = [];

      // Iterate over tasks to separate main tasks, subtasks, and sub-subtasks
      tasks.forEach(task => {
        mainTasks.push({ ...task, list_id: listId, parent_id: null, user_id: userId });

        let i = 1;  // Counter for subtask indexing
        task.subtasks.forEach(subtask => {
          subTasks.push({ ...subtask, list_id: listId, parent_id: nextId, user_id: userId });

          // Collect sub-subtasks under each subtask
          subtask.subsubtasks.forEach(subsubtask => {
            subSubTasks.push({ ...subsubtask, list_id: listId, parent_id: nextId + i, user_id: userId });
          });
          i = i + 1;
        });
      });

      // Combine main tasks, subtasks, and sub-subtasks in the desired order
      return [...mainTasks, ...subTasks, ...subSubTasks];
    }

    const flattenedTasks = collectAndOrderTasks(tasks, userId);  // Flatten tasks for submission

    try {
      // Submit the flattened tasks to the server
      const response = await fetch('http://127.0.0.1:5000/new-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flattenedTasks),
      });

      if (!response.ok) throw new Error('Network response was not ok.');
      console.log('Tasks successfully submitted:', await response.json());
      window.location.href = '/';  // Redirect to the dashboard on success
    } catch (error) {
      console.error('Error submitting tasks:', error);
    }
  };

  // Function to add a new subtask or sub-subtask based on the provided task/subtask ID
  const addSubTask = (taskId, subtaskId = null) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (subtaskId === null) {
          const newSubtaskId = tempId + numSub;  // Generate a new subtask ID
          task.subtasks.push({ id: newSubtaskId, title: '', subsubtasks: [] });
          setNumSub(numSub + 1);  // Increment subtask counter
        } else {
          task.subtasks.forEach(subtask => {
            if (subtask.id === subtaskId) {
              const newsubsubtaskid = tempId + numSub;  // Generate a new sub-subtask ID
              subtask.subsubtasks.push({ id: newsubsubtaskid, title: '' });
              setNumSub(numSub + 1);  // Increment subtask counter
            }
          });
        }
      }
      return task;  // Return the updated task
    }));
  };

  // Function to handle changes in task titles for main tasks, subtasks, and sub-subtasks
  const handleTaskChange = (taskId, subtaskId, subsubtaskId, value) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (subtaskId === null) {
          task.title = value;  // Update main task title
        } else {
          task.subtasks.forEach(subtask => {
            if (subtask.id === subtaskId) {
              if (subsubtaskId === null) {
                subtask.title = value;  // Update subtask title
              } else {
                subtask.subsubtasks.forEach(subsubtask => {
                  if (subsubtask.id === subsubtaskId) {
                    subsubtask.title = value;  // Update sub-subtask title
                  }
                });
              }
            }
          });
        }
      }
      return task;
    }));
  };

  return (
    <div className="new-task-page">
      <form onSubmit={handleSubmit} className='Login'>
        <h2>New Task</h2>
        {tasks.map((task, taskIndex) => (
          <div key={task.id}>
            <input
              type="text"
              name={`title-${task.id}`}
              placeholder="Title"
              value={task.title}
              onChange={(e) => handleTaskChange(task.id, null, null, e.target.value)}
            />
            <button type="button" onClick={() => addSubTask(task.id)}>Add Subtask</button>

            {task.subtasks.map((subtask) => (
              <div key={subtask.id}>
                <input
                  type="text"
                  name={`title-${subtask.id}`}
                  placeholder="Subtask Title"
                  value={subtask.title}
                  onChange={(e) => handleTaskChange(task.id, subtask.id, null, e.target.value)}
                />
                <button type="button" onClick={() => addSubTask(task.id, subtask.id)}>Add Sub-Subtask</button>

                {subtask.subsubtasks.map((subsubtask) => (
                  <input
                    key={subsubtask.id}
                    type="text"
                    name={`title-${subsubtask.id}`}
                    placeholder="Sub-Subtask Title"
                    value={subsubtask.title}
                    onChange={(e) => handleTaskChange(task.id, subtask.id, subsubtask.id, e.target.value)}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default NewTaskPage;
