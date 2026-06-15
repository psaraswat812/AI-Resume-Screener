import pandas as pd

# ML libraries
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Save model
import joblib


# Load dataset
df = pd.read_csv("datasets/resume_dataset.csv")


# Check dataset
print(df.head())


# Input and Output
X = df["Resume_str"]
y = df["Category"]


# Convert text into vectors
vectorizer = TfidfVectorizer(stop_words="english")

X_vectors = vectorizer.fit_transform(X)


# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X_vectors,
    y,
    test_size=0.2,
    random_state=42
)


# Create ML model
model = LogisticRegression(max_iter=1000)


# Train model
model.fit(X_train, y_train)


# Make predictions
y_pred = model.predict(X_test)


# Check accuracy
accuracy = accuracy_score(y_test, y_pred)

print(f"\nModel Accuracy: {accuracy * 100:.2f}%")



# Save trained model
joblib.dump(model, "models/resume_classifier_model.pkl")

# Save vectorizer
joblib.dump(vectorizer, "models/tfidf_vectorizer.pkl")


print("\nModel and vectorizer saved successfully!")