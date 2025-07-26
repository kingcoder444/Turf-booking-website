import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from your .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# This enables CORS and allows your website to make requests to this server.
CORS(app)

# Configure the Gemini API key from the .env file
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("API key not found. Please set GEMINI_API_KEY in your .env file.")
    genai.configure(api_key=api_key)
except Exception as e:
    print(f"Error configuring Gemini API: {e}")

# Create a route (URL) for our AI functionality
@app.route('/generate-text', methods=['POST'])
def generate_text():
    # Make sure the request has JSON data
    if not request.is_json:
        return jsonify({'error': 'Request must be JSON'}), 400
    
    # Get the prompt from the incoming JSON data
    data = request.get_json()
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({'error': 'Missing prompt in request'}), 400

    try:
        # Use the current recommended model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Generate content using the prompt
        response = model.generate_content(prompt)
        
        # Return the generated text as a JSON response
        return jsonify({'text': response.text})

    except Exception as e:
        # Handle potential errors from the Gemini API or other issues
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500

# This is needed to run the app
if __name__ == '__main__':
    app.run(port=5000, debug=True)