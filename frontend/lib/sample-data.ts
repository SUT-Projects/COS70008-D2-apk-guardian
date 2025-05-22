export const SampleData = {
  "_id": "682ea68122ed8b37938389e6",
  "class_labels": [
    "Adware",
    "Banking",
    "Benigan",
    "Riskware",
    "SMS Malware"
  ],
  "creation_date": "Thu, 22 May 2025 14:22:25 GMT",
  "dataset_info": {
    "missing_values": 8,
    "numeric_columns": 471,
    "numeric_rows": 9,
    "original_columns": 472,
    "original_rows": 9
  },
  "duration_seconds": 0.137099,
  "file_info": {
    "content_type": "text/csv",
    "filename": "test.csv",
    "size_bytes": 16717
  },
  "finish_time": "Thu, 22 May 2025 14:22:25 GMT",
  "request_info": {
    "endpoint": "/prediction/upload",
    "method": "POST",
    "remote_addr": "127.0.0.1",
    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
  },
  "request_time": "Thu, 22 May 2025 14:22:25 GMT",
  "results": [
    {
      "prediction": "Adware",
      "probabilities": {
        "Adware": 0.7661834823911503,
        "Banking": 0.23381476189598638,
        "Benigan": 5.581001856591699e-23,
        "Riskware": 1.9685947647613028e-14,
        "SMS Malware": 1.7557128435370486e-06
      }
    },
    {
      "prediction": "Riskware",
      "probabilities": {
        "Adware": 6.264702659403566e-17,
        "Banking": 4.05255470721611e-12,
        "Benigan": 0.19128311586985836,
        "Riskware": 0.8087150971365605,
        "SMS Malware": 1.7869895285671742e-06
      }
    },
    {
      "prediction": "Riskware",
      "probabilities": {
        "Adware": 8.321323874128149e-18,
        "Banking": 1.5710089271364612e-15,
        "Benigan": 5.32898591432285e-11,
        "Riskware": 0.9999999999467086,
        "SMS Malware": 6.411801806615557e-26
      }
    },
    {
      "prediction": "Riskware",
      "probabilities": {
        "Adware": 2.027965925412838e-15,
        "Banking": 7.417213678431056e-10,
        "Benigan": 0.026178790142331963,
        "Riskware": 0.9736611891857068,
        "SMS Malware": 0.0001600199302378591
      }
    },
    {
      "prediction": "Riskware",
      "probabilities": {
        "Adware": 2.417274408573688e-13,
        "Banking": 2.0295671530923295e-09,
        "Benigan": 0.34735569671941097,
        "Riskware": 0.6526240083488143,
        "SMS Malware": 2.029290196592493e-05
      }
    },
    {
      "prediction": "SMS Malware",
      "probabilities": {
        "Adware": 2.397308837143087e-07,
        "Banking": 0.003169014134148682,
        "Benigan": 1.753803659104225e-07,
        "Riskware": 0.0005549663790788912,
        "SMS Malware": 0.9962756043755228
      }
    },
    {
      "prediction": "Banking",
      "probabilities": {
        "Adware": 0.0005963805741642157,
        "Banking": 0.9938934999099296,
        "Benigan": 2.2517100944077596e-14,
        "Riskware": 4.979071265306514e-08,
        "SMS Malware": 0.005510069725170962
      }
    },
    {
      "prediction": "Riskware",
      "probabilities": {
        "Adware": 2.6423369410429092e-15,
        "Banking": 6.990556457469674e-09,
        "Benigan": 0.184060447297815,
        "Riskware": 0.7575412677501089,
        "SMS Malware": 0.058398277961516976
      }
    },
    {
      "prediction": "Benigan",
      "probabilities": {
        "Adware": 3.762812168995495e-20,
        "Banking": 1.6874693904776528e-15,
        "Benigan": 0.9875359247785231,
        "Riskware": 0.012464075221442664,
        "SMS Malware": 3.2429201616367935e-14
      }
    }
  ]
};

export const categoryColors = {
  "Adware": "#217373",
  "Banking": "#73BFB8",
  "Benigan": "#F29E4C",
  "Riskware": "#732121",
  "SMS Malware": "#213C73"
};

export type PredictionType = typeof SampleData;
export type ResultType = typeof SampleData.results[0];