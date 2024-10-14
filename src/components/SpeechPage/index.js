import React, { Component } from 'react';
import SpeechArea from '../SpeechArea';
import './index.css';
import axios from 'axios';
import Typewriter from 'typewriter-effect';

class SpeechPage extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      speechTextareaValue: '',
      requirementsTextareaValue: '',
      isLoading: false,
      generatedSpeech: '',
      selectedLanguage: 'Hindi',
      translatedSpeech: '',
      speechError: '',
      requirementsError: '',
      selectedNewspaper: '', // New state for the Newspaper dropdown
      selectedState: '' // New state for the State dropdown
    };
    this.state = { ...this.initialState };
    
    this.handleSpeechTextareaChange = this.handleSpeechTextareaChange.bind(this);
    this.handleRequirementsTextareaChange = this.handleRequirementsTextareaChange.bind(this);
    this.handleSpeechFileInputChange = this.handleSpeechFileInputChange.bind(this);
    this.handleRequirementsFileInputChange = this.handleRequirementsFileInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleTranslate = this.handleTranslate.bind(this);
    this.handleClearAll = this.handleClearAll.bind(this);
    this.handleNewspaperChange = this.handleNewspaperChange.bind(this); // Bind handler for newspaper
    this.handleStateChange = this.handleStateChange.bind(this); // Bind handler for state
  }

  handleSpeechTextareaChange(event) {
    this.setState({ speechTextareaValue: event.target.value });
  }

  handleRequirementsTextareaChange(event) {
    this.setState({ requirementsTextareaValue: event.target.value });
  }

  handleSpeechFileInputChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      this.setState({ speechTextareaValue: content });
    };
    reader.readAsText(file);
  }

  handleRequirementsFileInputChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      this.setState({ requirementsTextareaValue: content });
    };
    reader.readAsText(file);
  }

  handleSubmit() {
    const apiUrl = 'http://127.0.0.1:10000/generate_speech'; // Correct API endpoint
    const { speechTextareaValue, requirementsTextareaValue, selectedNewspaper, selectedState } = this.state;
  
    // Validate fields
    if (speechTextareaValue.trim() === '') {
      this.setState({ speechError: '* Speech field cannot be empty.' });
      if (requirementsTextareaValue.trim() === '') {
        this.setState({ requirementsError: '* Requirements field cannot be empty.' });
      } else {
        this.setState({ requirementsError: '' });
      }
      return;
    } else {
      this.setState({ speechError: '' });
    }
  
    if (requirementsTextareaValue.trim() === '') {
      this.setState({ requirementsError: '* Requirements field cannot be empty.' });
      return;
    } else {
      this.setState({ requirementsError: '' });
    }
  
    // Add validation for the dropdowns if necessary
    if (selectedState.trim() === '') {
      alert('Please select a state.');
      return;
    }
  
    this.setState({ isLoading: true }); // Show spinner
  
    // Send all 4 fields to the backend
    axios.post(apiUrl, {
      speech: speechTextareaValue,
      requirements: requirementsTextareaValue,
      newspaper: selectedNewspaper, // Send newspaper value
      state: selectedState // Send state value
    })
      .then(response => response.data)
      .then(data => {
        console.log('Received response:', data);
        this.setState({ isLoading: false, generatedSpeech: data.generated_speech });
      })
      .catch(error => {
        console.error('Error:', error);
        this.setState({ isLoading: false }); // Hide spinner on error
      });
  }  

  handleLanguageChange(event) {
    this.setState({ selectedLanguage: event.target.value });
  }

  handleTranslate() {
    const { generatedSpeech, selectedLanguage } = this.state;
    const apiUrl = 'http://127.0.0.1:10000/translate';

    this.setState({ isLoading: true });

    axios.post(apiUrl, {
      speech: generatedSpeech,
      language: selectedLanguage,
      translated_speech: "namaskar"
    })
      .then(response => response.data)
      .then(data => {
        console.log('Translation response:', data);
        this.setState({ isLoading: false, translatedSpeech: data.translated_speech });
      })
      .catch(error => {
        console.error('Error:', error);
        this.setState({ isLoading: false });
      });
  }

  handleClearAll() {
    this.setState({ ...this.initialState });
  }

  handleNewspaperChange(event) {
    this.setState({ selectedNewspaper: event.target.value });
  }

  handleStateChange(event) {
    this.setState({ selectedState: event.target.value });
  }

  render() {
    const { isLoading, generatedSpeech, selectedLanguage, translatedSpeech, speechError, requirementsError, selectedNewspaper, selectedState } = this.state;
    const statesOfIndia = [ 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Jammu and Kashmir', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry'];
    const newspapers = [ 'Deccan Chronicle' ];

    return (
      <div className="container">
        {/* Newspaper Dropdown */}
        <div className="dropdown">
            <label htmlFor="newspaper">Newspaper:</label>
            <select id="newspaper" value={selectedNewspaper} onChange={this.handleNewspaperChange}>
                <option value="">Select a newspaper</option>
                {newspapers.map(newspaper => (
                    <option key={newspaper} value={newspaper}>{newspaper}</option>
                ))}
            </select>
        </div>

        {/* State Dropdown */}
        <div className="dropdown">
            <label htmlFor="state">State:</label>
            <select id="state" value={selectedState} onChange={this.handleStateChange}>
                <option value="">Select a state</option>
                {statesOfIndia.map(state => (
                <option key={state} value={state.toLowerCase().replace(/\s+/g, '-')}>
                    {state}
                </option>
                ))}
            </select>
        </div>

        {/* Speech and Requirements Text Areas */}
        {!isLoading && generatedSpeech.trim().length === 0 && (
          <div>
            <div className="text-container">
              <div className="textbox">
                <h1>Speech:</h1>
                <SpeechArea content={this.state.speechTextareaValue} onTextareaChange={this.handleSpeechTextareaChange} />
                <input type="file" accept=".txt" onChange={this.handleSpeechFileInputChange} />
                {speechError !== '' && <p className="error-message">{speechError}</p>}
              </div>
              <div className="textbox">
                <h1>Requirements:</h1>
                <SpeechArea content={this.state.requirementsTextareaValue} onTextareaChange={this.handleRequirementsTextareaChange} />
                <input type="file" accept=".txt" onChange={this.handleRequirementsFileInputChange} />
                {requirementsError && <p className="error-message">{requirementsError}</p>}
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '1.5em' }}>
              <button onClick={this.handleSubmit}>Submit</button>
            </div>
          </div>
        )}

        {/* Other sections remain the same */}
        {/* ... */}
      </div>
    );
  }
}

export default SpeechPage;
