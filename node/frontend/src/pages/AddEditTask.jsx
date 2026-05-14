import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { fetchAPI } from '../api';

export default function AddEditTask() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [category, setCategory] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(!!taskId);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (taskId) {
      loadTask(taskId);
    }
  }, [taskId]);

  const loadTask = async (id) => {
    try {
      const data = await fetchAPI('/task/get');
      const tasks = data.tasks || [];
      const task = tasks.find(t => String(t.id) === String(id));
      
      if (task) {
        setTitle(task.task_title || '');
        setDescription(task.description || '');
        if (task.due_date) {
          setDueDate(new Date(task.due_date).toISOString().split('T')[0]);
        }
        setStatus((task.status || 'pending').toLowerCase());
        setCategory(task.category || '');
      } else {
        setError('Task not found');
        setTimeout(() => navigate('/tasks'), 2000);
      }
    } catch (err) {
      setError('Failed to load task details');
    } finally {
      setInitLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    if (dueDate) {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        setError('Due date cannot be in the past');
        setLoading(false);
        return;
      }
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate ? dueDate : null,
      status: taskId ? status : 'pending',
      category: category.trim() || null
    };

    try {
      if (taskId) {
        await fetchAPI(`/task/update/${taskId}`, {
          method: 'PUT',
          body: JSON.stringify(taskData)
        });
        setSuccess('Task updated successfully');
      } else {
        await fetchAPI('/task/add', {
          method: 'POST',
          body: JSON.stringify(taskData)
        });
        setSuccess('Task created successfully');
      }
      setTimeout(() => {
        navigate('/tasks');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className="page-container">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading task details...</div>
      </div>
    );
  }

  const isEdit = !!taskId;

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.25rem' }}>{isEdit ? 'Edit Task' : 'Create Task'}</h2>
        <p className="subtitle">{isEdit ? 'Update your academic assignments and stay on schedule.' : 'Add a new academic assignment to your schedule.'}</p>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="title" className="form-label">Task Title</label>
            <input 
              type="text" 
              id="title" 
              className="form-control" 
              placeholder="e.g., Comparative Analysis Draft" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="category" className="form-label">Category</label>
              <select 
                id="category" 
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Study">Study</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="dueDate" className="form-label">Due Date</label>
              <input 
                type="date" 
                id="dueDate" 
                className="form-control" 
                value={dueDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description" className="form-label">Notes & Description</label>
            <textarea 
              id="description" 
              className="form-control" 
              rows="5" 
              placeholder="Include the peer-reviewed sources from the library database. Focus on the relationship between cellular respiration and ATP synthesis. Aim for 1,500 words."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <Link to="/tasks" className="btn btn-outline" style={{ border: 'none' }}>Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
              {loading ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
      
    </div>
  );
}
