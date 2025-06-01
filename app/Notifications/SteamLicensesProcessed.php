<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SteamLicensesProcessed extends Notification
{
    use Queueable;

    private User $user;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $gameCount = $this->user->steamLibraryEntries()->whereNotNull('acquired_at')->count();

        return (new MailMessage)
            ->subject('Steam Licenses Processing Complete')
            ->greeting('Hello ' . $this->user->name . '!')
            ->line('Your Steam licenses file has been successfully processed!')
            ->line("We've updated purchase dates for {$gameCount} games in your library.")
            ->line('Your game statistics and comparisons are now more accurate with the official Steam purchase dates.')
            ->action('View Your Profile', route('profile'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Steam licenses processed successfully',
            'game_count' => $this->user->steamLibraryEntries()->whereNotNull('acquired_at')->count(),
        ];
    }
}
