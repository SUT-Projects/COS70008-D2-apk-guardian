from os import path, makedirs
import pandas as pd
from numpy import hstack

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

from tensorflow.keras.models import Model, Sequential
from tensorflow.keras.layers import Input, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

import matplotlib.pyplot as plt
import seaborn as sns
import joblib

model_dir = path.join(path.dirname(__file__), 'model')

def load_data(filename: str):
    file_path = path.join(path.dirname(__file__), filename)
    df = pd.read_csv(file_path)
    print(f"First 5 rows of dataset {file_path}:")
    df.head()
    return df


def train_apk_model(filename: str):
    df = load_data(filename)
    # Separate features and targetX = df.drop(columns=['class'])
    X = df.drop(columns=['class'])
    y = df['class']

    print(f"Features shape: {X.shape}")
    print(f"Target shape: {y.shape}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42)

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # Define the input dimension based on your data
    input_dim = X_train.shape[1]

    # Define encoding layer sizes
    encoding_dim1 = 128
    encoding_dim2 = 64

    # Build the autoencoder model
    input_layer = Input(shape=(input_dim,))
    encoded1 = Dense(encoding_dim1, activation='relu')(input_layer)
    encoded2 = Dense(encoding_dim2, activation='relu')(encoded1)

    decoded1 = Dense(encoding_dim1, activation='relu')(encoded2)
    decoded2 = Dense(input_dim, activation='sigmoid')(decoded1)

    autoencoder = Model(inputs=input_layer, outputs=decoded2)

    autoencoder.compile(optimizer='adam', loss='mse')

    # Train the autoencoder
    autoencoder.fit(X_train, X_train,
                    epochs=50,
                    batch_size=32,
                    shuffle=True,
                    validation_data=(X_test, X_test))

    # Create encoder model for feature extraction
    encoder = Model(inputs=input_layer, outputs=encoded2)

    # Transform the data using encoder
    X_train_encoded = encoder.predict(X_train)
    X_test_encoded = encoder.predict(X_test)

    logreg = LogisticRegression(max_iter=1000)
    logreg.fit(X_train_encoded, y_train)

    # Predict and evaluate
    y_pred = logreg.predict(X_test_encoded)
    accuracy = accuracy_score(y_test, y_pred)
    print("Accuracy of stacked autoencoder + Logistic Regression:", accuracy)

    # Predict on test data
    y_pred = logreg.predict(X_test_encoded)

    # Accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {accuracy:.4f}\n")

    # Classification report (precision, recall, f1-score)
    print("Classification Report:")
    print(classification_report(y_test, y_pred))

    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=logreg.classes_, yticklabels=logreg.classes_)
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.title('Confusion Matrix')
    plt.show()

    # Save the logistic regression model
    joblib.dump(logreg, path.join(model_dir, 'logistic_model.pkl'))

    # Save the scaler
    joblib.dump(scaler, path.join(model_dir, 'scaler.pkl'))

    # Save the encoder model (autoencoder encoder part)
    encoder.save(path.join(model_dir, 'encoder_model.h5'))

def train_url_model(filename: str):
    df = load_data(filename)


    # STEP 4: Separate features and target
    y = df['status'].map({'legitimate': 0, 'phishing': 1}).astype(
        int) if df['status'].dtype == object else df['status'].astype(int)

    # Extract URL text for TF-IDF
    urls = df['url'].astype(str)

    # Extract numeric features (drop url and status)
    numeric_features = df.drop(columns=['url', 'status'])

    # STEP 5: Scale numeric features
    scaler = StandardScaler()
    X_num_scaled = scaler.fit_transform(numeric_features)

    # STEP 6: TF-IDF vectorization of URL text
    tfidf = TfidfVectorizer(max_features=500)  # tune max_features for performance
    X_tfidf = tfidf.fit_transform(urls).toarray()
    
    X = hstack([X_num_scaled, X_tfidf])

    # STEP 8: Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # STEP 9: Build deeper neural network model
    model = Sequential([
        Dense(512, activation='relu', input_shape=(X_train.shape[1],)),
        Dropout(0.3),
        Dense(256, activation='relu'),
        Dropout(0.2),
        Dense(128, activation='relu'),
        Dropout(0.2),
        Dense(1, activation='sigmoid')  # Output layer for binary classification
    ])

    # STEP 10: Compile model
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

    # Callbacks: Early stopping + reduce LR on plateau
    early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5)

    # STEP 11: Train model
    model.fit(
        X_train, y_train,
        epochs=100,
        batch_size=64,
        validation_split=0.1,
        callbacks=[early_stop, reduce_lr],
        verbose=2
    )

    # STEP 12: Evaluate
    y_pred_prob = model.predict(X_test)
    y_pred = (y_pred_prob > 0.5).astype(int)

    print("Test Accuracy:", accuracy_score(y_test, y_pred))
    print("Classification Report:\n", classification_report(y_test, y_pred))
    
    # After you get your predictions `y_pred` and true labels `y_test`

    # 1. Print confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    print("Confusion Matrix:\n", cm)

    # Optional: Plot confusion matrix nicely
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
                xticklabels=['Legitimate', 'Phishing'],
                yticklabels=['Legitimate', 'Phishing'])
    plt.xlabel('Predicted Label')
    plt.ylabel('True Label')
    plt.title('Confusion Matrix')
    plt.show()

    # 2. Save model, scaler, and tfidf vectorizer
    model.save(path.join(model_dir, "dbn_logistic_model.keras"))   # Use Keras recommended format
    joblib.dump(scaler, path.join(model_dir, "url_model_scaler.pkl"))
    joblib.dump(tfidf, path.join(model_dir, "tfidf_vectorizer.pkl"))

    print("✅ Model, scaler, and vectorizer saved successfully.")



filename = 'datasets/apk-dataset.csv'  # your file name
df = pd.read_csv(path.join(path.dirname(__file__), filename))


# OR use save_model explicitly:
# save_model(encoder, 'encoder_model.keras')

if __name__ == "__main__":
    # Ensure the model directory exists
    makedirs(model_dir, exist_ok=True)

    # Train the APK model
    train_apk_model('datasets/apk-dataset.csv')

    # Train the URL model
    train_url_model('datasets/url-dataset.csv')
