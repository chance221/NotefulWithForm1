import React from 'react';
import config from '../config';
import ApiContext from '../ApiContext'
import ValidationError from '../ValidationError'
import './AddFolder.css'


export default class AddNote extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: {
        value: "",
        touched: false
      }
    }
  }
  static contextType = ApiContext

  

  updateName(name){
    this.setState( {name: {value:name, touched: true} })
  }

  handleSubmit = (e) => {
      e.preventDefault();
      const {name} = this.state;
      const { folders, addFolder } = this.context.folders;
      addFolder(name)

      
      //make the name to the app state that is in context here then make the api call with the updated state
  }

  updateServerFolders = folders =>{
    Promise (
      fetch(`${config.API_ENDPOINT}/folders`, {
          method:'post',
          headers:{
              'content-type':'application/json',
          },
          body: JSON.stringify({
            folders
          })
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
  
  validateName(){
    const name = this.state.name.value.trim();
    if(name.length ===0){
      return "Folder name is required"
    }
  }

  
  render (){
    const nameError = this.validateName()

    return(
      <div className = 'AddNote'>
        <h2 className = 'Addnote__title'>
          Enter the name of your new folder.
        </h2>
        <form className="addNote-form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" class="lbl">Folder Name</label>
            <input 
              type='text' 
              className='form_input' 
              name='name' 
              id='name'
              onChange={this.handleNameChange}
            />
            {this.state.name.touched && <ValidationError message={nameError}/>}
          </div>
          <div className="button-group">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={this.validateName()}
            >Save</button>
            <button type="button" className="submit-btn">Cancel</button>{/* Need to move the page back one by accessing history object? */}
          </div>

        </form>
      </div>
  )
  }
    
}
