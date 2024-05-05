import numpy as np
import random
import json
import pickle
import os
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
import nltk
from nltk import LancasterStemmer
import random
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from nltk.corpus import stopwords
import tensorflow as tf

script_dir = os.path.dirname(__file__)
file_path = os.path.join(script_dir, "intents.json")
file_path_words = os.path.join(script_dir,"words.pkl")
file_path_classes = os.path.join(script_dir,"classes.pkl")
with open(file_path, 'r') as f:
    intents = json.load(f)


words = []
classes = []
docs = []
chars_ignore = ['?','.',',','!']

stop_words = set(stopwords.words('english'))

for intent in intents['intents']:
    # pattern is what we expect the user to type
    for pattern in intent['patterns']:
        # tokenising in order for the nn to understand 
        word_list = nltk.word_tokenize(pattern)
        # removing stop words
        word_list = [word for word in word_list if word.lower() not in stop_words]
        words.extend(word_list)
        docs.append(((word_list),intent['tag']))
        if intent['tag'] not in classes:
            classes.append(intent['tag'])
# trimming suffixes
stemmer = LancasterStemmer()
words = [stemmer.stem(word) for word in words if word not in chars_ignore ]

# unique words
words = sorted(set(words))

#saving
pickle.dump(words,open(file_path_words,'wb'))
pickle.dump(classes,open(file_path_classes,'wb'))

training = []
output_temp = [0] * len(classes)

for doc in docs:
    bag = []
    word_patterns = doc[0]
    word_patterns = [stemmer.stem(word.lower()) for word in word_patterns]
    for word in words:
        bag.append(1) if word in word_patterns else bag.append(0)
    output_row = list(output_temp)
    output_row[classes.index(doc[1])] = 1
    training.append([bag, output_row])

random.shuffle(training)
training = np.array(training)

x_train = list(training[:,0])
y_train = list(training[:,1])

input_shape = len(x_train[0])

model = Sequential()
model.add(Dense(16, input_shape = (input_shape,), activation ='relu' ))
model.add(Dropout(0.3))
model.add(Dense(32, activation = 'relu'))
model.add(Dropout(0.3))
model.add(Dense(len(y_train[0]), activation = 'softmax'))
model.compile(loss = 'categorical_crossentropy',optimizer = 'nadam', metrics= ['accuracy'])

history = model.fit(np.array(x_train),np.array(y_train),epochs = 250,batch_size = 12, verbose = 1 )

converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

with open('model.tflite', 'wb') as f:
  f.write(tflite_model)
