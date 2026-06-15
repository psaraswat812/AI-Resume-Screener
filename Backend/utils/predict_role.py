import joblib


# Load trained ML model
model = joblib.load("models/resume_classifier_model.pkl")

# Load TF-IDF vectorizer
vectorizer = joblib.load("models/tfidf_vectorizer.pkl")


def predict_job_role(resume_text):

    # Convert text into TF-IDF vector
    resume_vector = vectorizer.transform([resume_text])

    # Predict category
    prediction = model.predict(resume_vector)

    return prediction[0]