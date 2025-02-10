from flask import Flask, jsonify
from flask_cors import CORS
import openai
from config import Config

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Konfigurera OpenAI API-nyckel från config
openai.api_key = Config.OPENAI_API_KEY

@app.route('/api/generate-content', methods=['GET'])
def generate_content():
    try:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "Du är en innehållsskapare som genererar intressanta artiklar i HTML-format."
                },
                {
                    "role": "user",
                    "content": "Skapa en kort artikel om ett intressant ämne."
                }
            ]
        )
        
        return jsonify({
            "content": completion.choices[0].message.content
        })
    
    except Exception as e:
        print(f"Fel vid API-anrop: {str(e)}")
        return jsonify({"error": "Kunde inte generera innehåll"}), 500

if __name__ == '__main__':
    app.run(debug=Config.DEBUG, port=Config.PORT) 