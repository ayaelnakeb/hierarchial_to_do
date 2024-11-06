import React, { useState, useEffect } from 'react';

// Task component to display, edit, delete, and move individual tasks.
// Handles both main tasks and subtasks.
const Task = ({ task, onEdit, onDelete, onMoveTask, lists, isTopLevel = true }) => {
    // State to control visibility of subtasks
    const [isVisible, setIsVisible] = useState(false);
    // State to control editing mode
    const [isEditing, setIsEditing] = useState(false);
    // State to store the edited title temporarily
    const [editTitle, setEditTitle] = useState(task.title);
    // State to handle any error messages
    const [errorMessage, setErrorMessage] = useState('');

    // Synchronize editTitle with task.title whenever task.title changes
    useEffect(() => {
        setEditTitle(task.title);
    }, [task.title]);

    // Toggle visibility of subtasks
    const handleToggleVisibility = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        setIsVisible(!isVisible); // Toggle visibility state
    };

    // Enter editing mode
    const handleEdit = () => {
        setIsEditing(true); // Set editing mode to true
    };

    // Delete the task by calling the onDelete function with task ID
    const handleDelete = () => {
        onDelete(task.id); // Call onDelete function passed as a prop
    };

    // Save the edited title and handle errors
    const handleSave = async () => {
        if (editTitle.trim() === '') { // Check if title is empty
            setErrorMessage('Task title cannot be empty.');
            return;
        }

        try {
            await onEdit(task.id, editTitle); // Call onEdit function to save changes
            setIsEditing(false); // Exit editing mode
            setErrorMessage(''); // Clear any error messages
        } catch (error) {
            console.error('Error saving task:', error);
            setErrorMessage('Failed to save the task. Please try again.');
        }
    };

    // Update the editTitle state as the input changes
    const handleChange = (e) => {
        setEditTitle(e.target.value);
    };

    // Move task to a different list based on selected list ID
    const handleMoveTask = (e) => {
        const newListId = e.target.value; // Get new list ID from the dropdown
        if (newListId) {
            onMoveTask(task.id, newListId); // Call onMoveTask function with task ID and new list ID
        }
    };

    // Filter lists to exclude the current list of the task
    const getFilteredLists = () => lists.filter(list => list.id !== task.list_id);

    return (
        <div style={{ cursor: 'pointer', marginBottom: '10px' }}>
            {isEditing ? (
                // Editing mode: display input field and Save/Cancel buttons
                <div className='task'>
                    <input 
                        type="text" 
                        value={editTitle} 
                        onChange={handleChange} 
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }} // Save on pressing Enter
                        autoFocus
                    />
                    {/* Button to save changes */}
                    <button onClick={handleSave}>Save</button>
                    {/* Button to cancel editing */}
                    <button onClick={() => { setIsEditing(false); setEditTitle(task.title); }}>Cancel</button>
                    {/* Display error message if it exists */}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </div>
            ) : (
                // Display mode: show task title, edit/delete buttons, and move dropdown
                <div className='task'>
                    <h5 className='taskName'>
                        {task.title}
                    </h5>
                    {/* Dropdown to move task to another list, only visible if it's a top-level task */}
                    {isTopLevel && (
                        <select onChange={handleMoveTask} defaultValue="">
                            <option value="">Move to</option>
                            {getFilteredLists().map(list => (
                                <option key={list.id} value={list.id}>{list.name}</option>
                            ))}
                        </select>
                    )}

                    {/* Edit button to enter edit mode */}
                    <button
                        onClick={handleEdit}
                        style={{ marginLeft: '10px', color: 'black', backgroundColor: 'rgb(103, 222, 255)' }}
                    >
                        Edit
                    </button>

                    {/* Delete button to remove the task */}
                    <button
                        onClick={handleDelete}
                        style={{ marginLeft: '10px', color: 'black', backgroundColor: '#ffd7d7' }}
                    >
                        Delete
                    </button>

                    {/* Toggle button to show/hide subtasks if available */}
                    {task.sub_items && task.sub_items.length > 0 && (
                        <button onClick={handleToggleVisibility} style={{ marginLeft: '10px' }}>
                            {isVisible ? 'Hide Subtasks' : 'Show Subtasks'}
                        </button>
                    )}
                </div>
            )}

            {/* Recursive rendering of subtasks if they are visible */}
            {isVisible && task.sub_items && task.sub_items.length > 0 && (
                <div className="sub-tasks" style={{ marginLeft: '20px' }}>
                    {task.sub_items.map(subItem => (
                        <Task
                            key={subItem.id} // Unique key for each subtask
                            task={subItem} // Pass subtask data as task prop
                            onEdit={onEdit} // Pass edit function to subtask
                            onDelete={onDelete} // Pass delete function to subtask
                            onMoveTask={onMoveTask} // Pass move function to subtask
                            lists={lists} // Pass list options to subtask
                            isTopLevel={false} // Mark subtask as not top-level
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Task;
