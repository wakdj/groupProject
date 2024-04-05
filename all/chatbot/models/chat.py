import random
import json
import os
import pickle
import numpy as np
import nltk
from nltk.stem import LancasterStemmer
from tensorflow.lite.python.interpreter import Interpreter
from nltk.corpus import stopwords

# Loading intents
script_dir = os.path.dirname(__file__)
file_path = os.path.join(script_dir, "intents.json")
file_path_words = os.path.join(script_dir, "words.pkl")
file_path_classes = os.path.join(script_dir, "classes.pkl")

with open(file_path, 'r') as json_data:
    intents = json.load(json_data)

# stemmer in order to help process
stemmer = LancasterStemmer()

# loading words and classes
words = pickle.load(open(file_path_words, 'rb'))
classes = pickle.load(open(file_path_classes, 'rb'))

# loading model
model_location = os.path.join(script_dir, "model.tflite")
interpreter = Interpreter(model_location)
interpreter.allocate_tensors()

stop_words = set(stopwords.words('english'))

def get_intents():
    return intents

def clean(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [word for word in sentence_words if word.lower() not in stop_words]
    sentence_words = [stemmer.stem(word) for word in sentence_words]
    return sentence_words

def bag_of_words(sentence):
    sentence_words = clean(sentence)
    bag = [0] * len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence):
    bow = bag_of_words(sentence)
    input = interpreter.get_input_details()
    output = interpreter.get_output_details()
    bow = bow.astype(np.float32)
    interpreter.set_tensor(input[0]['index'], [bow])
    interpreter.invoke()
    result = interpreter.get_tensor(output[0]['index'])[0]
    results = [[i, r] for i, r in enumerate(result) if r > 0.5]
    print(results)
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = [{'intent': classes[r[0]], 'probability': str(r[1])} for r in results]
    return return_list

def get_response(intents_list, intents_json):
    if len(intents_list) == 0:
        return "Sorry, I cannot understand you yet."
    tag = intents_list[0]['intent']
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if i['tag'] == tag:
            result = random.choice(i['responses'])
            break
    return result

x = predict_class("hi")
print(x)
