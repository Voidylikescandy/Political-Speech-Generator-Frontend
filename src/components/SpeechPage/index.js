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
      requirementsError: ''
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
    // const apiUrl = 'http://127.0.0.1:10000/generate_speech'; // Correct API endpoint
    const apiUrl = 'https://political-speech-generator-5fln.onrender.com/generate_speech';
    const { speechTextareaValue, requirementsTextareaValue } = this.state;

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

    this.setState({ isLoading: true }); // Show spinner

    axios.post(apiUrl, {
      speech: speechTextareaValue,
      requirements: requirementsTextareaValue,
      generated_speech: 'Hello'
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
    // const apiUrl = 'http://127.0.0.1:10000/translate'; // Correct API endpoint
    const apiUrl = 'https://political-speech-generator-5fln.onrender.com/translate';

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

  render() {
    const { isLoading, generatedSpeech, selectedLanguage, translatedSpeech, speechError, requirementsError } = this.state;

    return (
      <div className="container">
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

        {/* Show spinner if isLoading is true */}
        {isLoading && (
          <div className="spinner-container">
            <div>
              <div className="spinner"></div>
              <Typewriter
                options={{
                  strings: ['Generating Speech...'],
                  autoStart: true,
                  loop: true,
                }}
              />
            </div>
          </div>
        )}

        {/* Show generated speech if available */}
        {generatedSpeech.trim().length !== 0 && (
          <>
            <div className="text-container">
              <div className="textbox">
                <h1>Generated Speech:</h1>
                <SpeechArea content={generatedSpeech} />
              </div>


              {/* Show translated speech if available */}
              {translatedSpeech.trim().length !== 0 && (
                <div className="textbox">
                  <>
                    <h1>Translated Speech:</h1>
                    <SpeechArea content={translatedSpeech} />
                  </>
                </div>
              )}
            </div>
            <>
              <h1>Languages:</h1>
              <select value={selectedLanguage} onChange={this.handleLanguageChange} className="language-dropdown">
                <option value="Hindi">Hindi</option>
                <option value="Telugu">Telugu</option>
                <option value="Bengali">Bengali</option>
              </select>
              <div className="language-dropdown-arrow"></div>
              <button onClick={this.handleTranslate} className="translate-button">Translate</button>
              <button onClick={() => { window.location.href = "/" }} className="clear-all-button">Back</button>
            </>
          </>
        )}
        {/* Button for clearing all input fields */}
        {
          // !isLoading && generatedSpeech.trim().length !== 0 && (
          //   <button onClick={this.handleClearAll} className="clear-all-button">Clear All</button>
          // )
        }


      </div>
    );
  }
}

export default SpeechPage;
