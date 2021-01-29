from decimal import Decimal

def decimal_default(obj):
    if isinstance(obj, Decimal):
        if Decimal(obj) % 1 == 0:
            return int(obj)
        elif Decimal(obj) % 1 != 0:
            return str(round(obj, 4))
    elif isinstance(obj, int):
        return int(obj)
    elif isinstance(obj, str):
        return str(obj)
    else:
        return str(obj)
    raise TypeError
