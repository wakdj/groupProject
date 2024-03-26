from flask import Flask, render_template, request, jsonify
from models.chat import get_response,predict_class,get_intents

app = Flask(__name__)

@app.get("/")
def index_get():
    return render_template("template.html")

@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    ints = predict_class(text)
    res = get_response(ints, get_intents())
    #response = get_response(text)
    message = {"answer": res}
    return jsonify(message)


# if __name__ == "__main__":
#     app.run(debug=True)
app.run(host='0.0.0.0', port=50000)