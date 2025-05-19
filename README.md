# COS70008-D2-apk-guardian

## Overview

**apk-guardian** is a project focused on Android malware detection using a hybrid static analysis approach. The system leverages machine learning models to identify malicious applications with high accuracy.

## Features

- Hybrid static analysis for feature extraction
- Machine learning-based detection
- Deep Belief Network (DBN) and Logistic Regression models

## Dataset

- **Source:** CIC Android Malware Dataset

## Project Structure

```
COS70008-D2-apk-guardian/
├── README.md
├── backend/
├── frontend/
└── ml_model/
    └── test.txt
```

- **backend/**: Backend server and API logic
- **frontend/**: Frontend user interface
- **ml_model/**: Machine learning models and related files

## Approach

1. **Feature Extraction:** Static analysis of APK files to extract relevant features.
2. **Model Training:** Use of Deep Belief Network (DBN) for feature learning, followed by Logistic Regression for classification.
3. **Detection:** Predict whether an APK is benign or malicious.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/COS70008-D2-apk-guardian.git
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the detection script:
   ```bash
   python detect.py <path_to_apk>
   ```

## Contributors

- Hanzala

## License

This project is licensed under the MIT License.
