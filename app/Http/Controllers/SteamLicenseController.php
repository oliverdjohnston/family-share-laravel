<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessSteamLicensesFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class SteamLicenseController extends Controller
{
    /**
     * Upload and process Steam licenses HTML file
     */
    public function upload(Request $request)
    {
        $request->validate([
            'licenses_file' => ['required', 'file', 'mimetypes:text/html,text/plain', 'max:10240'],
        ]);

        try {
            $user = $request->user();
            $file = $request->file('licenses_file');

            // store the file temporarily
            $filePath = $file->store('steam-licenses', 'private');

            // dispatch job to process the file
            ProcessSteamLicensesFile::dispatch($user, $filePath);

            return back()->with('success', 'Steam licenses file uploaded successfully! You will receive an email when the file has been processed.');

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to upload file: ' . $e->getMessage());
        }
    }

    /**
     * Remove uploaded licenses data
     */
    public function remove(Request $request)
    {
        try {
            $user = $request->user();

            // reset all acquired_at dates for this user
            $user->steamLibraryEntries()->update(['acquired_at' => null]);

            // set the steam_licenses_uploaded column to false
            $user->update(['steam_licenses_uploaded' => false]);

            return back()->with('success', 'Steam licenses data removed successfully. You can now upload a new file.');

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to remove licenses data: ' . $e->getMessage());
        }
    }
}
