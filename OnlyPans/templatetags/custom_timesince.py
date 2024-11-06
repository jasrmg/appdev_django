from django import template
from django.utils.timesince import timesince

register = template.Library()

@register.filter
def custom_timesince(value):
    """
    Custom filter to display only the largest time unit: months, weeks, days, hours, or minutes.
    """
    # Get the time difference string (e.g., "2 weeks 5 days ago")
    time_diff = timesince(value)
    print('TIME DIF',time_diff)
    # Clean up non-breaking spaces and commas
    time_diff = time_diff.replace('\xa0', ' ').replace(',', '')  # Remove non-breaking spaces and commas
    print('TIME DIF // ',time_diff)
    # Split the time string into its parts
    time_parts = time_diff.split()
    print('TIME PARTS ',time_diff)
    # Check if the result is "just now"
    if 'just' in time_parts:
        return "Just now"

    # Check for months
    if "months" in time_parts:
        print('MONTH')
        return time_parts[0] + " month" + ("s" if int(time_parts[0]) > 1 else "")
    
    # Check for weeks
    elif "weeks" in time_parts:
        print('WEEK')
        return time_parts[0] + " week" + ("s" if int(time_parts[0]) > 1 else "")
    
    # Check for days
    elif "days" in time_parts:
        print('DAY')
        return time_parts[0] + " day" + ("s" if int(time_parts[0]) > 1 else "")
    
    # Check for hours
    elif "hours" in time_parts:
        print('HOUR')
        return time_parts[0] + " hour" + ("s" if int(time_parts[0]) > 1 else "")
    
    # Check for minutes
    elif "minutes" in time_parts:
        print('MINUTE')
        return time_parts[0] + " minute" + ("s" if int(time_parts[0]) > 1 else "")
    print('YAWAAA')
    return time_diff
