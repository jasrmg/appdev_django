from django import template
from django.utils.timesince import timesince
from django.utils.timezone import now, make_aware, is_aware
from django.utils.dateparse import parse_datetime
from datetime import datetime
from zoneinfo import ZoneInfo

register = template.Library()

@register.filter

def custom_timesince(value):
    if value is None:
        return "YAWA"
    if isinstance(value, str):
        value = parse_datetime(value)
        if value is None:
            return 'YAWA NAPUD'
    # Ensure value is in the local timezone
    if is_aware(value):
        value = value.astimezone(ZoneInfo("Asia/Manila"))
    else:
        value = make_aware(value, timezone=ZoneInfo("Asia/Manila"))

    # Calculate time difference relative to the current local time
    time_diff = timesince(value, now())

    # If the time difference is "just now", return that immediately
    if 'just' in time_diff:
        return "Just now"

    # Split the time difference to get the largest time unit
    time_diff_parts = time_diff.split(",")  # Split on comma to get each time unit separately
    largest_unit = time_diff_parts[0].strip()  # Take the first part and remove extra spaces

    # Return the largest unit with "ago" appended
    return f"{largest_unit}"
