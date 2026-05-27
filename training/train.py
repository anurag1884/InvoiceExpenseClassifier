import pandas as pd

from joblib import dump

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Read training data
df = pd.read_csv("./input/invoice_training_dataset_10000.csv")

# Extract invoice texts and labels from training data
texts = df["Invoice Text"]
labels = df["Category"]

# Train the model on the train dataset after performing preprocessing steps such as lowercasing and removing stop words
model = Pipeline([
    ("tfidf", TfidfVectorizer(
        lowercase=True,
        stop_words="english",
        ngram_range=(1, 2)
    )),
    ("clf", LogisticRegression(max_iter=1000))
])

# Fit the logistic regression model on the given set of invoice texts and their corresponding labels
model.fit(texts, labels)

# Dump the newly trained model into file
dump(model, "../model/invoice_classifier.joblib")
