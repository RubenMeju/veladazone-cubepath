from rest_framework.pagination import LimitOffsetPagination


class ArgumentPagination(LimitOffsetPagination):
    default_limit = 5  # número por página
    max_limit = 50  # máximo que puede pedir el cliente
