<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #dee2e6;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.9em;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Feedback Received</h2>
        </div>

        <div class="content">
            <p><strong>From:</strong> {{ $name }} ({{ $email }})</p>
            <p><strong>Subject:</strong> {{ $subject }}</p>
            <p><strong>Type:</strong> {{ ucfirst($type) }}</p>

            <div style="margin-top: 20px;">
                <strong>Message:</strong>
                <p style="white-space: pre-line;">{{ $user_message }}</p>
            </div>
        </div>

        <div class="footer">
            <p>This is an automated message from your feedback system.</p>
        </div>
    </div>
</body>
</html>
