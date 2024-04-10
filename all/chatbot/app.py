from flask import Flask, render_template, request, jsonify
from models.chat import get_response,predict_class,get_intents,get_song

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

@app.post("/postSong")
def postSong():
    category_sub_category = request.get_json().get("message")
    main_category = category_sub_category.split("_")[0]
    res = get_song(main_category, category_sub_category)
    message = {"answer": res}
    return jsonify(message)


# if __name__ == "__main__":
#     app.run(debug=True)
app.run(host='0.0.0.0', port=50000)