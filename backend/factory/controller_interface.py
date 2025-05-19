from abc import ABC, abstractmethod


class ControllerInterface(ABC):
    """
    This abstract class defines the interface for a data controller.

    The interface specifies methods for performing CRUD (Create, Read, Update, Delete) operations
    on a MongoDB collection. Subclasses implementing this interface should provide concrete
    implementations for these methods.
    """

    @abstractmethod
    def find_all(self):
        raise NotImplementedError("find() not implemented")

    @abstractmethod
    def find_by_id(self, element_id):
        raise NotImplementedError("find_by_id() not implemented")

    @abstractmethod
    def create_ele(self):
        raise NotImplementedError("create_ele() not implemented")

    @abstractmethod
    def update_ele(self):
        raise NotImplementedError("update_ele() not implemented")

    @abstractmethod
    def delete_ele(self, element_id):
        raise NotImplementedError("delete_ele() not implemented")
