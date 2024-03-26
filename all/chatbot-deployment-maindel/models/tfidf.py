import os
import json
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import accuracy_score

# Get the directory of the current script
script_dir = os.path.dirname(__file__)  
# Define the path to the intents JSON file
file_path = os.path.join(script_dir, "intents.json")

# Load intents from JSON file
with open(file_path, 'r') as json_data:
    intents = json.load(json_data)

# Extract patterns and tags from intents data
patterns = []
tags = []
for intent in intents['intents']:
    for pattern in intent['patterns']:
        patterns.append(pattern)
        tags.append(intent['tag'])

# Encode tags into numerical labels
label_encoder = LabelEncoder()
tags_encoded = label_encoder.fit_transform(tags)

# Convert patterns into TF-IDF features
vectorizer = TfidfVectorizer(max_features=11)  # Limiting to top 1000 features
X = vectorizer.fit_transform(patterns).toarray()

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, tags_encoded, test_size=0.25)

# Train a classifier (MultiNomial Naive Bayes) on the TF-IDF features
classifier = SGDClassifier()
classifier.fit(X_train, y_train)

# Predict on the test set
prediction = classifier.predict(X_test)

# Calculate accuracy
acc = accuracy_score(y_test, prediction)
print("Accuracy:", acc)
