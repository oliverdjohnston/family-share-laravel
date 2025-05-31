<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// run complete data sync every 6 hours
Schedule::command('sync:all')->everySixHours()->withoutOverlapping();
