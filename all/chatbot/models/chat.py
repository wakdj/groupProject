import random
import json
import os
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from nltk import LancasterStemmer
from tensorflow.keras.models import load_model
from nltk.corpus import stopwords

# Loading intents
script_dir = os.path.dirname(__file__)
file_path = os.path.join(script_dir, "intents.json")

with open(file_path, 'r') as json_data:
    intents = json.load(json_data)

# stemmer in order to help process
stemmer = LancasterStemmer()

# loading words and classes
words = pickle.load(open('words.pkl', 'rb'))
classes = pickle.load(open('classes.pkl', 'rb'))

# loading model
model_location = os.path.join(script_dir, "history.keras")
mod = load_model(model_location)
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
    res = mod.predict(np.array([bow]))[0]
    results = [[i, r] for i, r in enumerate(res) if r > 0.6]
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

x = predict_class("poo")
print(x)