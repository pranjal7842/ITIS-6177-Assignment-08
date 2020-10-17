import json

def lambda_handler(event, context):
    # Get value from parameter:keyword
    keyword_val = event['queryStringParameters']['keyword']
    # Create greeting message
    greeting_message = 'Pranjal says ' + keyword_val
    return {
        'statusCode': 200,
        'body': json.dumps(greeting_message)
    }
