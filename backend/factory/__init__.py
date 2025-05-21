from .database import Database
from .helper import convert_to_timestamp
from .controller_interface import ControllerInterface
import config

def get_database_instance():
    """
    Returns the database instance.
    """
    return Database(config.DATABASE_NAME)
