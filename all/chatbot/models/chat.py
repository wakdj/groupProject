import random
import json
import os
import pickle
import random
import numpy as np
import nltk
from nltk.stem import LancasterStemmer
from tensorflow.lite.python.interpreter import Interpreter
from nltk.corpus import stopwords

## https://github.com/patrickloeber/pytorch-chatbot/tree/master
#https://github.com/jerrytigerxu/Simple-Python-Chatbot/tree/master
# https://github.com/patrickloeber/chatbot-deployment/tree/main

# Loading intents
script_dir = os.path.dirname(__file__)
file_path = os.path.join(script_dir, "intents.json")
file_path_song_data = os.path.join(script_dir, "all_playlist_info.json")
file_path_words = os.path.join(script_dir, "words.pkl")
file_path_classes = os.path.join(script_dir, "classes.pkl")


with open(file_path, 'r') as json_data:
    intents = json.load(json_data)

with open(file_path_song_data, 'r') as json_data:
    # data generated in spotify_data/get_data.py
    song_data = json.load(json_data)

# stemmer in order to help process
stemmer = LancasterStemmer()

# loading words and classes
words = pickle.load(open(file_path_words, 'rb'))
classes = pickle.load(open(file_path_classes, 'rb'))


# loading model
model_location = os.path.join(script_dir, "model.tflite")
interpreter = Interpreter(model_location)
interpreter.allocate_tensors()
emotion = ""
stop_words = set(stopwords.words('english'))

def get_intents():
    return intents

# preprocessing sentences using tokenization and stemming
def clean(sentence):
    """
    Cleaning the input sentence using tokenisation and stemming
    Args:
        sentence (str) : input sentence

    Returns:
        Processed sentence

    """
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [word for word in sentence_words if word.lower() not in stop_words]
    sentence_words = [stemmer.stem(word) for word in sentence_words]
    return sentence_words

def bag_of_words(sentence):
    """
    Creating bag of words for the sentence.
        if the sentence contains a word
        in the training data it is assinged
        1, else assigned 0

    Args:
        sentence (str) : input sentence (this will be from the user)

    Returns:
        np.array(bag) (array (numpy)) : bag of words for sentence

    """
    sentence_words = clean(sentence)
    # empty bag
    bag = [0] * len(words)
    # populating bag
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence):

    """
    Using tensor flow lite to make prediction

    Args:
        sentence (str) : input sentence (this will be from the user)

    Returns:
        return_list (list) : list of predictions above 50% 
                            (accuracy took a hit when switching to tflite)

    """

    bow = bag_of_words(sentence)
    input = interpreter.get_input_details()
    output = interpreter.get_output_details()
    bow = bow.astype(np.float32)

    interpreter.set_tensor(input[0]['index'], [bow])
    interpreter.invoke()
    result = interpreter.get_tensor(output[0]['index'])[0]

    # if pred_accuracy is less than 0.5 then the default value will be
    # used in the get_response method
    results = [[i, r] for i, r in enumerate(result) if r > 0.5]
    print(results)

    results.sort(key=lambda x: x[1], reverse=True)
    return_list = [{'intent': classes[r[0]], 'probability': str(r[1])} for r in results]
    return return_list

def get_response(intents_list, intents_json):

    """
    Best prediction response is picked, iteration over
    the original intents to find the response
    for that emotion, response is choosen at random
    Args:
        intents_list (list (containing dicts)) : list of predicted classes
        intents_json (JSON) : intents

    Returns:
        result + "~" + tag (str) : Poor choice of return type. returns the a response
                                   from the intents, plus the emotion  

    """

    # fallback option
    if len(intents_list) == 0:
        return "Sorry, I cannot understand you yet. ~" + "unknown"
    
    # most likely tag
    tag = intents_list[0]['intent']
    list_of_intents = intents_json['intents']

    for i in list_of_intents:
        if i['tag'] == tag:
            # random response based on the tag 
            result = random.choice(i['responses'])
            break
    # should be an array
    return result + "~" + tag 

def get_song(m,s):

    """
    Getting a song based on the main category (emotion)
    and sub-category (user choice e.g. pop). Song data
    was collected using the script in spotify_data/get_data.py

    Args:
        m (str) : main category, e.g. happy
        s (str) : sub-category, e.g. pop

    Returns:
        return_list (list) : list of predictions above 50% 
                            (accuracy took a hit when switching to tflite)

    """
    
    songs = None

    for x in song_data:
        if(x["category"] == m):
            songs = (x["sub_category"][s])
    r = random.randint(0,len(songs)-1)
    return ["You might like " + songs[r]["name"] + " by " + songs[r]["artist"] + ". Here's a ", songs[r]["spotify_url"]]


#(get_song("sad","sad_pop"))





# "quick tests"
x = predict_class("i am happy")
print(x)
print("*******************")
y = predict_class("i need an energetic song")
print(y)
print("*****************")
poo = predict_class("poo")
print(poo)