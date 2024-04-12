from flask import Flask, render_template, request, jsonify,redirect,url_for
from models.chat import get_response,predict_class,get_intents,get_song

app = Flask(__name__)


@app.get("/")
def index_get():
    return render_template("template.html")

@app.post('/login')
def login():
    message = ""
    username = request.get_json().get("username")
    password = request.get_json().get("password")
    print(username)
    print(password)
    if username == 'admin' and password == 'admin':
        message = 'success'
    else:
        message=  'Invalid Credentials. Please try again.'
    message = {"answer": message}
    print(message)
    return jsonify(message)



# @app.post('/createAccount')
# def createAccount():
#     error = None
#     success = None
#     if request.form['username'] != 'admin' or request.form['password'] != 'admin':
#         error = 'Invalid Credentials. Please try again.'
#     else:
#         success = 'success'
#         return success
#     return error



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
    category_sub_category = category_sub_category.replace(" ","_")
    res = get_song(main_category, category_sub_category)
    message = {"answer": res}
    return jsonify(message)


# if __name__ == "__main__":
#     app.run(debug=True)
app.run(host='0.0.0.0', port=50000)