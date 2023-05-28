


import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, connect } from 'react-redux';
import { useState } from 'react';
import './App.css';

// Create a slice with reducer and actions
const computerSlice = createSlice({
  name: 'computers',
  initialState: [
    { id: 1, name: 'Computer 1', ip: '192.168.1.10', enabled: true },
    { id: 2, name: 'Computer 2', ip: '192.168.1.20', enabled: false },
    { id: 3, name: 'Computer 3', ip: '192.168.1.30', enabled: true }
  ],
  reducers: {
    changeName: (state, action) => {
      const { id, newName } = action.payload;
      const computer = state.find((computer) => computer.id === id);
      if (computer) {
        computer.name = newName;
      }
    },
    assignIP: (state, action) => {
      const { id, newIP } = action.payload;
      const computer = state.find((computer) => computer.id === id);
      if (computer) {
        computer.ip = newIP;
      }
    },
    toggleStatus: (state, action) => {
      const { id } = action.payload;
      const computer = state.find((computer) => computer.id === id);
      if (computer) {
        computer.enabled = !computer.enabled;
      }
    },
    submitComputer: (state, action) => {
      const newComputer = action.payload;
      state.push(newComputer);
    }
  }
});

// Extract the reducer and actions from the slice
const { reducer, actions } = computerSlice;
const { changeName, assignIP, toggleStatus, submitComputer } = actions;

// Redux Store
const store = configureStore({ reducer });

// React Component
const ComputerList = ({ computers, onChangeName, onAssignIP, onToggleStatus, onSubmitComputer }) => {
  const [newName, setNewName] = useState('');
  const [newIP, setNewIP] = useState('');

  const handleChangeName = (event, computer) => {
    event.preventDefault();
    onChangeName({ id: computer.id, newName });
    setNewName('');
    
  };

  const handleChangeIP = (event, computer) => {
    event.preventDefault();
    onAssignIP({ id: computer.id, newIP });
  };

  const handleSubmit = () => {
    if (newName && newIP) {
      const newComputer = {
        id: computers.length + 1,
        name: newName,
        ip: newIP,
        enabled: true
      };

      onSubmitComputer(newComputer);
      setNewName('');
      setNewIP('');
    }
  };

  return (
    <div>
      {computers.map((computer) => (
        <div key={computer.id}>
          <h3>Name: {computer.name}</h3>
          <p>IP: {computer.ip}</p>
          <p>Status: {computer.enabled ? 'Enabled' : 'Disabled'}</p>
          <form>
            <input
              type="text"
              placeholder="New name"
              name="name"
              onChange={(event) => setNewName(event.target.value)}
            />
            <input
              type="text"
              placeholder="New IP"
              name="ip"
              onChange={(event) => setNewIP(event.target.value)}
            />
            <button type="submit" onClick={(event) => { onToggleStatus({ id: computer.id }); event.preventDefault(); }}>
              {computer.enabled ? 'Disable' : 'Enable'}
            </button>
            <button type="submit" onClick={(event) => handleChangeName(event, computer)}>
              Change Name
            </button>
            <button type="submit" onClick={(event) => handleChangeIP(event, computer)}>
              Assign IP
            </button>
          </form>
        </div>
      ))}
      <div>
        <h3>Add New Computer:</h3>
        <input
          type="text"
          placeholder="Name"
          name="name"
          onChange={(event) => setNewName(event.target.value)}
        />
        <input
          type="text"
          placeholder="IP Address"
          name="ip"
          onChange={(event) => setNewIP(event.target.value)}
        />
        <button onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { computers: state };
};

const mapDispatchToProps = {
  onChangeName: changeName,
  onAssignIP: assignIP,
  onToggleStatus: toggleStatus,
  onSubmitComputer: submitComputer
};

const ConnectedComputerList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComputerList);

function App() {
  return (
    <div className='App'>
      <Provider store={store}>
        <ConnectedComputerList />
      </Provider>
    </div>
  );
}

export default App;
