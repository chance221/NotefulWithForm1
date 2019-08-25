import React from 'react';
import config from '../config';
import ApiContext from '../ApiContext';
import ValidationError from '../ValidationError';
import { isThisHour } from 'date-fns';

export default class AddNote extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      noteName: {
        value:"",
        touched:false
      },
      noteContent: {
        value:"",
        touched:false
      }
    }
  }
  static defaultProps = {
    history:{
      goBack: () => { }
    }
  }
  static contextType = ApiContext;
  
  updateNoteName (name){
    this.setState( {noteName: {value:name, touched:true} })
  }

  handleSubmit = (e) =>{
    e.preventDefault();
  //this is where the logic to process the submission goes
  console.log('the note was submitted')
  }

  validateNoteName(){
    const noteName = this.state.note.value.trim();
    if(noteName.length === 0){
      return "Note name is required"
    }
  }

  validateNoteContent(){
    const noteContent = this.state.noteContent.value.trim();
    if(noteContent.length === 0){
      return "Note content is required"
    }
  }

  render(){

    const noteNameError = this.validateNoteName();

    const noteContentError = this.validateNoteContent();

    return(
      <div className = 'AddNote'>
        <div className= 'AddNote__container'>
        <h2 className = 'AddNote__title'>
          Please enter all details below to add a note
        </h2>
          <form className="addNote-form" onSubmit = {this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="lbl">Note Name</label>
              <input 
                type='text'
                className='form_input'
                name = 'noteName'
                id = 'noteName'
                onChange = {e=>this.updateNoteName(e.target.value)}
              />
              {this.state.noteName.touched && <ValidationError message={noteNameError}/>}
              <label htmlFor="content" className="lbl">Enter the content of your note here</label>
              <textarea 
                rows="20" 
                cols="100" 
                placeholder="Enter Note Here"
              />
              {this.state.noteContent.touched && <ValidationError message={noteContentError}/>}
            </div>
            <div className="btn-group">
              <button
                type="submit"
                className="submit-btn"
                disabled={this.validateNoteContent()}></button> {/*need to check this*/}
            </div>

          </form>
        </div>
      </div>
    )
  }
}