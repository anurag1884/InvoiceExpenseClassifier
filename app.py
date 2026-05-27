from joblib import load
from flask import Flask, request, jsonify, render_template

# Load the trained model from file dumped during training phase
model = load("./model/invoice_classifier.joblib")

# Prediction routine that runs the model on a given request containing invoice text and outputs the corresponding category and its confidence score
def predict(req):
    probs = model.predict_proba([req["text"]])[0]
    pred = model.predict([req["text"]])[0]

    res = {
        "text": req["text"],
        "category": pred,
        "confidence": round(float(max(probs)), 4)
    }

    return res

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        return jsonify(predict(request.get_json()))

    return render_template('index.html')

if __name__ == '__main__':
    app.run()
