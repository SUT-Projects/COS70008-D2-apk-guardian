from bson.timestamp import Timestamp
from datetime import datetime


def convert_to_timestamp(date_str):
    if date_str is None:
        return None
    try:
        if isinstance(date_str, Timestamp):
            return date_str

        if isinstance(date_str, datetime):
            return Timestamp(date_str, 1)

        return Timestamp(datetime.strptime(date_str, "%a, %d %b %Y %H:%M:%S %Z"), 1)
    except ValueError:
        return None
