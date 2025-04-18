__all__ = (
    "VIEWED",
    "ADDED_TO_CART",
    "BOUGHT"
)

VIEWED = 0
ADDED_TO_CART = 1
BOUGHT = 2


def show(code: int):
    return __all__[code]
