import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import ApiContext from '../ApiContext';
import AddFolder from '../AddFolder/AddFolder';
import config from '../config';
import './App.css';
const shortid = require('shortid');

class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {
        Promise.all([
            fetch(`${config.API_ENDPOINT}/notes`),
            fetch(`${config.API_ENDPOINT}/folders`)
        ])
            .then(([notesRes, foldersRes]) => {
                if (!notesRes.ok)
                    return notesRes.json().then(e => Promise.reject(e));
                if (!foldersRes.ok)
                    return foldersRes.json().then(e => Promise.reject(e));

                return Promise.all([notesRes.json(), foldersRes.json()]);
            })
            .then(([notes, folders]) => {
                this.setState({notes, folders});
            })
            .catch(error => {
                console.error({error});
            });
    }

    addFolder = (folderName) => {
        let newFolder = {
            name: '',
            id: '' 
        };
        //let currentState = this.state.folders;
        
        newFolder.name= folderName;
        newFolder.id = shortid.generate();
        
        // let newState = [...currentState, newFolder]
        // console.log(`this is the new state${newState}`)
        
        return newFolder
    }

    // ***Still need to make sure this works as not sure how to send***
    handleFolderSubmit = (e) =>{
        Promise (
        fetch(`${config.API_ENDPOINT}/folders`, {
            method:'post',
            headers:{
                'content-type':'application/json',
            }

        })
        .then((folderRes)=>{
            if (!folderRes.ok)
            return folderRes.json().then(e=> Promise.reject(e))
            return Promise(folderRes.json())
        })
        .then((folderRes)=>{
            console.log(folderRes)
            alert(`A new folder has been added`)
        })
        .catch(e =>{
            console.error({e});
        })
        )
    }

    // ***Still need to this. API call may happen in the new folder component***
    handleNoteSubmit = (e) =>{

    }

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        });
    };

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageNav} />
                <Route path="/add-folder" component={AddFolder} />
                <Route path="/add-note" component={NotePageNav} /> {/* need to chande to add note form*/}
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageMain} />
            </>
        );
    }

    render() {
        const value = {
            notes: this.state.notes,
            folders: this.state.folders,
            deleteNote: this.handleDeleteNote,
            handleFolderSubmit: this.handleFolderSubmit,
            handleNoteSubmit: this.handleNoteSubmit,
            addFolder: this.addFolder 
        };
        return (
            <ApiContext.Provider value={value}>
                <div className="App">
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{' '}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <main className="App__main">{this.renderMainRoutes()}</main>
                </div>
            </ApiContext.Provider>
        );
    }
}

export default App;
