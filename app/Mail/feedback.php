<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class Feedback extends Mailable
{
    use Queueable, SerializesModels;

    public $feedbackData;

    /**
     * Create a new message instance.
     */
    public function __construct($feedbackData)
    {
        $this->feedbackData = $feedbackData;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('New Feedback: ' . $this->feedbackData['subject'])
                    ->view('emails.feedback')
                    ->with([
                        'name' => $this->feedbackData['name'],
                        'email' => $this->feedbackData['email'],
                        'subject' => $this->feedbackData['subject'],
                        'type' => $this->feedbackData['type'],
                        'user_message' => $this->feedbackData['message'],
                    ]);
    }
}
