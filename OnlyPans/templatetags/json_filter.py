import json
from django import template

register = template.Library()

@register.filter
def json_encode(value):
    """Converts a value into JSON format."""
    return json.dumps(value)
